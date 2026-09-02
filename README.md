# Global eXpress Delivery Company

Production-ready React/Vite frontend with an Express API server.

## Local development

Prerequisites: Node.js 22+

```bash
npm install
npm run dev
```

The local server runs on port 3000 unless `PORT` is set.

## Production deployment

This project is designed to run as a Node.js web service because it includes an Express API and JSON-backed application data.

Recommended Render settings:

- Build command: `npm install && npm run build`
- Start command: `npm start`
- Environment: Node
- Plan: Free (subject to Render free-tier limits)

The server reads Render's `PORT` environment variable and binds to `0.0.0.0`.

## Optional environment variables

- `GEMINI_API_KEY` — enables the AI logistics assistant.
- `ADMIN_EMAIL` — optional admin login override.
- `ADMIN_PASSWORD` — optional admin password override.
- `ADMIN_2FA_BACKUP_CODES` — comma-separated optional backup codes.
