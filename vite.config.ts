import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const previewMode = process.env.BASE44_PREVIEW_MODE === '1';
const sandboxHostDomain = process.env.BASE44_SANDBOX_HOST_DOMAIN;

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    // Preview-only: the sandbox proxy forwards the sandbox hostname, which changes
    // whenever the environment is recreated. Extend (never replace) the allowlist.
    allowedHosts: previewMode && sandboxHostDomain ? ['.' + sandboxHostDomain] : undefined,
    watch: { usePolling: true, interval: 400 },
  },
  preview: { host: '0.0.0.0', port: 3000 },
});
