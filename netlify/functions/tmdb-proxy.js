const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    // Extract the path to forward to TMDb
    const tmdbPath = event.path.replace('/.netlify/functions/tmdb-proxy', '');

    // Construct the full TMDb API URL
    const tmdbApiUrl = `https://api.themoviedb.org/3${tmdbPath}${event.rawQuery ? `?${event.rawQuery}` : ''}`;

    // Forward the request to TMDb API
    const response = await fetch(tmdbApiUrl, {
      method: event.httpMethod,
      headers: {
        ...event.headers,
        // Include the TMDb API key from the query if provided, else use your hardcoded token
        'Authorization': `Bearer YOUR_TMDB_API_TOKEN`, // Replace with your actual TMDb token
      },
      body: event.httpMethod === 'POST' ? event.body : undefined,
    });

    // Get the response body from TMDb
    const responseBody = await response.text();

    return {
      statusCode: response.status,
      body: responseBody,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
    };
  }
};
