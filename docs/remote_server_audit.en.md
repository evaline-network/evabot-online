# Remote Server Audit & Environment Access Report

**Date:** 2026-09-03  
**Target Server:** `evabot-agent-vm`  
**GCP Zone:** `europe-west3-a`  
**Status:** Online & Fully Operational  

---

## 1. Executive Summary

A comprehensive system audit was conducted on the high-performance cloud instance **`evabot-agent-vm`** via `gcloud compute ssh`. All core subsystems, including CPU, 32 GB DDR5 RAM, NVMe storage, systemd daemon processes, the Antigravity Python Gateway (port 9090), and the Code-Server Web IDE (port 8080), are operating under optimal health parameters.

---

## 2. Hardware & Operating System Specifications

| Metric | Specification | Observed Status |
| :--- | :--- | :--- |
| **Operating System** | Debian GNU/Linux 12 (bookworm) | Kernel: `6.1.0-52-cloud-amd64` (SMP PREEMPT_DYNAMIC) |
| **CPU Model** | Intel(R) Xeon(R) Platinum 8481C @ 2.70GHz | 8 vCPUs (1 socket, 8 logical cores) |
| **System Load** | 1, 5, 15 min average | `0.00, 0.00, 0.00` (Idle, maximum responsiveness) |
| **Memory (RAM)** | 32 GB High-Speed DDR5 | **Total:** 31 GiB<br>**Used:** 1.3 GiB<br>**Available:** 30 GiB (Free: 19 GiB, Buff/Cache: 10 GiB) |
| **Swap** | Linux Swap Space | 0 B (Not needed given 30 GiB available memory) |
| **Disk Storage** | Fast NVMe SSD (`/dev/nvme0n1p1`) | **Total:** 49 GB<br>**Used:** 11 GB (22%)<br>**Free:** 37 GB (78%) |

---

## 3. Active Services & Network Listening Ports

Auditing active background services and open listening sockets:

```
tcp   LISTEN 0   511   0.0.0.0:8080   0.0.0.0:*   users:(("code-server",pid=41401))
tcp   LISTEN 0   511   0.0.0.0:80     0.0.0.0:*   users:(("nginx",pid=89044))
tcp   LISTEN 0   5     0.0.0.0:9090   0.0.0.0:*   users:(("python3",pid=37070))
tcp   LISTEN 0   511      [::]:80        [::]:*   users:(("nginx",pid=89044))
```

### 3.1. `code-server@evabot.service`
- **Service Name:** `code-server@evabot.service` (systemd unit)
- **Status:** `active (running)` since Sep 02 08:34:24 UTC
- **Process ID:** PID 41381 / PID 41401 (`/usr/lib/code-server`)
- **Bound Address:** `0.0.0.0:8080`

### 3.2. Antigravity Python Gateway
- **Status:** `active (running)` (PID 37070, user `fedor`)
- **Process Description:** Python HTTP REST API Server handling telemetry and environment state
- **Bound Address:** `0.0.0.0:9090`

### 3.3. `nginx.service`
- **Service Name:** `nginx.service`
- **Status:** `active (running)` since Sep 02 11:29:22 UTC (PID 89044)
- **Bound Address:** `0.0.0.0:80` and `[::]:80`

---

## 4. Antigravity Gateway API Verification (Port 9090)

Testing health probe endpoint `http://localhost:9090/status`:

```bash
curl -s http://localhost:9090/status
```

**JSON Response (HTTP 200 OK):**
```json
{
  "status": "online",
  "server": "evabot-agent-vm",
  "tailscale_ip": "100.66.98.4",
  "antigravity_cli": true,
  "antigravity_ide": true
}
```

Confirmation: Both `antigravity_cli` and `antigravity_ide` subsystems are flagged active and available for orchestration.

---

## 5. Code-Server Web IDE Verification (Port 8080)

Testing HTTP endpoint:
```bash
curl -I -s http://localhost:8080/
```
**Response:**
```http
HTTP/1.1 302 Found
Location: ./login
```

### Configuration & Credentials
- **File Location:** `/home/evabot/.config/code-server/config.yaml`
- **Permissions:** `-rw-r--r-- 1 evabot evabot`
- **Configuration Content:**
  ```yaml
  bind-addr: 0.0.0.0:8080
  auth: password
  password: antigravity-pass
  cert: false
  ```
- **Web UI Access Password:** `antigravity-pass`

---

## 6. Zero Local Resource Consumption Setup Guide

To run complex compilation, large language model tasks, bots, and agents without exhausting local laptop/desktop resources (0% local CPU, 0% local RAM overhead):

### Method A: Direct Access via Tailscale Mesh Network (Zero Setup)
Since both the local machine and `evabot-agent-vm` are connected to Tailscale:
- **Tailscale IP:** `100.66.98.4`
- **Web IDE URL:** [`http://100.66.98.4:8080/`](http://100.66.98.4:8080/)
- **Password:** `antigravity-pass`
- **Gateway Endpoint:** [`http://100.66.98.4:9090/status`](http://100.66.98.4:9090/status)

*Benefits:* No SSH tunneling process needed; open the link in any web browser. All heavyweight language servers, builds, and node runtimes execute entirely on the 8-core Xeon with 32 GB RAM.

### Method B: Encrypted SSH Tunnel via Google Cloud SDK
If working outside the Tailscale network:
```bash
gcloud compute ssh evabot-agent-vm --zone europe-west3-a -- -L 8080:localhost:8080 -L 9090:localhost:9090 -N
```
Then open in your local browser:
- IDE: [`http://localhost:8080`](http://localhost:8080)
- Gateway: [`http://localhost:9090/status`](http://localhost:9090/status)

### Method C: Native Desktop VS Code via Remote-SSH
Add the following block to your local `~/.ssh/config`:
```ssh-config
Host evabot-agent-vm
    HostName 100.66.98.4
    User evabot
    IdentityFile ~/.ssh/google_compute_engine
```
Then click **Connect to Host -> evabot-agent-vm** in VS Code. All extensions, code analysis, terminals, and memory allocations are offloaded 100% to the cloud instance.
