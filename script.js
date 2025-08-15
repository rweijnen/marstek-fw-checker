// MD5 hash function (simplified implementation)
function md5(string) {
    // Using a simplified MD5 implementation for browser compatibility
    // For production, consider using crypto-js library
    return CryptoJS.MD5(string).toString();
}

// Alternative MD5 implementation without external dependencies
function simpleMD5(string) {
    // This is a basic implementation - for production use crypto-js
    var hash = 0;
    if (string.length === 0) return hash.toString();
    for (var i = 0; i < string.length; i++) {
        var char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
}

// Better MD5 implementation using Web Crypto API
async function generateMD5(string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(string);
    const hashBuffer = await crypto.subtle.digest('MD5', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Proper MD5 implementation for browsers without crypto.subtle.digest MD5 support
function fallbackMD5(str) {
    // MD5 implementation based on RFC 1321
    function md5cycle(x, k) {
        var a = x[0], b = x[1], c = x[2], d = x[3];
        a = ff(a, b, c, d, k[0], 7, -680876936);
        d = ff(d, a, b, c, k[1], 12, -389564586);
        c = ff(c, d, a, b, k[2], 17, 606105819);
        b = ff(b, c, d, a, k[3], 22, -1044525330);
        a = ff(a, b, c, d, k[4], 7, -176418897);
        d = ff(d, a, b, c, k[5], 12, 1200080426);
        c = ff(c, d, a, b, k[6], 17, -1473231341);
        b = ff(b, c, d, a, k[7], 22, -45705983);
        a = ff(a, b, c, d, k[8], 7, 1770035416);
        d = ff(d, a, b, c, k[9], 12, -1958414417);
        c = ff(c, d, a, b, k[10], 17, -42063);
        b = ff(b, c, d, a, k[11], 22, -1990404162);
        a = ff(a, b, c, d, k[12], 7, 1804603682);
        d = ff(d, a, b, c, k[13], 12, -40341101);
        c = ff(c, d, a, b, k[14], 17, -1502002290);
        b = ff(b, c, d, a, k[15], 22, 1236535329);
        a = gg(a, b, c, d, k[1], 5, -165796510);
        d = gg(d, a, b, c, k[6], 9, -1069501632);
        c = gg(c, d, a, b, k[11], 14, 643717713);
        b = gg(b, c, d, a, k[0], 20, -373897302);
        a = gg(a, b, c, d, k[5], 5, -701558691);
        d = gg(d, a, b, c, k[10], 9, 38016083);
        c = gg(c, d, a, b, k[15], 14, -660478335);
        b = gg(b, c, d, a, k[4], 20, -405537848);
        a = gg(a, b, c, d, k[9], 5, 568446438);
        d = gg(d, a, b, c, k[14], 9, -1019803690);
        c = gg(c, d, a, b, k[3], 14, -187363961);
        b = gg(b, c, d, a, k[8], 20, 1163531501);
        a = gg(a, b, c, d, k[13], 5, -1444681467);
        d = gg(d, a, b, c, k[2], 9, -51403784);
        c = gg(c, d, a, b, k[7], 14, 1735328473);
        b = gg(b, c, d, a, k[12], 20, -1926607734);
        a = hh(a, b, c, d, k[5], 4, -378558);
        d = hh(d, a, b, c, k[8], 11, -2022574463);
        c = hh(c, d, a, b, k[11], 16, 1839030562);
        b = hh(b, c, d, a, k[14], 23, -35309556);
        a = hh(a, b, c, d, k[1], 4, -1530992060);
        d = hh(d, a, b, c, k[4], 11, 1272893353);
        c = hh(c, d, a, b, k[7], 16, -155497632);
        b = hh(b, c, d, a, k[10], 23, -1094730640);
        a = hh(a, b, c, d, k[13], 4, 681279174);
        d = hh(d, a, b, c, k[0], 11, -358537222);
        c = hh(c, d, a, b, k[3], 16, -722521979);
        b = hh(b, c, d, a, k[6], 23, 76029189);
        a = hh(a, b, c, d, k[9], 4, -640364487);
        d = hh(d, a, b, c, k[12], 11, -421815835);
        c = hh(c, d, a, b, k[15], 16, 530742520);
        b = hh(b, c, d, a, k[2], 23, -995338651);
        a = ii(a, b, c, d, k[0], 6, -198630844);
        d = ii(d, a, b, c, k[7], 10, 1126891415);
        c = ii(c, d, a, b, k[14], 15, -1416354905);
        b = ii(b, c, d, a, k[5], 21, -57434055);
        a = ii(a, b, c, d, k[12], 6, 1700485571);
        d = ii(d, a, b, c, k[3], 10, -1894986606);
        c = ii(c, d, a, b, k[10], 15, -1051523);
        b = ii(b, c, d, a, k[1], 21, -2054922799);
        a = ii(a, b, c, d, k[8], 6, 1873313359);
        d = ii(d, a, b, c, k[15], 10, -30611744);
        c = ii(c, d, a, b, k[6], 15, -1560198380);
        b = ii(b, c, d, a, k[13], 21, 1309151649);
        a = ii(a, b, c, d, k[4], 6, -145523070);
        d = ii(d, a, b, c, k[11], 10, -1120210379);
        c = ii(c, d, a, b, k[2], 15, 718787259);
        b = ii(b, c, d, a, k[9], 21, -343485551);
        x[0] = add32(a, x[0]);
        x[1] = add32(b, x[1]);
        x[2] = add32(c, x[2]);
        x[3] = add32(d, x[3]);
    }

    function cmn(q, a, b, x, s, t) {
        a = add32(add32(a, q), add32(x, t));
        return add32((a << s) | (a >>> (32 - s)), b);
    }
    function ff(a, b, c, d, x, s, t) {
        return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    function gg(a, b, c, d, x, s, t) {
        return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    function hh(a, b, c, d, x, s, t) {
        return cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function ii(a, b, c, d, x, s, t) {
        return cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    function md51(s) {
        var n = s.length, state = [1732584193, -271733879, -1732584194, 271733878], i;
        for (i = 64; i <= s.length; i += 64) {
            md5cycle(state, md5blk(s.substring(i - 64, i)));
        }
        s = s.substring(i - 64);
        var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < s.length; i++)
            tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(state, tail);
            for (i = 0; i < 16; i++) tail[i] = 0;
        }
        tail[14] = n * 8;
        md5cycle(state, tail);
        return state;
    }

    function md5blk(s) {
        var md5blks = [], i;
        for (i = 0; i < 64; i += 4) {
            md5blks[i >> 2] = s.charCodeAt(i)
                + (s.charCodeAt(i + 1) << 8)
                + (s.charCodeAt(i + 2) << 16)
                + (s.charCodeAt(i + 3) << 24);
        }
        return md5blks;
    }

    function rhex(n) {
        var hex_chr = '0123456789abcdef'.split('');
        var s = '', j = 0;
        for (j = 0; j < 4; j++)
            s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
                + hex_chr[(n >> (j * 8)) & 0x0F];
        return s;
    }

    function hex(x) {
        for (var i = 0; i < x.length; i++)
            x[i] = rhex(x[i]);
        return x.join('');
    }

    function add32(a, b) {
        return (a + b) & 0xFFFFFFFF;
    }

    return hex(md51(str));
}

// Global variables for session management
let currentToken = null;
let currentEmail = null;

// Authenticate user and get device list
async function authenticateUser(email, password) {
    try {
        // Hash password
        let passwordHash;
        try {
            passwordHash = await generateMD5(password);
        } catch (e) {
            console.log('Web Crypto API not available, using fallback hash');
            passwordHash = fallbackMD5(password);
        }

        // Authenticate and get device list using Netlify function
        const authParams = new URLSearchParams({
            endpoint: '/app/Solar/v2_get_device.php',
            pwd: passwordHash,
            mailbox: email
        });
        
        const proxiedAuthUrl = `/.netlify/functions/marstek-proxy?${authParams.toString()}`;
        
        console.log('Using Netlify proxy:', proxiedAuthUrl);

        const authResponse = await fetch(proxiedAuthUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });

        if (!authResponse.ok) {
            throw new Error(`Authentication failed: ${authResponse.status} ${authResponse.statusText}`);
        }

        const authText = await authResponse.text();
        console.log('Auth response:', authText);

        let authData;
        try {
            authData = JSON.parse(authText);
        } catch (e) {
            // Response might be plain text token
            authData = { token: authText.trim() };
        }

        const token = authData.token || authText.trim();
        
        if (!token) {
            throw new Error('No authentication token received');
        }

        // Store session data
        currentToken = token;
        currentEmail = email;

        return {
            success: true,
            token: token,
            devices: authData.data || []  // Changed from authData.devices to authData.data
        };

    } catch (error) {
        console.error('Authentication failed:', error);
        throw error;
    }
}

// Get firmware information for a specific device
async function getFirmwareInfo(deviceId, deviceType = 'HMG-50', currentVersion = '151') {
    if (!currentToken) {
        throw new Error('Not authenticated. Please login first.');
    }

    try {
        const isFourDigit = JSON.stringify({
            control: false,
            bms: false,
            micro: false,
            mppt: false
        });

        const firmwareParams = new URLSearchParams({
            endpoint: '/ems/api/v2/checkSmallBalconyOTA',
            uid: deviceId,
            lang: 'English',
            token: currentToken,
            device_type: deviceType,
            mailbox: currentEmail,
            click: 'false',
            is_fourDigit: isFourDigit,
            m: currentVersion
        });

        const proxiedUpdateUrl = `/.netlify/functions/marstek-proxy?${firmwareParams.toString()}`;

        console.log('Firmware check via Netlify proxy:', proxiedUpdateUrl);

        const response = await fetch(proxiedUpdateUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Firmware check failed: ${response.status} ${response.statusText}`);
        }

        const responseText = await response.text();
        console.log('Firmware response:', responseText);

        let firmwareData;
        try {
            firmwareData = JSON.parse(responseText);
        } catch (e) {
            throw new Error('Invalid JSON response from firmware API');
        }

        return firmwareData;

    } catch (error) {
        console.error('Firmware check failed:', error);
        throw error;
    }
}

// Download firmware file
async function downloadFirmware(downloadUrl, filename) {
    try {
        const proxiedUrl = currentCorsProxy ? currentCorsProxy + encodeURIComponent(downloadUrl) : downloadUrl;
        
        const response = await fetch(proxiedUrl);
        if (!response.ok) {
            throw new Error(`Download failed: ${response.status} ${response.statusText}`);
        }

        const blob = await response.blob();
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        return true;
    } catch (error) {
        console.error('Download failed:', error);
        throw error;
    }
}

// Display devices after successful login
function displayDevices(devices) {
    const deviceGrid = document.getElementById('deviceGrid');
    const devicesSection = document.getElementById('devicesSection');
    const loginSection = document.getElementById('loginSection');
    
    deviceGrid.innerHTML = '';
    
    if (devices && devices.length > 0) {
        devices.forEach(device => {
            const deviceCard = document.createElement('div');
            deviceCard.className = 'device-card';
            deviceCard.innerHTML = `
                <div class="device-status"></div>
                <div class="device-name">${device.name || `Device ${device.devid}`}</div>
                <div class="device-info">ID: ${device.devid}</div>
                <div class="device-info">Type: ${device.type || 'Unknown'}</div>
                <div class="device-info">Status: Online</div>
            `;
            
            deviceCard.addEventListener('click', () => {
                showFirmwareDetails(device);
            });
            
            deviceGrid.appendChild(deviceCard);
        });
    } else {
        deviceGrid.innerHTML = '<p style="color: #b0b0b0; text-align: center; padding: 40px;">No devices found in your account.</p>';
    }
    
    // Show devices section and hide login
    loginSection.style.display = 'none';
    devicesSection.style.display = 'block';
}

// Show firmware details modal
async function showFirmwareDetails(device) {
    const modal = document.getElementById('firmwareModal');
    const modalDeviceName = document.getElementById('modalDeviceName');
    const modalBody = document.getElementById('modalBody');
    
    modalDeviceName.textContent = `${device.name || `Device ${device.devid}`} - Firmware Details`;
    modalBody.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading firmware information...</p></div>';
    
    modal.style.display = 'block';
    
    try {
        const firmwareData = await getFirmwareInfo(device.devid, device.type || 'HMG-50');
        displayFirmwareDetails(device, firmwareData);
    } catch (error) {
        modalBody.innerHTML = `
            <div class="firmware-section">
                <h3>❌ Error Loading Firmware Data</h3>
                <p>Could not retrieve firmware information for this device.</p>
                <p><strong>Error:</strong> ${error.message}</p>
            </div>
        `;
    }
}

// Display firmware details in modal
function displayFirmwareDetails(device, firmwareData) {
    const modalBody = document.getElementById('modalBody');
    
    let html = '';
    
    // Device Information
    html += `
        <div class="firmware-section">
            <h3>📱 Device Information</h3>
            <div class="firmware-details">
                <div class="firmware-detail">
                    <label>Device Name</label>
                    <value>${device.name || `Device ${device.devid}`}</value>
                </div>
                <div class="firmware-detail">
                    <label>Device ID</label>
                    <value>${device.devid}</value>
                </div>
                <div class="firmware-detail">
                    <label>Device Type</label>
                    <value>${device.type || 'Unknown'}</value>
                </div>
                <div class="firmware-detail">
                    <label>Status</label>
                    <value>Online</value>
                </div>
            </div>
        </div>
    `;
    
    // Firmware Status
    const hasUpdates = firmwareData.hasUpdate || firmwareData.update_available || false;
    html += `
        <div class="firmware-section">
            <h3>${hasUpdates ? '🔄 Updates Available' : '✅ Up to Date'}</h3>
    `;
    
    if (hasUpdates) {
        html += '<p style="color: #FF9800; font-weight: 600;">New firmware versions are available for download!</p>';
        
        // Available firmware updates
        if (firmwareData.firmware) {
            html += `
                <div class="firmware-details">
                    <div class="firmware-detail">
                        <label>Main Firmware</label>
                        <value>${firmwareData.firmware.version || 'Unknown'}</value>
                    </div>
                </div>
            `;
            
            if (firmwareData.firmware.releaseNotes) {
                html += `
                    <div class="release-notes">
                        <h4>📝 Release Notes</h4>
                        <p>${firmwareData.firmware.releaseNotes}</p>
                    </div>
                `;
            }
            
            if (firmwareData.firmware.downloadUrl) {
                html += `
                    <div class="download-section">
                        <button class="btn btn-primary" onclick="downloadFirmware('${firmwareData.firmware.downloadUrl}', 'firmware_${device.devid}_${firmwareData.firmware.version}.bin')">
                            📥 Download Main Firmware
                        </button>
                    </div>
                `;
            }
        }
        
        // BMS firmware
        if (firmwareData.bms) {
            html += `
                <div class="firmware-details" style="margin-top: 15px;">
                    <div class="firmware-detail">
                        <label>BMS Firmware</label>
                        <value>${firmwareData.bms.version || 'Unknown'}</value>
                    </div>
                </div>
            `;
            
            if (firmwareData.bms.downloadUrl) {
                html += `
                    <div class="download-section">
                        <button class="btn btn-primary" onclick="downloadFirmware('${firmwareData.bms.downloadUrl}', 'bms_${device.devid}_${firmwareData.bms.version}.bin')">
                            📥 Download BMS Firmware
                        </button>
                    </div>
                `;
            }
        }
        
        // MPPT firmware
        if (firmwareData.mppt) {
            html += `
                <div class="firmware-details" style="margin-top: 15px;">
                    <div class="firmware-detail">
                        <label>MPPT Firmware</label>
                        <value>${firmwareData.mppt.version || 'Unknown'}</value>
                    </div>
                </div>
            `;
            
            if (firmwareData.mppt.downloadUrl) {
                html += `
                    <div class="download-section">
                        <button class="btn btn-primary" onclick="downloadFirmware('${firmwareData.mppt.downloadUrl}', 'mppt_${device.devid}_${firmwareData.mppt.version}.bin')">
                            📥 Download MPPT Firmware
                        </button>
                    </div>
                `;
            }
        }
    } else {
        html += '<p style="color: #4CAF50; font-weight: 600;">Your device is running the latest firmware versions.</p>';
    }
    
    html += '</div>';
    
    // Raw API Response (for debugging)
    html += `
        <div class="firmware-section">
            <h3>🔧 Technical Details</h3>
            <div class="release-notes">
                <h4>API Response</h4>
                <pre style="background: #2d2d2d; color: #e0e0e0; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 12px; max-height: 200px;">${JSON.stringify(firmwareData, null, 2)}</pre>
            </div>
        </div>
    `;
    
    modalBody.innerHTML = html;
}

// Display error
function displayError(error) {
    const errorContent = document.getElementById('errorContent');
    errorContent.innerHTML = `
        <p><strong>Error:</strong> ${error.message}</p>
        <p>This might be due to:</p>
        <ul>
            <li>CORS restrictions (try a different proxy)</li>
            <li>Invalid credentials</li>
            <li>Network connectivity issues</li>
            <li>API server being down</li>
        </ul>
        <p>Check the browser console for more details.</p>
    `;
}

// Login form handler
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Show loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('error').style.display = 'none';
    document.getElementById('loginBtn').disabled = true;

    try {
        const authResult = await authenticateUser(email, password);
        
        if (authResult.success) {
            displayDevices(authResult.devices);
        } else {
            throw new Error('Authentication failed');
        }
    } catch (error) {
        displayError(error);
        document.getElementById('error').style.display = 'block';
    } finally {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('loginBtn').disabled = false;
    }
});

// Logout handler
document.getElementById('logoutBtn').addEventListener('click', function() {
    // Clear session data
    currentToken = null;
    currentEmail = null;
    
    // Reset form
    document.getElementById('loginForm').reset();
    
    // Show login section and hide devices
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('devicesSection').style.display = 'none';
    document.getElementById('error').style.display = 'none';
    document.getElementById('results').style.display = 'none';
});

// Modal close handlers
document.querySelector('.modal-close').addEventListener('click', function() {
    document.getElementById('firmwareModal').style.display = 'none';
});

document.getElementById('closeModalBtn').addEventListener('click', function() {
    document.getElementById('firmwareModal').style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('firmwareModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Fetch and display GitHub version info
async function loadVersionInfo() {
    try {
        const response = await fetch('https://api.github.com/repos/rweijnen/marstek-fw-checker/commits/master');
        const commit = await response.json();
        
        const shortSha = commit.sha.substring(0, 7);
        const commitDate = new Date(commit.commit.author.date).toLocaleDateString();
        const commitMessage = commit.commit.message.split('\n')[0]; // First line only
        
        const versionInfo = document.getElementById('versionInfo');
        versionInfo.innerHTML = `
            <p>
                <small>
                    Version: <a href="https://github.com/rweijnen/marstek-fw-checker/commit/${commit.sha}" target="_blank">${shortSha}</a>
                    | ${commitDate} | ${commitMessage}
                </small>
            </p>
        `;
    } catch (error) {
        console.warn('Could not load version info:', error);
        const versionInfo = document.getElementById('versionInfo');
        versionInfo.innerHTML = '<p><small>Version info unavailable</small></p>';
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Marstek Firmware Query Tool loaded');
    
    // Check if Web Crypto API is available
    if (!crypto.subtle) {
        console.warn('Web Crypto API not available, using fallback hash function');
    }
    
    // Initialize UI state
    document.getElementById('devicesSection').style.display = 'none';
    document.getElementById('error').style.display = 'none';
    document.getElementById('results').style.display = 'none';
    
    // Load version information
    loadVersionInfo();
});