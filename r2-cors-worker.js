// Cloudflare Worker to add CORS headers to R2 bucket
// Deploy this as a Worker and route it to your R2 bucket

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Max-Age': '86400',
        },
      });
    }
    
    // Get the file from R2
    const key = url.pathname.slice(1); // Remove leading /
    const object = await env.BUCKET.get(key);
    
    if (!object) {
      return new Response('Not Found', { status: 404 });
    }
    
    // Determine content type
    const contentType = getContentType(key);
    
    // Return with CORS headers
    return new Response(object.body, {
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  },
};

function getContentType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const types = {
    'html': 'text/html',
    'js': 'application/javascript',
    'wasm': 'application/wasm',
    'pck': 'application/octet-stream',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
  };
  return types[ext] || 'application/octet-stream';
}
