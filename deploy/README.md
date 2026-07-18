# OCI deployment

The production site is a static Vite build and does not require a paid
application server or database.

1. Install Node.js 20+ and Nginx on the OCI VM.
2. Clone this repository.
3. In `frontend`, run `npm ci` and `npm run build`.
4. Copy the contents of `frontend/dist` to `/var/www/knowyourpnl`.
5. Install `deploy/nginx.conf` as the Nginx site configuration and reload Nginx.
6. Point the domain to the VM or publish Nginx through a Cloudflare Tunnel.

Keep the repository as the recovery source if an Always Free VM is reclaimed.
