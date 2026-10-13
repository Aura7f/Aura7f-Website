import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import type { ViteDevServer } from 'vite';

// Local-only token exchange proxy.
// Browser calls same-origin POST /api/discord/token { code, redirect_uri }.
// Secret stays in Node (loaded via loadEnv) and is never bundled to the client.
// Redirect URI + port are unchanged; this only avoids Discord CORS in local dev.
function discordTokenProxy() {
  return {
    name: 'discord-token-proxy',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/discord/token', async (req: any, res: any) => {
        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'method_not_allowed' }));
          return;
        }

        try {
          const env = loadEnv(server.config.mode, process.cwd(), '');
          const clientId = env.VITE_DISCORD_CLIENT_ID || process.env.VITE_DISCORD_CLIENT_ID || '';
          const clientSecret = env.VITE_DISCORD_CLIENT_SECRET || process.env.VITE_DISCORD_CLIENT_SECRET || '';
          const configuredRedirect =
            env.VITE_DISCORD_REDIRECT_URI || process.env.VITE_DISCORD_REDIRECT_URI || '';

          const rawBody: string = await new Promise((resolve, reject) => {
            let data = '';
            req.on('data', (chunk: any) => {
              data += chunk;
            });
            req.on('end', () => resolve(data));
            req.on('error', reject);
          });

          let parsed: { code?: string; redirect_uri?: string } = {};
          try {
            parsed = rawBody ? JSON.parse(rawBody) : {};
          } catch {
            parsed = {};
          }

          const code = (parsed.code || '').trim();
          const redirectUri = (parsed.redirect_uri || configuredRedirect).trim();

          if (!code) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'missing_code' }));
            return;
          }
          if (!clientId || !clientSecret || !redirectUri) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'server_misconfigured' }));
            return;
          }

          const body = new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
            scope: 'identify email',
          }).toString();

          const discordRes = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body,
          });

          const payloadText = await discordRes.text();
          res.statusCode = discordRes.status;
          res.setHeader('Content-Type', 'application/json');
          res.end(payloadText);
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'proxy_failed' }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), discordTokenProxy()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: { port: 3000 },
});
