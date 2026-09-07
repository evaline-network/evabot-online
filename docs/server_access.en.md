# EvaBot Server Access Guide

**Date:** September 5, 2026
**GCP Project:** `evabot-agent-server` (number: `873069440066`)
**Domains:** evabot.online, evaline.online

---

## 1. Server Inventory

| Server | Role | GCP Zone | Machine Type | Region |
| :--- | :--- | :--- | :--- | :--- |
| `evabot-agent-vm` | Compute core (EvaBot Brain) | `europe-west3-a` | `c3-standard-8` (8 vCPU, 32 GB) | Frankfurt |
| `evaline-micro-vm` | Edge proxy, web gateway, Caddy | `us-central1-a` | `e2-micro` (Always Free) | Iowa |

---

## 2. Network Addresses

| Server | External IP | Internal IP (VPC) | Tailscale IP | Domain |
| :--- | :--- | :--- | :--- | :--- |
| `evabot-agent-vm` | `34.159.202.82` | `10.156.0.2` | `100.66.98.4` | — |
| `evaline-micro-vm` | `136.114.26.252` | `10.128.0.2` | `100.125.200.49` | `evabot.online` |

> ⚠️ The external IP may change after instance restart unless statically reserved. Reliable permanent addresses are the VPC-internal IP and Tailscale.

---

## 3. Connecting to `evabot-agent-vm`

### 3.1. SSH via Google Cloud SDK (recommended, no external IP needed)

```bash
gcloud compute ssh evabot-agent-vm --zone=europe-west3-a
```

Or directly with your local key:

```bash
ssh evabot@34.159.202.82
ssh evabot@10.156.0.2        # from inside the VPC
ssh evabot@100.66.98.4       # via Tailscale from anywhere
```

Server username: `evabot`.

### 3.2. SSH with port forwarding (tunnels)

Bring Code-Server (8080) and the Antigravity gateway (9090) locally without exposing ports publicly:

```bash
gcloud compute ssh evabot-agent-vm --zone=europe-west3-a -- -L 8080:localhost:8080 -L 9090:localhost:9090 -N
```

After that:
- Code-Server IDE: `http://localhost:8080`
- Antigravity gateway: `http://localhost:9090`

### 3.3. Web IDE Code-Server (port 8080)

- Locally via tunnel: `http://localhost:8080`
- Via Tailscale: `http://100.66.98.4:8080`
- systemd service: `code-server@evabot.service`
- Config: `/home/evabot/.config/code-server/config.yaml`
- Login password: set in `config.yaml` (field `password`)

Tip: never expose port 8080 to the internet without authentication — use an SSH tunnel or Tailscale.

### 3.4. Graphical desktop VNC (port 5901)

XFCE4 desktop of the `evabot` user:

- Address: `34.159.202.82:5901` (external) or `100.66.98.4:5901` (Tailscale)
- User: `evabot`
- Password: the one stored in `/home/evabot/.vnc/passwd`
- Start the server:
  ```bash
  sudo -u evabot vncserver :1 -localhost no -geometry 1360x850 -depth 24 -SecurityTypes VncAuth
  ```
- Stop the server:
  ```bash
  sudo -u evabot vncserver -kill :1
  ```

Clients: TigerVNC (`vncviewer`), RealVNC, Remmina, TightVNC, or an in-browser noVNC client.

### 3.5. Web server (ports 80/443)

- Nginx listens on `0.0.0.0:80`
- Open firewall tags on the instance: `http-server`, `https-server`
- The main site is hosted on `evaline-micro-vm` and proxied to this node.

### 3.6. EvaBot Brain backend (port 3000)

- systemd service: `evabot-brain.service`
- Address: `http://localhost:3000` (on the server); working dir `/var/www/evabot-backend`
- Logs: `/var/log/evabot-brain.log`, `/var/log/evabot-brain.error.log`

### 3.7. Antigravity gateway (port 9090)

- REST API for telemetry and orchestration
- Status check: `curl http://localhost:9090/status`

---

## 4. Connecting to `evaline-micro-vm`

### 4.1. SSH via Google Cloud SDK

```bash
gcloud compute ssh evaline-micro-vm --zone=us-central1-a
```

### 4.2. Direct SSH / via Tailscale

```bash
ssh evabot@136.114.26.252
ssh evabot@10.128.0.2
ssh evabot@100.125.200.49
```

### 4.3. Web server (Caddy)

- Sites: `https://evabot.online`, `https://evaline.online`
- Caddy issues TLS certificates automatically via Let's Encrypt
- Reload config: `sudo systemctl reload caddy`

---

## 5. Connecting via Tailscale (VPN mesh)

Tailscale provides a private network bridge between all devices without opening ports to the internet. Devices in the `evabot.online@` network:

| Device | Tailscale IP | Status |
| :--- | :--- | :--- |
| `evabot-agent-vm` | `100.66.98.4` | online |
| `evaline-micro-vm` | `100.125.200.49` | online |
| `macbook-air-2018` | `100.102.22.45` | active |
| `debian` | `100.127.10.65` | offline |
| `oppo-a5-pro-5g` | `100.126.165.5` | offline |
| `pixel-10-pro-xl` | `100.80.216.27` | offline |

Check the network:

```bash
sudo tailscale status
```

Security principle: external IP access is allowed only for SSH and ports 80/443. Everything else (IDE, VNC, backend, gateway) — via Tailscale or SSH tunnels.

---

## 6. Checking Server Health

```bash
# SSH to the compute node
gcloud compute ssh evabot-agent-vm --zone=europe-west3-a

# Services
systemctl status evabot-brain
systemctl status code-server@evabot

# Open ports
ss -tlnp

# External reachability
curl -I https://evabot.online
```

---

## 7. Quick Reference

| What you need | Command / address |
| :--- | :--- |
| Compute node terminal | `gcloud compute ssh evabot-agent-vm --zone=europe-west3-a` |
| Micro-server terminal | `gcloud compute ssh evaline-micro-vm --zone=us-central1-a` |
| Web IDE (tunnel) | `localhost:8080` |
| Web IDE (Tailscale) | `100.66.98.4:8080` |
| VNC desktop | `34.159.202.82:5901` |
| Backend API | `localhost:3000` |
| Website | `https://evabot.online` |