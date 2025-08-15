exports.handler = async (event, context) => {
  // Set CORS headers for preflight requests
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // Extract parameters from query string
    const { endpoint, download, ...params } = event.queryStringParameters || {};
    
    if (!endpoint) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing endpoint parameter' }),
      };
    }

    let targetUrl;
    
    // Handle downloads vs API calls differently
    if (download === 'true') {
      // For downloads, endpoint is the full URL
      targetUrl = endpoint;
      console.log('Proxying download request to:', targetUrl);
    } else {
      // For API calls, build URL with eu.hamedata.com base
      targetUrl = `https://eu.hamedata.com${endpoint}?${new URLSearchParams(params).toString()}`;
      console.log('Proxying API request to:', targetUrl);
    }

    // Make the request
    const response = await fetch(targetUrl, {
      method: event.httpMethod,
      headers: {
        'User-Agent': 'Marstek-Firmware-Checker/1.0',
      },
    });

    // Handle downloads vs API responses differently
    if (download === 'true') {
      // For downloads, return binary data
      const buffer = await response.arrayBuffer();
      
      console.log('Download response:', {
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers.get('content-type'),
        contentLength: response.headers.get('content-length'),
      });

      return {
        statusCode: response.status,
        headers: {
          ...headers,
          'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
          'Content-Length': response.headers.get('content-length'),
          'Content-Disposition': response.headers.get('content-disposition') || 'attachment',
        },
        body: Buffer.from(buffer).toString('base64'),
        isBase64Encoded: true,
      };
    } else {
      // For API calls, return text
      const responseText = await response.text();
      
      console.log('API response:', {
        status: response.status,
        statusText: response.statusText,
        body: responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''),
      });

      return {
        statusCode: response.status,
        headers: {
          ...headers,
          'Content-Type': response.headers.get('content-type') || 'text/plain',
        },
        body: responseText,
      };
    }

  } catch (error) {
    console.error('Proxy error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Proxy request failed',
        message: error.message 
      }),
    };
  }
};