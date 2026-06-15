/**
 * Cloudflare Worker: CORS proxy for Coze.cn Official API
 *
 * Deploy commands:
 *   cd cors-proxy
 *   npx wrangler login
 *   npx wrangler deploy worker.js --name coze-cors-proxy --compatibility-date 2024-01-01
 *
 * After deploy, copy the worker URL (e.g. https://coze-cors-proxy.xxx.workers.dev)
 * and update AGENT_API_URL in src/pages/HomePage.jsx
 */
const UPSTREAM = 'https://api.coze.cn';
const ALLOWED_ORIGIN = '*';

export default {
  async fetch(request) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Authorization, Content-Type, Accept',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    const url = new URL(request.url);
    const targetUrl = UPSTREAM + url.pathname + url.search;

    // Clone headers (can't send Host header to upstream)
    const headers = new Headers(request.headers);
    headers.delete('host');

    const upstreamRes = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: request.body,
    });

    // Add CORS headers to response
    const newHeaders = new Headers(upstreamRes.headers);
    newHeaders.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
    newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    newHeaders.set('Access-Control-Allow-Headers', 'Authorization, Content-Type, Accept');

    return new Response(upstreamRes.body, {
      status: upstreamRes.status,
      statusText: upstreamRes.statusText,
      headers: newHeaders,
    });
  },
};
