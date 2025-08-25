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

        // Store raw response for console viewing
        sessionStorage.setItem('rawAuthResponse', authText);

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
async function getFirmwareInfo(deviceId, deviceType = 'HMG-50', currentVersion = '151', deviceName = '') {
    if (!currentToken) {
        throw new Error('Not authenticated. Please login first.');
    }

    try {
        // Check if this is a CT device by type or name
        const deviceNameUpper = deviceName ? deviceName.toUpperCase() : '';
        const isCTDevice = (deviceType && (deviceType.startsWith('CT') || deviceType.includes('CT('))) || 
                           deviceNameUpper.includes('CT002') || deviceNameUpper.includes('CT003') ||
                           deviceNameUpper.includes('CT(002)') || deviceNameUpper.includes('CT(003)');
        
        let params;
        
        if (isCTDevice) {
            // CT devices use a different API endpoint
            params = {
                endpoint: '/ems/api/v1/checkAcCoupleOta',
                m: '100',  // Using version 100 as baseline
                uid: deviceId,
                lang: 'English',
                click: 'true',
                token: currentToken,
                device_type: deviceType,
                mailbox: currentEmail
            };
        } else {
            // Venus E and other devices use the original endpoint
            const isFourDigit = JSON.stringify({
                control: false,
                bms: false,
                micro: false,
                mppt: false
            });

            // Use version 100 for all devices to check for updates
            // Version 0 causes "version param error" from the API
            const versionToUse = '100';

            params = {
                endpoint: '/ems/api/v2/checkSmallBalconyOTA',
                uid: deviceId,
                lang: 'English',
                token: currentToken,
                device_type: deviceType,
                mailbox: currentEmail,
                click: 'false',
                is_fourDigit: isFourDigit,
                m: versionToUse,
                sbv: '0',
                mppt: '0',
                inv: '0'
            };
        }

        const proxiedUrl = `/.netlify/functions/marstek-proxy?${new URLSearchParams(params).toString()}`;
        
        console.log('Firmware check for device type:', deviceType);
        console.log('Using endpoint:', params.endpoint);
        console.log('Firmware check parameters:', params);
        console.log('Firmware check URL:', proxiedUrl);

        const response = await fetch(proxiedUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const responseText = await response.text();
        console.log('Firmware response:', responseText);
        
        const firmwareData = JSON.parse(responseText);
        
        // Add debugging for empty firmware responses
        const hasAnyFirmware = Object.values(firmwareData.data || {}).some(value => 
            value && typeof value === 'object' && value.version
        );
        
        console.log(`Device ${deviceId}: Has firmware updates: ${hasAnyFirmware}`);
        if (!hasAnyFirmware) {
            console.log(`Device ${deviceId} parameters:`, { deviceId, deviceType, currentVersion });
            console.log(`Device ${deviceId} full response:`, firmwareData);
        }

        return firmwareData;

    } catch (error) {
        console.error('Firmware check failed:', error);
        throw error;
    }
}

// Download firmware file
function downloadFirmware(downloadUrl, filename) {
    try {
        console.log('Downloading firmware from:', downloadUrl);
        
        // Direct download - create a temporary link and click it
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = downloadUrl;
        a.download = filename;
        a.target = '_blank'; // Open in new tab as backup if download attribute doesn't work
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        return true;
    } catch (error) {
        console.error('Download failed:', error);
        alert(`Download failed: ${error.message}`);
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
            
            // Format the registration date
            const registrationDate = device.date ? new Date(device.date).toLocaleDateString() : 'Unknown';
            
            // Determine device image based on type or name
            let deviceImage = '';
            const deviceName = device.name ? device.name.toUpperCase() : '';
            
            if ((device.type && device.type.startsWith('VNSE')) || deviceName.includes('VENUS E V3') || deviceName.includes('VNSE')) {
                // Venus E V3
                deviceImage = `<img src="https://eu.marstekenergy.com/cdn/shop/files/1.1_a3444687-64a0-4ed7-8ed9-9f9966428883.jpg?v=1755566381" alt="Venus E V3" class="device-image">`;
            } else if ((device.type && (device.type === 'CT003' || device.type === 'CT(003)')) || deviceName.includes('CT003') || deviceName.includes('CT(003)')) {
                // CT003 device
                deviceImage = `<img src="https://eu.marstekenergy.com/cdn/shop/files/1_a21575ea-19c4-4f61-98d1-83e6112704a0.jpg?v=1739950399" alt="CT003" class="device-image">`;
            } else if ((device.type && (device.type === 'CT002' || device.type === 'CT(002)')) || deviceName.includes('CT002') || deviceName.includes('CT(002)')) {
                // CT002 device
                deviceImage = `<img src="https://eu.marstekenergy.com/cdn/shop/files/3_894259a1-4bf3-4f47-b87b-72efab6ea298.jpg?v=1740573047" alt="CT002" class="device-image">`;
            } else if (device.type === 'HMG-50' || deviceName.includes('VENUS E') || !device.type) {
                // Venus E V1/V2 or default
                deviceImage = `<img src="https://eu.marstekenergy.com/cdn/shop/files/1_2_d5e4109f-859e-46be-be9b-40e262490d4f.jpg?v=1740540638" alt="Venus E" class="device-image">`;
            }
            
            deviceCard.innerHTML = `
                <div class="device-status"></div>
                ${deviceImage}
                <button class="console-btn" onclick="showDeviceRawData(event, '${device.devid}')" title="Show raw device data">
                    <span class="console-icon">▢</span>
                </button>
                <div class="device-content">
                    <div class="device-name">${device.name || `Device ${device.devid}`}</div>
                    <div class="device-info">Type: ${device.type || 'Unknown'}</div>
                    <div class="device-info">Serial: ${device.sn || 'Not available'}</div>
                    <div class="device-info">MAC: ${device.mac || 'Unknown'}</div>
                    <div class="device-info">Bluetooth: ${device.bluetooth_name || 'Unknown'}</div>
                    <div class="device-info">Added: ${registrationDate}</div>
                    <div class="device-id">ID: ${device.devid}</div>
                </div>
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
        // Pass both device type and name for better detection
        const firmwareData = await getFirmwareInfo(device.devid, device.type || 'HMG-50', '100', device.name);
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

// Archive functionality
async function checkFirmwareArchive(deviceType, firmwareType, version) {
    try {
        // Build URL parameters - skip firmwareType for CT devices (empty string)
        let url = `/.netlify/functions/check-firmware-archive?deviceType=${encodeURIComponent(deviceType)}&version=${encodeURIComponent(version)}`;
        if (firmwareType && firmwareType.trim()) {
            url += `&firmwareType=${encodeURIComponent(firmwareType)}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to check archive');
        }
        
        return data;
    } catch (error) {
        console.error('Error checking firmware archive:', error);
        return { exists: false, error: error.message };
    }
}

