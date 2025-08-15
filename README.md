# Marstek Firmware Query Web Tool

[![Netlify Status](https://api.netlify.com/api/v1/badges/464bc73e-9763-45eb-afd5-502cb19dbe8b/deploy-status)](https://app.netlify.com/projects/marstek-fw-checker/deploys)

🔋 **Web-based firmware update checker for Marstek devices**

This tool converts the original PowerShell script to a modern web interface with built-in CORS proxy hosted on Netlify.

## 🚀 Features

- **Device Authentication**: Login with your Marstek account credentials
- **Device Discovery**: Automatically list all devices in your account
- **Firmware Checking**: Click on any device to check for available firmware updates
- **Download Support**: Direct download links for firmware files
- **Release Notes**: View firmware release notes and changelog information
- **Dark Theme**: Clean, modern interface inspired by the Venus Monitor tool
- **CORS Proxy Support**: Handles browser security restrictions

## 📂 Files

- `index.html` - Main web interface
- `script.js` - JavaScript functionality and API calls
- `styles.css` - Dark theme styling
- `README.md` - This documentation file

## 🌐 GitHub Pages Deployment

### Method 1: Direct Repository Upload

1. **Create a new GitHub repository** for your firmware tool
2. **Upload all files** to the repository root:
   - `index.html`
   - `script.js`
   - `styles.css`
   - `README.md`
3. **Enable GitHub Pages**:
   - Go to repository Settings
   - Scroll down to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click Save
4. **Access your tool**: `https://[username].github.io/[repository-name]/`

### Method 2: GitHub CLI

```bash
# Create new repository
gh repo create marstek-firmware-tool --public

# Clone and add files
git clone https://github.com/[username]/marstek-firmware-tool.git
cd marstek-firmware-tool
cp /path/to/marstek/* .

# Commit and push
git add .
git commit -m "Add Marstek firmware query web tool"
git push origin main

# Enable GitHub Pages
gh repo edit --enable-pages --pages-branch main --pages-path /
```

## 🔧 Usage Instructions

### Step 1: Access the Tool
Visit your GitHub Pages URL: `https://[username].github.io/marstek-firmware-tool/`

### Step 2: CORS Proxy Setup
⚠️ **Important**: Due to browser security, you need a CORS proxy to access Marstek APIs.

**Option 1: cors-anywhere.herokuapp.com** (Recommended)
1. Visit https://cors-anywhere.herokuapp.com/corsdemo
2. Click "Request temporary access to the demo server"
3. Return to your firmware tool and use the default proxy setting

**Option 2: allorigins.win**
- Should work without additional setup
- May be slower than cors-anywhere

### Step 3: Login and Check Firmware
1. **Enter your Marstek account credentials**
2. **Select a CORS proxy** (cors-anywhere recommended)
3. **Click "Login & Get Devices"**
4. **View your devices** in the grid layout
5. **Click on any device** to check firmware updates
6. **Download firmware** if updates are available

## ⚠️ Important Notes

### Security Considerations
- **Credentials are not stored** - only used for API authentication
- **All communication** goes through HTTPS
- **CORS proxy required** due to browser security restrictions
- **Use only trusted proxy services**

### Browser Compatibility
- ✅ **Chrome/Chromium** - Full support
- ✅ **Edge** - Full support  
- ✅ **Firefox** - Full support
- ✅ **Safari** - Full support
- 📱 **Mobile browsers** - Responsive design

### Limitations
- **CORS dependency**: Requires external proxy service
- **Proxy reliability**: Dependent on proxy service availability
- **Rate limiting**: May be subject to API rate limits

## 🔍 Troubleshooting

### "Authentication failed"
- Verify your Marstek account credentials
- Try a different CORS proxy
- Check if the proxy service is accessible

### "CORS error" or "Network error"
- Enable the CORS proxy (visit cors-anywhere demo page)
- Try switching to the allorigins proxy
- Check your internet connection

### "No devices found"
- Ensure devices are registered to your Marstek account
- Check if devices are online and connected

### Firmware check fails
- Verify device ID is correct
- Try refreshing and logging in again
- Check browser console for detailed error messages

## 🛠️ Development

### Local Testing
```bash
# Simple HTTP server for testing
python -m http.server 8000
# or
npx serve .
# or
php -S localhost:8000
```

Visit `http://localhost:8000` to test locally.

### Customization
- **Styling**: Modify `styles.css` for different themes
- **Functionality**: Update `script.js` for additional features
- **UI**: Edit `index.html` for layout changes

## 📋 API Endpoints

The tool uses these Marstek API endpoints:

- **Authentication**: `https://eu.hamedata.com/app/Solar/v2_get_device.php`
- **Firmware Check**: `https://eu.hamedata.com/ems/api/v2/checkSmallBalconyOTA`

## 🔐 Privacy & Security

- Credentials are only used for authentication and not stored
- All API calls are made client-side through CORS proxy
- No data is collected or stored by the web tool
- GitHub Pages serves files over HTTPS

## 📄 License

This tool is provided as-is for personal use with Marstek devices. Use at your own risk.

## 🆘 Support

- **Issues**: Check browser console for error messages
- **CORS problems**: Try different proxy or visit proxy demo page
- **Device issues**: Verify device is online and registered to your account

---

**⚠️ Disclaimer**: This tool is not affiliated with Marstek. Use responsibly and ensure you understand the implications of firmware updates before proceeding.