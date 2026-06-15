# Coze Proxy

This Cloudflare Worker keeps the Coze PAT out of the browser bundle and proxies only `POST /v3/chat`.

## Deploy

```bash
cd cors-proxy
npx wrangler login
npx wrangler secret put COZE_PAT
npx wrangler deploy
```

`COZE_BOT_ID` is configured in `wrangler.toml`.

For local Worker testing, copy `.dev.vars.example` to `.dev.vars` and fill in `COZE_PAT`.
