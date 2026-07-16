# Octofit Tracker Frontend

React 19 + Vite presentation tier for Octofit Tracker.

## Environment Variables

`VITE_CODESPACE_NAME` must be defined when running in GitHub Codespaces so the app can call backend APIs via forwarded ports.

Create `octofit-tracker/frontend/.env.local`:

```bash
VITE_CODESPACE_NAME=your-codespace-name
```

The frontend uses endpoints in this format:

```text
https://${VITE_CODESPACE_NAME}-8000.app.github.dev/api/[component]/
```

If `VITE_CODESPACE_NAME` is not set, the app safely falls back to:

```text
http://localhost:8000/api/[component]/
```

## Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`
