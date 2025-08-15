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
    const { endpoint, ...params } = event.queryStringParameters || {};
    
    if (!endpoint) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing endpoint parameter' }),
      };
    }

    // Build the target URL
    const targetUrl = `https://eu.hamedata.com${endpoint}?${new URLSearchParams(params).toString()}`;
    
    console.log('Proxying request to:', targetUrl);

    // Make the request to Marstek API
    const response = await fetch(targetUrl, {
      method: event.httpMethod,
      headers: {
        'User-Agent': 'Marstek-Firmware-Checker/1.0',
      },
    });

    // Get response text
    const responseText = await response.text();
    
    console.log('Marstek API response:', {
      status: response.status,
      statusText: response.statusText,
      body: responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''),
    });

    // Return the response with CORS headers
    return {
      statusCode: response.status,
      headers: {
        ...headers,
        'Content-Type': response.headers.get('content-type') || 'text/plain',
      },
      body: responseText,
    };

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