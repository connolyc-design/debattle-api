# Deployment

This repo is connected to the **debattle-api** project on Vercel.

## How to deploy

Push to `main`:

```bash
git add .
git commit -m "your change"
git push
```

Vercel picks up the push automatically and deploys to production within ~30 seconds.  
No manual `vercel --prod` command is needed.

## Live endpoints

| Endpoint | Purpose |
|---|---|
| `POST /api/judge` | Proxies Anthropic Claude for debate judging + bot arguments |
| `POST /api/tts` | Proxies OpenAI TTS for bot voice |
| `GET /api/transcribe` | Proxies Deepgram STT WebSocket |

All endpoints enforce:
- Origin lock to `https://debattle.com`
- In-memory rate limiting (10 req/min/IP — resets on cold start)

## Environment variables

Set in Vercel Dashboard → debattle-api project → Settings → Environment Variables.

| Variable | Where to rotate |
|---|---|
| `ANTHROPIC_KEY` | console.anthropic.com → API Keys |
| `DEEPGRAM_KEY` | console.deepgram.com → API Keys |
| `VERCEL_OIDC_TOKEN` | Auto-managed by Vercel — no action needed |

After rotating a secret: update the variable in Vercel, then push any commit (or click Redeploy in the dashboard) to pick up the new value.

## Checking deploy status

- Vercel Dashboard: https://vercel.com/dashboard → debattle-api project → Deployments tab
- Each deployment shows build logs, the triggering commit, and duration

## Local development

```bash
npm install -g vercel
vercel dev
```

This starts a local server on `http://localhost:3000` that mirrors the production function routing.  
Note: origin CORS check is hardcoded to `https://debattle.com` in each handler — local calls will be blocked unless you temporarily relax this during development.
