const UPSTREAM = 'https://api.coze.cn/v3/chat';
const UPSTREAM_TIMEOUT_MS = 35000;

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
}

function sendJson(res, status, body) {
  setCorsHeaders(res);
  res.status(status).json(body);
}

function readCozeToken() {
  return process.env.COZE_PAT || process.env.COZE_API_TOKEN || process.env.COZE_API_KEY;
}

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 404, { error: 'Not found' });
    return;
  }

  const cozeToken = readCozeToken();
  if (!cozeToken) {
    sendJson(res, 500, { error: 'Missing COZE_PAT server environment variable' });
    return;
  }

  let payload = req.body;
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch {
      sendJson(res, 400, { error: 'Invalid JSON body' });
      return;
    }
  }

  if (!payload || typeof payload !== 'object') {
    sendJson(res, 400, { error: 'Invalid JSON body' });
    return;
  }

  payload.bot_id = process.env.COZE_BOT_ID || payload.bot_id;
  if (!payload.bot_id) {
    sendJson(res, 400, { error: 'Missing bot_id' });
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const upstreamRes = await fetch(UPSTREAM, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${cozeToken}`,
        'Content-Type': 'application/json',
        Accept: req.headers.accept || 'text/event-stream',
      },
      body: JSON.stringify(payload),
    });

    res.status(upstreamRes.status);
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', upstreamRes.headers.get('content-type') || 'text/event-stream; charset=utf-8');

    if (!upstreamRes.body) {
      res.end(await upstreamRes.text());
      return;
    }

    const reader = upstreamRes.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(Buffer.from(value));
    }
    res.end();
  } catch (error) {
    const timedOut = error.name === 'AbortError';
    sendJson(res, timedOut ? 504 : 502, {
      error: timedOut ? 'Coze upstream timeout' : 'Coze upstream request failed',
      message: error.message,
    });
  } finally {
    clearTimeout(timeout);
  }
}
