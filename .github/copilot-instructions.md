# AI Agent Guide for This Repo

This repository is a Node.js WhatsApp personal assistant bot built on `whatsapp-web.js`, exposed via a small Express server for health/status and QR-code display. Behavior is driven by environment variables and the config in `config/config.js`.

## Architecture Overview
- App entry: `src/index.js` starts Express and the WhatsApp client via `WhatsAppBot`.
- Bot engine: `src/WhatsAppBot.js` wraps `whatsapp-web.js` with:
  - Command handling (prefix `!`), auto‑replies, message normalization, and contextual responses.
  - Work-hours logic via `moment-timezone` from `config/config.js`.
  - Auto-messages scheduler (spouse/group check-ins) that runs every minute when enabled.
- Configuration: `config/config.js` centralizes env parsing, work-hour calculations, default replies, and helper getters.
- Web UI: `GET /` serves a simple page that shows the current QR code (generated from the `qr` event) to link WhatsApp.
- Health/Status: `GET /health` and `GET /status` for probes and runtime feature toggles.

## Runtime and Processes
- WhatsApp session storage: `.wwebjs_auth` and cache: `.wwebjs_cache` in repo root. Docker maps these as volumes to persist login.
- Puppeteer/Chromium: Runs headless. In Docker, Chromium is installed and `PUPPETEER_EXECUTABLE_PATH` is set.
- Ports:
  - Default `config.port` = `process.env.PORT || 3000` (compose sets `PORT=3001`).
  - Health checks query `http://localhost:<PORT>/health`.

## Commands and Message Handling
- Command prefix: `!` (examples: `!help`, `!info`, `!status`, `!time`, `!randevu`, `!projects`, `!resume`, `!contact`, `!menu`).
- Group behavior:
  - Non-friends groups are ignored unless it’s a command.
  - Use `!setgroup` in a group to mark it as the “friends” group (stored in memory via `config.friendsGroupId`; not persisted).
  - `!groupinfo` prints group name/id/participants and whether marked as friends group.
- Auto‑replies: Keyword triggers live in `config.autoReplies`. `normalizeMessage()` maps common variants to improve matching.
- Special flows:
  - Money/loan requests are politely declined with randomized responses.
  - “Təcili/urgent” messages trigger immediate emergency response.
  - Work-hours routing changes tone and content of replies.

## Critical Config and Env
- Key envs (sample in `README.md`): `PORT`, `TIMEZONE`, `WORK_START/WORK_END`, `ENABLE_COMMANDS`, `ENABLE_AUTO_REPLY`, `ENABLE_LOGGING`, social/profile fields, and phone ids like `SPOUSE_PHONE`.
- Feature toggles default to enabled in `config/config.js` (most `enableX !== 'false'`). Set to `'false'` to disable.
- Auto-messages schedule and texts defined in `config.autoMessages` and helpers like `getEveningMessage()`.

## Developer Workflows
- Local (Node):
  - Install: `npm install`
  - Dev: `npm run dev` (nodemon)
  - Prod: `npm start`
  - Lint/format: `npm run lint` / `npm run format`
  - First run will print QR in terminal and on `GET /` page; scan with WhatsApp to authenticate. Session persists in `.wwebjs_auth/`.
- Docker:
  - Build/run with compose: `docker-compose up --build`
  - Container exposes `<HOST>:3001 -> <CONTAINER>:3001` and sets `PORT=3001`.
  - Volumes: map `.wwebjs_auth` and `.wwebjs_cache` for persistent login.

## Patterns and Conventions
- Centralized config: Add new toggles/thresholds in `config/config.js`, document defaults and env mapping, then read them in bot logic.
- Commands: Implement in `handleCommand()`; also add “shortcut number” selections in `handleNumberSelection()` if needed.
- Auto‑reply triggers: Extend `config.autoReplies`; adjust `normalizeMessage()` for robust matching across variants.
- Work-hours awareness: Reuse `config.getWorkStatus()` and `config.getStatusMessage()` for consistent behavior.
- Group‑limited features: Guard with `chat.isGroup` and `config.isFriendsGroup(chatId)`.

## Integration Points
- WhatsApp client: events `qr`, `ready`, `message`, `auth_failure`, `disconnected` handled in `WhatsAppBot` and augmented in `src/index.js` for QR web view.
- Web server: keep endpoints side‑effect free; only expose status/health and display QR.

## Gotchas
- Persistence: `!setgroup` updates `config` in memory only; not persisted across restarts. Consider adding storage if required.
- Secrets: Phone numbers, emails, and session folders are sensitive. Do not publish `.wwebjs_auth/`.
- Headless Chrome: On non-Docker environments, ensure Chromium/Chrome exists or unset `PUPPETEER_EXECUTABLE_PATH` to let puppeteer manage it.

## File Map Highlights
- `src/index.js` — Express app, QR page, status/health endpoints, bot lifecycle.
- `src/WhatsAppBot.js` — Client init, message/command/auto‑reply logic, schedulers.
- `config/config.js` — Env parsing, work-hours/timezone logic, replies, helpers.
- `docker-compose.yml` — Ports/env/volumes/healthcheck for containerized runs.
- `Dockerfile` — Node 18 Alpine, Chromium install, non-root user, healthcheck.

If any part is ambiguous (e.g., persistence expectations for group IDs, additional commands, or deployment targets), ask the maintainer before implementing significant changes.