async function submitFirmwareToArchive(metadata, deviceInfo, notes = '') {
    try {
        const response = await fetch('/.netlify/functions/submit-firmware-metadata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                metadata,
                deviceInfo,
                submissionNotes: notes
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to submit firmware');
        }
        
        return data;
    } catch (error) {
        console.error('Error submitting firmware:', error);
        throw error;
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

    // Archive Status Section
    html += `
        <div class="firmware-section" id="archiveSection">
            <h3>📚 Archive Status</h3>
            <div id="archiveStatus">
                <p style="color: #b0b0b0;">Checking archive status...</p>
            </div>
        </div>
    `;
    
    // Check if this is a CT device response format (different structure)
    const isCTResponse = firmwareData.newVerion && firmwareData.data && typeof firmwareData.data === 'string';
    
    // Firmware Status - Check if updates are actually available
    const hasActualUpdates = isCTResponse || (
        (firmwareData.data?.control && firmwareData.data.control.version) ||
        (firmwareData.data?.bms && firmwareData.data.bms.version) ||
        (firmwareData.data?.mppt && firmwareData.data.mppt.version) ||
        (firmwareData.data?.micro && firmwareData.data.micro.version) ||
        (firmwareData.data?.dcdc && firmwareData.data.dcdc.version)
    );
    
    html += `
        <div class="firmware-section">
            <h3>${hasActualUpdates ? '🔄 Updates Available' : '✅ Up to Date'}</h3>
    `;
    
    if (hasActualUpdates) {
        html += '<p style="color: #FF9800; font-weight: 600;">New firmware versions are available for download!</p>';
        
        // Handle CT device firmware (different response format)
        if (isCTResponse) {
            html += `
                <div class="firmware-details">
                    <div class="firmware-detail">
                        <label>Firmware Type</label>
                        <value>${firmwareData.otaWay || 'Standard'}</value>
                    </div>
                    <div class="firmware-detail">
                        <label>New Version</label>
                        <value>Version ${firmwareData.newVerion}</value>
                    </div>
                </div>
            `;
            
            // Release notes with translation
            if (firmwareData.english || firmwareData.chinese) {
                // For CT devices, 'english' field often contains Chinese text
                const releaseNotes = firmwareData.english || firmwareData.chinese;
                const notesId = `notes_ct_${Date.now()}`;
                
                // Check if the text contains Chinese characters
                const containsChinese = /[\u4e00-\u9fa5]/.test(releaseNotes);
                
                html += `
                    <div class="release-notes">
                        <h4>📝 Release Notes</h4>
                        <div id="${notesId}" class="release-notes-content">
                            <p class="original-text">${releaseNotes}</p>
                            <div class="translation-section" style="display: none;">
                                <p class="translated-text"></p>
                                <small class="translation-note">Translation provided by Google Translate</small>
                            </div>
                        </div>
                `;
                
                // Show translate button if text contains Chinese characters
                if (containsChinese) {
                    const notesForButton = releaseNotes.replace(/'/g, "\\'").replace(/\n/g, "\\n");
                    html += `
                        <button class="btn btn-secondary translate-btn" onclick="translateText('${notesId}', '${notesForButton}')">
                            🌐 Translate to English
                        </button>
                    `;
                }
                
                html += `</div>`;
            }
            
            // Download button for CT devices
            if (firmwareData.data) {
                const filename = firmwareData.data.split('/').pop() || `ct_firmware_v${firmwareData.newVerion}.bin`;
                html += `
                    <div class="download-section">
                        <button class="btn btn-primary" onclick="downloadFirmware('${firmwareData.data}', '${filename}')">
                            📥 Download Firmware v${firmwareData.newVerion}
                        </button>
                    </div>
                `;
            }
        }
        // BMS firmware (most common)
        if (firmwareData.data?.bms && firmwareData.data.bms.version) {
            html += `
                <div class="firmware-details">
                    <div class="firmware-detail">
                        <label>BMS Firmware</label>
                        <value>Version ${firmwareData.data.bms.version}</value>
                    </div>
                </div>
            `;
            
            if (firmwareData.data.bms.remark || firmwareData.data.bms.chinese) {
                const releaseNotes = firmwareData.data.bms.remark || firmwareData.data.bms.chinese;
                const notesId = `notes_bms_${Date.now()}`;
                html += `
                    <div class="release-notes">
                        <h4>📝 Release Notes</h4>
                        <div id="${notesId}" class="release-notes-content">
                            <p class="original-text">${releaseNotes}</p>
                            <div class="translation-section" style="display: none;">
                                <p class="translated-text"></p>
                                <small class="translation-note">Translation provided by Google Translate</small>
                            </div>
                        </div>
                        <button class="btn btn-secondary translate-btn" onclick="translateText('${notesId}', '${releaseNotes.replace(/'/g, "\\'")}')">
                            🌐 Translate to English
                        </button>
                    </div>
                `;
            }
            
            if (firmwareData.data.bms.url) {
                html += `
                    <div class="download-section">
                        <button class="btn btn-primary" onclick="downloadFirmware('${firmwareData.data.bms.url}', 'bms_${device.devid}_v${firmwareData.data.bms.version}.bin')">
                            📥 Download BMS Firmware v${firmwareData.data.bms.version}
                        </button>
                    </div>
                `;
            }
        }
        
        // Control firmware (EMS)
        if (firmwareData.data?.control && firmwareData.data.control.version) {
            html += `
                <div class="firmware-details" style="margin-top: 15px;">
                    <div class="firmware-detail">
                        <label>Control Firmware (EMS)</label>
                        <value>Version ${firmwareData.data.control.version}</value>
                    </div>
                </div>
            `;
            
            if (firmwareData.data.control.remark || firmwareData.data.control.chinese) {
                const releaseNotes = firmwareData.data.control.remark || firmwareData.data.control.chinese;
                const notesId = `notes_control_${Date.now()}`;
                html += `
                    <div class="release-notes">
                        <h4>📝 Release Notes</h4>
                        <div id="${notesId}" class="release-notes-content">
                            <p class="original-text">${releaseNotes}</p>
                            <div class="translation-section" style="display: none;">
                                <p class="translated-text"></p>
                                <small class="translation-note">Translation provided by Google Translate</small>
                            </div>
                        </div>
                        <button class="btn btn-secondary translate-btn" onclick="translateText('${notesId}', '${releaseNotes.replace(/'/g, "\\'")}')">
                            🌐 Translate to English
                        </button>
                    </div>
                `;
            }
            
            if (firmwareData.data.control.url) {
                html += `
                    <div class="download-section">
                        <button class="btn btn-primary" onclick="downloadFirmware('${firmwareData.data.control.url}', 'control_${device.devid}_v${firmwareData.data.control.version}.bin')">
                            📥 Download Control Firmware v${firmwareData.data.control.version}
                        </button>
                    </div>
                `;
            }
        }
        
        // MPPT firmware
        if (firmwareData.data?.mppt && firmwareData.data.mppt.version) {
            html += `
                <div class="firmware-details" style="margin-top: 15px;">
                    <div class="firmware-detail">
                        <label>MPPT Firmware</label>
                        <value>Version ${firmwareData.data.mppt.version}</value>
                    </div>
                </div>
            `;
            
            if (firmwareData.data.mppt.url) {
                html += `
                    <div class="download-section">
                        <button class="btn btn-primary" onclick="downloadFirmware('${firmwareData.data.mppt.url}', 'mppt_${device.devid}_v${firmwareData.data.mppt.version}.bin')">
                            📥 Download MPPT Firmware v${firmwareData.data.mppt.version}
                        </button>
                    </div>
                `;
            }
        }
    } else {
        html += '<p style="color: #4CAF50; font-weight: 600;">No firmware updates found. This could mean:<br>• You already have the latest firmware<br>• No updates are available for your device model<br>• Current firmware versions were not provided</p>';
    }
    
    html += '</div>';
    
    // Raw API Response (for debugging)
    html += `
        <div class="firmware-section">
            <h3>🔧 Technical Details 
                <button class="console-btn inline" onclick="showFirmwareRawData('${device.devid}')" title="Show raw API response">
                    <span class="console-icon">▢</span>
                </button>
            </h3>
            <div class="release-notes">
                <h4>API Response Summary</h4>
                <pre style="background: #2d2d2d; color: #e0e0e0; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 12px; max-height: 200px;">${JSON.stringify(firmwareData, null, 2)}</pre>
            </div>
        </div>
    `;
    
    modalBody.innerHTML = html;
    
    // Check archive status for available firmware versions
    updateArchiveStatus(device, firmwareData);
}

async function updateArchiveStatus(device, firmwareData) {
    const archiveStatusDiv = document.getElementById('archiveStatus');
    if (!archiveStatusDiv) return;
    
    let archiveHtml = '';
    const archiveChecks = [];
    
    // Determine device type for archive
    let archiveDeviceType = device.type || 'HMG-50'; // Default fallback
    
    // Map device types to archive format
    if (device.type === '1' || (device.name && (device.name.includes('CT002') || device.name.includes('CT003')))) {
        archiveDeviceType = device.name?.includes('CT002') ? 'CT002' : 'CT003';
    } else if (device.type === 'VNSE3-0' || device.name?.includes('VNSE3')) {
        archiveDeviceType = 'VNSE3-0';
    }
    
    // Check CT device archive status
    const isCTResponse = firmwareData.newVerion && firmwareData.data && typeof firmwareData.data === 'string';
    if (isCTResponse) {
        const version = firmwareData.newVerion;
        
        archiveChecks.push({
            type: 'Firmware', // CT devices have single firmware type
            version: version,
            deviceType: archiveDeviceType,
            metadata: {
                deviceType: archiveDeviceType,
                // No firmwareType for CT devices - flatter structure
                version: version,
                url: firmwareData.data,
                otaWay: firmwareData.otaWay,
                chinese: firmwareData.chinese,
                english: firmwareData.english,
                apiResponse: firmwareData
            }
        });
    } else {
        // Check standard device firmware types
        if (firmwareData.data?.bms && firmwareData.data.bms.version) {
            archiveChecks.push({
                type: 'BMS',
                version: firmwareData.data.bms.version,
                deviceType: archiveDeviceType,
                metadata: {
                    deviceType: archiveDeviceType,
                    firmwareType: 'BMS',
                    version: firmwareData.data.bms.version,
                    url: firmwareData.data.bms.url,
                    remark: firmwareData.data.bms.remark,
                    chinese: firmwareData.data.bms.chinese,
                    apiResponse: firmwareData
                }
            });
        }
        
        if (firmwareData.data?.control && firmwareData.data.control.version) {
            archiveChecks.push({
                type: 'Control',
                version: firmwareData.data.control.version,
                deviceType: archiveDeviceType,
                metadata: {
                    deviceType: archiveDeviceType,
                    firmwareType: 'Control',
                    version: firmwareData.data.control.version,
                    url: firmwareData.data.control.url,
                    remark: firmwareData.data.control.remark,
                    chinese: firmwareData.data.control.chinese,
                    apiResponse: firmwareData
                }
            });
        }
        
        if (firmwareData.data?.mppt && firmwareData.data.mppt.version) {
            archiveChecks.push({
                type: 'MPPT',
                version: firmwareData.data.mppt.version,
                deviceType: archiveDeviceType,
                metadata: {
                    deviceType: archiveDeviceType,
                    firmwareType: 'MPPT',
                    version: firmwareData.data.mppt.version,
                    url: firmwareData.data.mppt.url,
                    remark: firmwareData.data.mppt.remark,
                    chinese: firmwareData.data.mppt.chinese,
                    apiResponse: firmwareData
                }
            });
        }
    }
    
    if (archiveChecks.length === 0) {
        archiveHtml = '<p style="color: #b0b0b0;">No firmware versions available to archive.</p>';
    } else {
        archiveHtml = '<div class="firmware-details">';
        
        // Check each firmware type
        for (const check of archiveChecks) {
            // For CT devices, don't pass firmware type (flatter structure)
            const isCTDevice = check.deviceType.startsWith('CT');
            const archiveResult = isCTDevice 
                ? await checkFirmwareArchive(check.deviceType, '', check.version)
                : await checkFirmwareArchive(check.deviceType, check.type, check.version);
            
            archiveHtml += `
                <div class="firmware-detail">
                    <label>${check.type} v${check.version}</label>
                    <value style="display: flex; align-items: center; gap: 10px;">
            `;
            
            if (archiveResult.exists) {
                archiveHtml += `
                    <span style="color: #4CAF50;">✅ Archived</span>
                    <a href="${archiveResult.githubUrl}" target="_blank" class="btn" style="font-size: 11px; padding: 4px 8px; margin: 0;">
                        📁 View Archive
                    </a>
                `;
            } else {
                const submitId = `submit_${check.type}_${check.version}`.replace(/\./g, '_');
                archiveHtml += `
                    <span style="color: #FF9800;">📥 Not Archived</span>
                    <button id="${submitId}" class="btn btn-secondary" style="font-size: 11px; padding: 4px 8px; margin: 0;" 
                            onclick="submitToArchive('${submitId}', ${JSON.stringify(check.metadata).replace(/"/g, '&quot;')}, ${JSON.stringify(device).replace(/"/g, '&quot;')})">
                        🚀 Submit for Archive
                    </button>
                `;
            }
            
            archiveHtml += `
                    </value>
                </div>
            `;
        }
        
        archiveHtml += '</div>';
        
        // Add archive info
        archiveHtml += `
            <div style="margin-top: 15px; padding: 12px; background: rgba(76, 175, 80, 0.1); border-left: 3px solid #4CAF50; border-radius: 4px;">
                <h4 style="color: #4CAF50; margin: 0 0 8px 0; font-size: 14px;">🗃️ About the Archive</h4>
                <p style="color: #b0b0b0; font-size: 12px; margin: 0;">
                    The firmware archive preserves firmware files and metadata for the community. 
                    Submitting firmware helps ensure versions remain available even if removed from official servers.
                </p>
            </div>
        `;
    }
    
    archiveStatusDiv.innerHTML = archiveHtml;
}

async function submitToArchive(buttonId, metadata, deviceInfo) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    
    const originalText = button.innerHTML;
    button.innerHTML = '⏳ Submitting...';
    button.disabled = true;
    
    try {
        const result = await submitFirmwareToArchive(metadata, deviceInfo, 'Submitted via web interface');
        
        if (result.success) {
            button.innerHTML = '✅ Submitted!';
            button.classList.remove('btn-secondary');
            button.classList.add('btn-warning');
            
            // Update button to show tracking info
            setTimeout(() => {
                button.innerHTML = `📋 Issue #${result.issueNumber}`;
                button.onclick = () => window.open(result.issueUrl, '_blank');
            }, 2000);
        } else if (result.existingIssue) {
            // Duplicate submission - show existing issue
            button.innerHTML = '⚠️ Already Queued';
            button.classList.remove('btn-secondary');
            button.classList.add('btn-warning');
            button.disabled = true;
            
            setTimeout(() => {
                button.innerHTML = `📋 Issue #${result.existingIssue.number}`;
                button.onclick = () => window.open(result.existingIssue.url, '_blank');
            }, 2000);
        } else {
            throw new Error(result.message || 'Submission failed');
        }
    } catch (error) {
        console.error('Submission error:', error);
        button.innerHTML = '❌ Failed';
        button.disabled = false;
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 3000);
        
        alert(`Failed to submit firmware: ${error.message}`);
    }
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
            // Store device list for console access
            sessionStorage.setItem('deviceList', JSON.stringify(authResult.devices));
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
// Get all modal close buttons and add event listeners
document.querySelectorAll('.modal-close').forEach(function(closeBtn) {
    closeBtn.addEventListener('click', function() {
        // Find the parent modal and close it
        const modal = this.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
        }
    });
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

// Translation function using a free translation API
async function translateText(containerId, originalText) {
    const container = document.getElementById(containerId);
    const translateBtn = container.parentElement.querySelector('.translate-btn');
    const translationSection = container.querySelector('.translation-section');
    const translatedTextElement = container.querySelector('.translated-text');
    
    // Show loading state
    translateBtn.disabled = true;
    translateBtn.textContent = '🔄 Translating...';
    
    try {
        // Using MyMemory Translation API (free tier)
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(originalText)}&langpair=zh|en`);
        const data = await response.json();
        
        if (data.responseStatus === 200 && data.responseData.translatedText) {
            translatedTextElement.textContent = data.responseData.translatedText;
            translationSection.style.display = 'block';
            translateBtn.textContent = '✅ Translated';
            translateBtn.disabled = true;
        } else {
            throw new Error('Translation failed');
        }
    } catch (error) {
        console.error('Translation error:', error);
        
        translatedTextElement.innerHTML = `
            <em>Translation service unavailable.</em><br>
            <small style="color: #888;">Please try again later or use an online translator.</small>
        `;
        translationSection.style.display = 'block';
        translateBtn.textContent = '❌ Translation Failed';
        translateBtn.disabled = true;
    }
}

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

// WIP modal functions
function showWipInfo() {
    document.getElementById('wipModal').style.display = 'block';
}

function closeWipModal() {
    document.getElementById('wipModal').style.display = 'none';
}

// Console modal functions
function showDeviceRawData(event, deviceId) {
    event.stopPropagation(); // Prevent device card click
    
    // Find the device data
    const devices = JSON.parse(sessionStorage.getItem('deviceList') || '[]');
    const device = devices.find(d => d.devid === deviceId);
    
    if (device) {
        const modal = document.getElementById('consoleModal');
        const title = document.getElementById('consoleModalTitle');
        const content = document.getElementById('consoleContent');
        
        title.textContent = `Raw Device Data - ${device.name || deviceId}`;
        content.textContent = JSON.stringify(device, null, 2);
        modal.style.display = 'block';
    }
}

async function showFirmwareRawData(deviceId) {
    const devices = JSON.parse(sessionStorage.getItem('deviceList') || '[]');
    const device = devices.find(d => d.devid === deviceId);
    
    if (!device) return;
    
    const modal = document.getElementById('consoleModal');
    const title = document.getElementById('consoleModalTitle');
    const content = document.getElementById('consoleContent');
    
    title.textContent = `Raw Firmware API Response - ${device.name || deviceId}`;
    content.textContent = 'Loading firmware data...';
    modal.style.display = 'block';
    
    try {
        // Determine which API endpoint and parameters will be used
        const deviceNameUpper = device.name ? device.name.toUpperCase() : '';
        const isCTDevice = (device.type && (device.type.startsWith('CT') || device.type.includes('CT('))) || 
                           deviceNameUpper.includes('CT002') || deviceNameUpper.includes('CT003') ||
                           deviceNameUpper.includes('CT(002)') || deviceNameUpper.includes('CT(003)');
        
        let apiUrl, params;
        if (isCTDevice) {
            // CT device endpoint
            apiUrl = 'https://eu.hamedata.com/ems/api/v1/checkAcCoupleOta';
            params = {
                'm': '100',
                'uid': device.devid,
                'lang': 'English',
                'click': 'true',
                'token': currentToken,
                'device_type': device.type,
                'mailbox': currentEmail
            };
        } else {
            // Venus E and other devices
            apiUrl = 'https://eu.hamedata.com/ems/api/v2/checkSmallBalconyOTA';
            params = {
                'uid': device.devid,
                'lang': 'English',
                'token': currentToken,
                'device_type': device.type,
                'mailbox': currentEmail,
                'click': 'false',
                'is_fourDigit': '{"control":false,"bms":false,"micro":false,"mppt":false}',
                'm': '100',
                'sbv': '0',
                'mppt': '0',
                'inv': '0'
            };
        }
        
        // Build full URL with parameters
        const urlParams = new URLSearchParams(params);
        const fullUrl = `${apiUrl}?${urlParams.toString()}`;
        
        // Make the API call
        const firmwareData = await getFirmwareInfo(device.devid, device.type || 'HMG-50', '100', device.name);
        
        // Show raw response with API details
        const rawResponse = {
            device: {
                id: device.devid,
                name: device.name,
                type: device.type,
                detectedAs: isCTDevice ? 'CT Device' : 'Standard Device'
            },
            apiCall: {
                endpoint: isCTDevice ? '/ems/api/v1/checkAcCoupleOta' : '/ems/api/v2/checkSmallBalconyOTA',
                fullUrl: fullUrl,
                method: 'GET',
                parameters: params
            },
            timestamp: new Date().toISOString(),
            response: firmwareData
        };
        
        // Store original data for reset functionality
        originalApiData = rawResponse;
        
        // Show API tester section and populate URL field
        const apiTestSection = document.getElementById('apiTestSection');
        const apiUrlField = document.getElementById('apiUrl');
        
        apiTestSection.style.display = 'block';
        apiUrlField.value = fullUrl;
        
        content.textContent = JSON.stringify(rawResponse, null, 2);
    } catch (error) {
        content.textContent = `Error fetching firmware data:\n${error.message}`;
    }
}

function showDevicesRawData() {
    const rawAuthResponse = sessionStorage.getItem('rawAuthResponse');
    const devices = JSON.parse(sessionStorage.getItem('deviceList') || '[]');
    
    const modal = document.getElementById('consoleModal');
    const title = document.getElementById('consoleModalTitle');
    const content = document.getElementById('consoleContent');
    
    title.textContent = 'Raw Devices API Response';
    
    if (rawAuthResponse) {
        // Show the complete raw authentication response
        try {
            const parsedResponse = JSON.parse(rawAuthResponse);
            const formattedResponse = {
                endpoint: '/app/Solar/v2_get_device.php',
                timestamp: new Date().toISOString(),
                response: parsedResponse,
                deviceCount: devices.length
            };
            content.textContent = JSON.stringify(formattedResponse, null, 2);
        } catch (e) {
            // If not valid JSON, show as text
            content.textContent = `Raw Authentication Response:\n\n${rawAuthResponse}`;
        }
    } else {
        // Fallback to device list
        const fallbackData = {
            endpoint: '/app/Solar/v2_get_device.php',
            timestamp: new Date().toISOString(),
            note: 'Raw response not available, showing parsed device list',
            devices: devices
        };
        content.textContent = JSON.stringify(fallbackData, null, 2);
    }
    
    modal.style.display = 'block';
}

function closeConsoleModal() {
    document.getElementById('consoleModal').style.display = 'none';
    // Hide API tester when closing
    document.getElementById('apiTestSection').style.display = 'none';
}

// Store original API data for reset functionality
let originalApiData = null;

async function testCustomUrl() {
    const customUrl = document.getElementById('apiUrl').value.trim();
    const content = document.getElementById('consoleContent');
    
    if (!customUrl) {
        content.textContent = 'Error: Please enter a valid API URL';
        return;
    }
    
    content.textContent = 'Testing custom API call...';
    
    try {
        // Parse the URL to separate endpoint and parameters
        const urlObj = new URL(customUrl);
        const endpoint = urlObj.pathname + urlObj.search; // e.g., "/ems/api/v1/checkAcCoupleOta?m=101&uid=..."
        
        // Build proxy URL with just the endpoint (including query string)
        const proxyUrl = `/.netlify/functions/marstek-proxy?endpoint=${encodeURIComponent(endpoint)}`;
        
        console.log('Testing custom URL:', customUrl);
        console.log('Extracted endpoint:', endpoint);
        console.log('Proxy URL:', proxyUrl);
        
        const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });
        
        const responseText = await response.text();
        console.log('Custom API response:', responseText);
        
        let responseData;
        
        try {
            responseData = JSON.parse(responseText);
        } catch (e) {
            responseData = responseText;
        }
        
        const testResult = {
            customApiCall: {
                originalUrl: customUrl,
                extractedEndpoint: endpoint,
                proxyUrl: proxyUrl,
                status: response.status,
                statusText: response.statusText,
                method: 'GET'
            },
            timestamp: new Date().toISOString(),
            response: responseData
        };
        
        content.textContent = JSON.stringify(testResult, null, 2);
        
    } catch (error) {
        console.error('Custom API test error:', error);
        
        const errorResult = {
            customApiCall: {
                url: customUrl,
                error: error.message,
                stack: error.stack
            },
            timestamp: new Date().toISOString()
        };
        
        content.textContent = JSON.stringify(errorResult, null, 2);
    }
}

function resetToOriginal() {
    if (originalApiData) {
        const content = document.getElementById('consoleContent');
        const apiUrl = document.getElementById('apiUrl');
        
        content.textContent = JSON.stringify(originalApiData, null, 2);
        
        // Reset URL field to original
        if (originalApiData.apiCall && originalApiData.apiCall.fullUrl) {
            apiUrl.value = originalApiData.apiCall.fullUrl;
        }
    }
}

function copyConsoleContent() {
    const content = document.getElementById('consoleContent');
    const text = content.textContent;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            // Show temporary feedback
            const btn = event.target;
            const originalText = btn.textContent;
            btn.textContent = '✅ Copied!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✅ Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
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
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const wipModal = document.getElementById('wipModal');
        const consoleModal = document.getElementById('consoleModal');
        
        if (event.target === wipModal) {
            wipModal.style.display = 'none';
        }
        if (event.target === consoleModal) {
            consoleModal.style.display = 'none';
        }
    });
});