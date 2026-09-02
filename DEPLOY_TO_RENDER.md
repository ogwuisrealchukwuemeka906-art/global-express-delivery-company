# Publish Global eXpress for free on Render

This project is prepared as a Node.js/Express web service.

## Render settings

- Service type: Web Service
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Plan: Free
- Health Check Path: `/api/health`

Render will provide a public `onrender.com` URL. Visitors can open that URL directly; they do not need Google AI Studio.

## Environment variables

Set these in Render if needed:

- `NODE_ENV=production`
- `GEMINI_API_KEY` — optional; only needed for the AI assistant
- `ADMIN_EMAIL` — optional
- `ADMIN_PASSWORD` — optional
- `ADMIN_2FA_BACKUP_CODES` — optional, comma-separated

## Search engines

The app now exposes `/robots.txt` and `/sitemap.xml` and allows indexing with `index, follow`. After the site is live, submit the public URL to Google Search Console to request indexing. Google may take time to crawl and index it; appearing in search results is not guaranteed immediately.

## Tracking links

The public app accepts both `?track=TRACKING_NUMBER` and `?tracking=TRACKING_NUMBER`, so existing waybill links using `?tracking=` can open the matching shipment directly.

## Free-tier limitation

Render Free web services sleep after 15 minutes of inactivity and can take about a minute to wake up. The local JSON database is also not persistent across service restarts/spin-downs on Render Free. For permanent production data persistence, use a persistent external database or a paid persistent storage option.
