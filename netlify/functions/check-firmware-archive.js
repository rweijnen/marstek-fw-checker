const { Octokit } = require('@octokit/rest');

// Rate limiting store (in memory - resets on function restart)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const RATE_LIMIT_MAX_REQUESTS = 100;

function checkRateLimit(ip) {
    const now = Date.now();
    const key = ip;
    
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

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
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
                message: 'Maximum 100 requests per hour'
            })
        };
    }

    try {
        // Parse query parameters
        const params = event.queryStringParameters || {};
        const { deviceType, firmwareType, version } = params;

        // Validate required parameters
        const isCTDevice = deviceType && deviceType.startsWith('CT');
        const requiredParams = isCTDevice ? ['deviceType', 'version'] : ['deviceType', 'firmwareType', 'version'];
        
        for (const param of requiredParams) {
            if (!params[param]) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        error: 'Missing required parameters',
                        required: requiredParams,
                        provided: params
                    })
                };
            }
        }

        // Validate device types
        const validDeviceTypes = ['HMG-50', 'VNSE3-0', 'CT002', 'CT003'];
        if (!validDeviceTypes.includes(deviceType)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Invalid device type',
                    validTypes: validDeviceTypes,
                    provided: deviceType
                })
            };
        }

        // Check if GitHub token is available
        if (!process.env.GITHUB_TOKEN) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'GitHub token not configured',
                    message: 'Server configuration error'
                })
            };
        }

        // Initialize GitHub client
        const octokit = new Octokit({
            auth: process.env.GITHUB_TOKEN
        });

        const owner = 'rweijnen';
        const repo = 'marstek-firmware-archive';
        
        // CT devices have flatter structure (no firmware type subfolder)
        const isCTDevice = deviceType.startsWith('CT');
        const path = isCTDevice 
            ? `firmwares/${deviceType}/${version}`
            : `firmwares/${deviceType}/${firmwareType}/${version}`;

        try {
            // Check if the directory exists by trying to get its contents
            const { data: contents } = await octokit.rest.repos.getContent({
                owner,
                repo,
                path
            });

            // If we get here, the directory exists
            let metadata = null;
            let firmwareFile = null;

            // Look for metadata.json and firmware files
            if (Array.isArray(contents)) {
                const metadataFile = contents.find(file => file.name === 'metadata.json');
                const binFile = contents.find(file => file.name.endsWith('.bin'));

                if (metadataFile) {
                    try {
                        const { data: metadataContent } = await octokit.rest.repos.getContent({
                            owner,
                            repo,
                            path: metadataFile.path
                        });
                        
                        // Decode base64 content
                        const metadataJson = Buffer.from(metadataContent.content, 'base64').toString('utf-8');
                        metadata = JSON.parse(metadataJson);
                    } catch (error) {
                        console.log('Error reading metadata:', error.message);
                    }
                }

                if (binFile) {
                    firmwareFile = {
                        name: binFile.name,
                        size: binFile.size,
                        downloadUrl: `https://github.com/${owner}/${repo}/raw/main/${binFile.path}`,
                        sha: binFile.sha
                    };
                }
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    exists: true,
                    path,
                    metadata,
                    firmwareFile,
                    githubUrl: `https://github.com/${owner}/${repo}/tree/main/${path}`
                })
            };

        } catch (error) {
            // If error is 404, the directory doesn't exist
            if (error.status === 404) {
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        exists: false,
                        path,
                        message: 'Firmware version not found in archive'
                    })
                };
            }

            // Other errors
            throw error;
        }

    } catch (error) {
        console.error('Error checking firmware archive:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message
            })
        };
    }
};