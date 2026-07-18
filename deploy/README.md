# OCI deployment

The public Vite build is served by Nginx. Broker tariffs and calculations run
inside a private FastAPI process on the same OCI Always Free VM.

1. Install Node.js 20+, Python 3.11+, `python3-venv` and Nginx.
2. Clone this repository to `/opt/knowyourpnl`.
3. Build the public site:

   ```bash
   cd /opt/knowyourpnl/frontend
   npm ci
   npm run build
   sudo rsync -a --delete dist/ /var/www/knowyourpnl/
   ```

4. Install the private API:

   ```bash
   cd /opt/knowyourpnl
   python3 -m venv .venv
   .venv/bin/pip install -r backend/requirements.txt
   sudo install -d -m 700 /etc/knowyourpnl
   sudo install -o root -g www-data -m 640 /secure/location/tariffs.json /etc/knowyourpnl/tariffs.json
   sudo cp deploy/knowyourpnl-api.service /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable --now knowyourpnl-api
   ```

5. Install `deploy/nginx.conf` as the Nginx site configuration and reload Nginx.
6. Point the domain to the VM, or expose Nginx through a Cloudflare Tunnel.

The API binds only to `127.0.0.1:8000`; Nginx is the sole public entry point.
Set `CORS_ORIGINS` in the service file to the final HTTPS domain before launch.
The real tariff JSON must be transferred separately to the VM. It is ignored
by Git and must never be committed or copied into the Nginx web root.
