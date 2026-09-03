# EvaBot Brain Backend Deployment Report (evabot-agent-vm)

## Executive Summary
The backend compute engine ("Brain") for EvaBot has been successfully deployed, configured, and activated on the high-performance Google Cloud Compute Engine instance `evabot-agent-vm` located in zone `europe-west3-a`.

## Deployment Specifications
- **Target Host:** `evabot-agent-vm` (`c3-standard-8`, 8 vCPUs, 32 GB RAM)
- **Zone:** `europe-west3-a`
- **Internal IP:** `10.156.0.2`
- **Tailscale Mesh IP:** `100.66.98.4`
- **Application Directory:** `/var/www/evabot-backend` (symlinked as `/home/evabot/evabot-backend`)
- **System Service:** `evabot-brain.service` (systemd)
- **Service User:** `evabot:evabot`
- **Bound Endpoints:** `http://localhost:3000`, `http://100.66.98.4:3000`, `http://0.0.0.0:3000`
- **Node.js Environment:** Node.js `v22.23.2`, npm `10.9.8`

## Verification & Health Check Results
- **Endpoint:** `GET http://localhost:3000/api/health` & `GET http://100.66.98.4:3000/api/health`
- **HTTP Status:** `200 OK`
- **Response Payload:**
```json
{
  "status": "online",
  "server": "evabot-online-edge",
  "uptimeSeconds": 27,
  "memoryUsageMb": 61,
  "availableModels": 20,
  "hasServerApiKey": true,
  "authSource": "Google Compute Engine Service Account",
  "account": "evabot.online@gmail.com"
}
```

## System Resources & Operational Footprint
- **Process ID (PID):** `127004`
- **Resident Set Size (RSS):** `~61 - 62 MB` (Node runtime heap + model registry cache)
- **Systemd CGroup Memory:** `17.3 MB`
- **CPU Utilization:** `< 0.1%` (Idle standby)
- **Active Gemini Models Loaded:** 20 production models (Gemini 2.5 Pro, Flash, Thinking, Flash-Lite)
- **Authentication Source:** Google Compute Engine VM Metadata Service (`evabot.online@gmail.com`)

## Operational Commands
```bash
# Service Status
sudo systemctl status evabot-brain.service

# Live Logs
sudo journalctl -u evabot-brain.service -f
cat /var/log/evabot-brain.log
```
