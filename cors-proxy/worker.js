/**
 * Cloudflare Worker: CORS proxy for Coze.cn Official API
 *
 * Deploy commands:
 *   cd cors-proxy
 *   npx wrangler login
 *   npx wrangler secret put COZE_PAT
 *   npx wrangler deploy
 *
 * After deploy, copy the worker URL (e.g. https://coze-cors-proxy.xxx.workers.dev)
 * and set VITE_COZE_API_URL if you do not use the default URL in HomePage.jsx.
 */
const UPSTREAM = 'https://api.coze.cn';
const UPSTREAM_TIMEOUT_MS = 35000;

function corsHeaders(request, env) {
  const configuredOrigin = env.ALLOWED_ORIGIN || '*';
  const requestOrigin = request.headers.get('Origin') || '';
  const allowedOrigins = configuredOrigin.split(',').map((origin) => origin.trim()).filter(Boolean);
  const allowOrigin = configuredOrigin === '*'
    ? '*'
    : (allowedOrigins.includes(requestOrigin) ? requestOrigin : allowedOrigins[0] || '*');

  const headers = {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
    'Access-Control-Max-Age': '86400',
  };
  if (allowOrigin !== '*') headers.Vary = 'Origin';
  return headers;
}

function jsonResponse(request, env, body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(request, env),
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(request, env),
      });
    }

    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/v3/chat') {
      return jsonResponse(request, env, { error: 'Not found' }, 404);
    }
    if (!env.COZE_PAT) {
      return jsonResponse(request, env, { error: 'Missing COZE_PAT worker secret' }, 500);
    }

    const targetUrl = UPSTREAM + url.pathname + url.search;
    let payload;
    try {
      payload = await request.json();
    } catch {
      return jsonResponse(request, env, { error: 'Invalid JSON body' }, 400);
    }
    payload.bot_id = env.COZE_BOT_ID || payload.bot_id;
    if (!payload.bot_id) {
      return jsonResponse(request, env, { error: 'Missing bot_id' }, 400);
    }

    const headers = new Headers();
    headers.set('Authorization', `Bearer ${env.COZE_PAT}`);
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', request.headers.get('Accept') || 'text/event-stream');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
    let upstreamRes;
    try {
      upstreamRes = await fetch(targetUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } catch (error) {
      const timedOut = error.name === 'AbortError';
      return jsonResponse(request, env, {
        error: timedOut ? 'Coze upstream timeout' : 'Coze upstream request failed',
        message: error.message,
      }, timedOut ? 504 : 502);
    } finally {
      clearTimeout(timeout);
    }

    // Add CORS headers to response
    const newHeaders = new Headers(upstreamRes.headers);
    Object.entries(corsHeaders(request, env)).forEach(([key, value]) => {
      newHeaders.set(key, value);
    });

    return new Response(upstreamRes.body, {
      status: upstreamRes.status,
      statusText: upstreamRes.statusText,
      headers: newHeaders,
    });
  },
};
