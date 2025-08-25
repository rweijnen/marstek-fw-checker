const { Octokit } = require('@octokit/rest');

// Rate limiting store (in memory - resets on function restart)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds  
const RATE_LIMIT_MAX_REQUESTS = 20; // Lower limit for submissions

function checkRateLimit(ip) {
    const now = Date.now();
    const key = `submit_${ip}`;
    
    if (!rateLimitStore.has(key)) {
        rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return true;
    }
    
    const limit = rateLimitStore.get(key);
    
    // Reset if window expired
    if (now > limit.resetTime) {
        rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return true;
    }
    
    if (limit.count >= RATE_LIMIT_MAX_REQUESTS) {
        return false;
    }
    
    limit.count++;
    return true;
}

function validateOrigin(headers) {
    const origin = headers.origin || headers.referer;
    if (!origin) return false;
    
    // Allow requests from Netlify site and localhost for development
    const allowedOrigins = [
        'https://marstek-fw-checker.netlify.app',
        'http://localhost:8000',
        'http://localhost:3000',
        'http://127.0.0.1:8000'
    ];
    
    return allowedOrigins.some(allowed => origin.startsWith(allowed));
}

function validateMetadata(metadata) {
    // Check required fields
    const required = ['deviceType', 'version'];
    // For non-CT devices, firmwareType is also required
    const isCTDevice = metadata.deviceType && metadata.deviceType.startsWith('CT');
    if (!isCTDevice) {
        required.push('firmwareType');
    }
    
    for (const field of required) {
        if (!metadata[field]) {
            throw new Error(`Missing required field: ${field}`);
        }
    }
    
    // Validate device types
    const validDeviceTypes = ['HMG-50', 'VNSE3-0', 'CT002', 'CT003'];
    if (!validDeviceTypes.includes(metadata.deviceType)) {
        throw new Error(`Invalid device type: ${metadata.deviceType}`);
    }
    
    // Validate firmware types (only for non-CT devices)
    if (!isCTDevice) {
        const validFirmwareTypes = ['BMS', 'Control', 'MPPT', 'EMS'];
        if (!validFirmwareTypes.includes(metadata.firmwareType)) {
            throw new Error(`Invalid firmware type: ${metadata.firmwareType}`);
        }
    }
    
    // Check for S3 bucket reference (security check)
    const dataStr = JSON.stringify(metadata);
    if (!dataStr.includes('amazonaws.com') && !dataStr.includes('hame-ota')) {
        throw new Error('Invalid firmware source - expected AWS S3 bucket');
    }
    
    // Validate version format (basic check)
    if (!/^[\d\.]+$/.test(metadata.version) && metadata.version !== '100') {
        throw new Error(`Invalid version format: ${metadata.version}`);
    }
    
    return true;
}

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Origin'
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed - use POST' })
        };
    }

    try {
        // Validate origin
        if (!validateOrigin(event.headers)) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ 
                    error: 'Forbidden - invalid origin',
                    origin: event.headers.origin || event.headers.referer
                })
            };
        }

        // Rate limiting
        const clientIP = event.headers['client-ip'] || event.headers['x-forwarded-for'] || 'unknown';
        if (!checkRateLimit(clientIP)) {
            return {
                statusCode: 429,
                headers,
                body: JSON.stringify({ 
                    error: 'Rate limit exceeded',
                    message: 'Maximum 20 submissions per hour'
                })
            };
        }

        // Parse request body
        let requestData;
        try {
            requestData = JSON.parse(event.body);
        } catch (error) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid JSON in request body' })
            };
        }

        const { metadata, deviceInfo, submissionNotes } = requestData;

        if (!metadata) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing metadata in request' })
            };
        }

        // Validate metadata
        try {
            validateMetadata(metadata);
        } catch (error) {
            console.error('Metadata validation failed:', error.message);
            console.error('Received metadata:', JSON.stringify(metadata, null, 2));
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Invalid metadata', 
                    message: error.message,
                    receivedMetadata: metadata // Debug info
                })
            };
        }

        // Check if GitHub token is available
        if (!process.env.GITHUB_TOKEN) {
            console.error('GITHUB_TOKEN environment variable is not set');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'GitHub token not configured',
                    message: 'Server configuration error - missing GITHUB_TOKEN'
                })
            };
        }

        // Initialize GitHub client
        const octokit = new Octokit({
            auth: process.env.GITHUB_TOKEN
        });

        const owner = 'rweijnen';
        const repo = 'marstek-firmware-archive';

        // Determine if this is a CT device for URL generation
        const isCTDevice = metadata.deviceType.startsWith('CT');

        // Check for existing open issues for the same firmware version
        const searchQuery = isCTDevice 
            ? `repo:${owner}/${repo} is:issue is:open label:firmware-submission "${metadata.deviceType} v${metadata.version}"`
            : `repo:${owner}/${repo} is:issue is:open label:firmware-submission "${metadata.deviceType} ${metadata.firmwareType} v${metadata.version}"`;

        try {
            const { data: searchResults } = await octokit.rest.search.issuesAndPullRequests({
                q: searchQuery,
                per_page: 5
            });

            if (searchResults.total_count > 0) {
                // Found existing issue(s) for this firmware version
                const existingIssue = searchResults.items[0];
                return {
                    statusCode: 409, // Conflict
                    headers,
                    body: JSON.stringify({
                        success: false,
                        error: 'Firmware submission already exists',
                        message: 'This firmware version is already queued for archival',
                        existingIssue: {
                            number: existingIssue.number,
                            title: existingIssue.title,
                            url: existingIssue.html_url,
                            state: existingIssue.state,
                            created_at: existingIssue.created_at
                        }
                    })
                };
            }
        } catch (searchError) {
            console.log('Search error (non-critical):', searchError.message);
            // Continue with submission if search fails
        }

        // Create issue with firmware metadata  
        const issueTitle = isCTDevice 
            ? `[Firmware Submission] ${metadata.deviceType} v${metadata.version}`
            : `[Firmware Submission] ${metadata.deviceType} ${metadata.firmwareType} v${metadata.version}`;
        
        const issueBody = `## Firmware Submission Request

**Device Type:** ${metadata.deviceType}
${isCTDevice ? '' : `**Firmware Type:** ${metadata.firmwareType}`}
**Version:** ${metadata.version}
**Submitted:** ${new Date().toISOString()}

### Device Information
${deviceInfo ? JSON.stringify(deviceInfo, null, 2) : 'Not provided'}

### Firmware Metadata
\`\`\`json
${JSON.stringify(metadata, null, 2)}
\`\`\`

### Submission Notes
${submissionNotes || 'None provided'}

---
*This issue was automatically created by the firmware submission system.*
`;

        try {
            const { data: issue } = await octokit.rest.issues.create({
                owner,
                repo,
                title: issueTitle,
                body: issueBody,
                labels: ['firmware-submission', 'automated']
            });

            // Trigger repository dispatch event for GitHub Actions
            try {
                await octokit.rest.repos.createDispatchEvent({
                    owner,
                    repo,
                    event_type: 'firmware_submission',
                    client_payload: {
                        issue_number: issue.number,
                        deviceType: metadata.deviceType,
                        firmwareType: metadata.firmwareType,
                        version: metadata.version,
                        metadata: metadata
                    }
                });
            } catch (dispatchError) {
                console.log('Repository dispatch failed (non-critical):', dispatchError.message);
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: 'Firmware submission received',
                    issueNumber: issue.number,
                    issueUrl: issue.html_url,
                    trackingId: `${metadata.deviceType}-${metadata.firmwareType}-${metadata.version}-${Date.now()}`
                })
            };

        } catch (githubError) {
            console.error('GitHub API error:', githubError);
            
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Failed to submit to GitHub',
                    message: githubError.message
                })
            };
        }

    } catch (error) {
        console.error('Error in firmware submission:', error);
        console.error('Error stack:', error.stack);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message,
                details: `${error.name}: ${error.message}`
            })
        };
    }
};