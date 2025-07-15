
# Talker MVP

An open‑source **augmentative and alternative communication (AAC)** Progressive Web App that lets a user with severe motor impairment type sentences via large touch‑friendly keys and have them spoken aloud.

> **Project goal:** deliver a base that works on any tablet with no install friction and can later grow to eye‑tracking and adaptive prediction.

---

## Why this repo exists

* **Improved communication** – my friend can express full sentences instead of pointing to isolated letters on cardboard.  
* **Edge-hosted** – Cloudflare Pages + Workers keep latency low and cost near zero.  
* **Incremental learning** – keystrokes will later feed a per‑user language model to cut typing effort over time.

---

## Quick start (local)

```bash
npm install
npm run dev
```

Open <http://localhost:5173>

### Build + preview

```bash
npm run build
npm run preview
```

---

## Deploy to Cloudflare (PWA/Tablet Ready)

1. **Sign up for a free Cloudflare account.**
2. **Install Wrangler CLI:**
   ```bash
   npm install -g wrangler
   ```
3. **Configure your account:**
   - Replace `account_id` in `wrangler.toml` with your Cloudflare account ID.
4. **Build the app:**
   ```bash
   npm run build
   ```
5. **Deploy the static site:**
   ```bash
   wrangler pages deploy dist --project-name talker-mvp
   ```
6. **Deploy the API worker:**
   ```bash
   wrangler deploy worker/index.ts --name talker-mvp-api
   ```
7. **Visit your deployed site:**
   - You’ll get a public URL (e.g., `https://talker-mvp.pages.dev`).
   - Open this URL on any tablet browser.

---

### Tablet/PWA Usage

- **No install required:** Just open your site URL in Chrome, Safari, or Edge on any tablet.
- **Add to Home Screen:** Use the browser’s share/menu button and choose “Add to Home Screen” for a fullscreen, app-like experience.
- **Works on iPad, Android, Windows tablets, and desktop browsers.**
- **Offline/PWA:** The app is PWA-ready. For full offline support, see the PWA manifest and service worker options in `public/`.

---

### First-time git setup

If this is your first commit:
```bash
git init
git add .
git commit -m "Initial working Talker MVP"
```

---

## File tour

| Path | Purpose |
|------|---------|
| `public/` | Static assets + PWA manifest |
| `src/` | React TypeScript front‑end |
| `worker/` | Cloudflare Worker (stubbed predictions) |
| `wrangler.toml` | Pages + Worker config |
| `tsconfig.json` | TS settings |
| `vite.config.ts` | Dev/build config |

---

## Next milestones

1. **Prediction engine** – compile [Presage](https://github.com/bitbrain/presage) to WebAssembly and call it from the Worker.  
2. **Data logging** – add `/log` endpoint and nightly KV aggregation.  
3. **Eye tracking** – hook into upcoming iPadOS Eye Tracking events or WebGazer fallback.

---

## Licence

MIT
