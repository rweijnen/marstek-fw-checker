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

// Fallback MD5 implementation
function fallbackMD5(str) {
    // Basic hash function as fallback
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
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
            devices: authData.devices || []
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
});