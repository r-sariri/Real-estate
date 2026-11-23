# Working in this repository

Horizon Properties — React 19 + TypeScript + Vite single-page site. No backend.

## Run it here

```bash
docker compose -f docker-compose.base44.yml up -d
```

- `web` runs `node:22`, installs dependencies into the named volume
  `node_modules`, then starts `vite --host 0.0.0.0 --port 3000`.
- Source is bind-mounted, so edits hot-reload. Vite uses polling
  (`server.watch.usePolling`) because bind mounts do not emit inotify events here.
- The app needs no environment variables or secrets. `/run/base44/app.env` is not
  wired in; add it as the last `env_file` entry if a real integration appears.

## Preview-only configuration

`vite.config.ts` appends `'.' + BASE44_SANDBOX_HOST_DOMAIN` to Vite's
`allowedHosts` **only** when `BASE44_PREVIEW_MODE === '1'`. With the flag unset
the config is Vite's default. Compose passes `BASE44_PREVIEW_MODE`,
`BASE44_PUBLIC_HOST_SUFFIX`, `BASE44_SANDBOX_HOST_DOMAIN` and
`__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` through as bare variables.

## Checks

```bash
npm run build        # tsc --noEmit + vite build (run inside the web container)
```

Behavioural facts worth knowing when verifying:

- Filtering is derived from the URL query string. `?type=Penthouse` yields 2
  results, `?q=malibu` yields 1, `?saved=1` with no favourites yields 0.
- Favourites (`horizon:favorites`), inquiries (`horizon:inquiries`) and
  newsletter sign-ups (`horizon:newsletter`) are `localStorage` keys. Delete test
  entries by the email/slug you created — never clear the whole key.
- Property images are remote Unsplash URLs built by `src/components/ui/Img.tsx`
  (responsive `srcset`, lazy below the fold). A blank card usually means the
  image host was unreachable, not a component bug.
- The property carousel supports pointer drag (mouse only), native touch
  scrolling, arrow keys when focused, and wrap-around arrow buttons.
