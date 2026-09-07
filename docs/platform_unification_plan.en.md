# 🌐 EvaLine Platform Unification — A single platform of independent nodes

**Version:** 0.1.0 (concept plan)
**Date:** September 6, 2026
**Author:** EvaBot Engineering Team (audit + architecture)
**Status:** Plan for review → implementation after approval

---

## 1. Goal

Connect **all projects and services of the EvaLine ecosystem** into a single platform
with shared navigation, a unified design standard, and a common backend — while each
**node stays fully independent**: it can live, deploy, and run on its own, and does not
lose functionality if other nodes fail.

---

## 2. Inventory of the current state (facts from the servers)

### 2.1 Two Google Compute instances

| Instance | Role | Region | Type | External IP | Tailscale IP |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `evabot-agent-vm` | **EvaBrain** (Compute Core) | `europe-west3-a` (Frankfurt) | `c3-standard-8` (8 vCPU / 32 GB) | `34.159.202.82` | `100.66.98.4` |
| `evaline-micro-vm` | **EvaFace** (Edge Ingress) | `us-central1-a` (Iowa) | `e2-micro` (Always Free, 1 GB) | `136.114.26.252` | `100.125.200.49` |

Tailscale mesh bridge is **active**: `100.125.200.49 <-> 100.66.98.4`, cipher ChaCha20-Poly1305.

### 2.2 Services on EvaBrain (port : role)

- `:3000` — **evabot-brain.service** — TypeScript backend (`/var/www/evabot-backend`, `dist/server/server.js`).
  Endpoints: `/api/health`, `/api/chat`, `/api/chat/stream` (SSE), `/api/consilium`,
  `/api/models`, `/api/roles`, `/api/diagnostics/boot`, `/api/worklog` (+tsv/log/txt/raw).
- `:20128` — **omniroute.service** — LiteLLM gateway (OpenAI-compatible).
- `:9090` — **antigravity-daemon.service** — Antigravity 2.0 telemetry/orchestration.
- `:8080` — **code-server@evabot** — Web IDE.
- `:5678` — **docker «n8n»** — automation (volume `n8n_data`).
- `:80` — **nginx** — default vhost `/var/www/html` + `/voice/` (port 8000 empty).

### 2.3 Services on EvaFace

- **Caddy** — sole owner of `:80` / `:443`, `default_sni evabot.online`.
- Serves **4 domains** from `/var/www/<domain>/index.html`.

### 2.4 The four domains and their specialization

| Domain | Directory (EvaFace) | Specialization | index size |
| :--- | :--- | :--- | :--- |
| `evabot.online` | `/var/www/evabot.online` | AI Neural Core (models, Consilium, TUI chat) | ~32 KB |
| `evaline.network` | `/var/www/evaline.network` | Edge Mesh & network topology | ~26 KB |
| `evaline.online` | `/var/www/evaline.online` | Security, IAM, microservices | ~26 KB |
| `evaline.website` | `/var/www/evaline.website` | Master Chronicle & Worklog | ~26 KB |

Each domain in Caddy: `root * /var/www/<domain>` + `handle /api/*` → reverse_proxy `100.66.98.4:3000`.

### 2.5 What already connects the sites

- All domains call the shared APIs: `/api/chat`, `/api/health`, `/api/worklog`.
- Unified navigation block `EVALINE ECOSYSTEM MESH`.
- A single backend on Brain proxied via Caddy over Tailscale.
- Worklog synchronized between nodes (TSV/LOG/TXT/MD).

---

## 3. Target architecture: "One platform = Mesh of independent nodes"

```
                        ┌──────────────────────────────────────────┐
                        │           CLIENT / BROWSER               │
                        └──────────────────┬───────────────────────┘
                                           │ HTTPS :443
                    ┌──────────────────────┼──────────────────────┐
                    ▼                      ▼                      ▼
             evabot.online          evaline.network        evaline.online
             evaline.website        (and future nodes)
                    │                      │                      │
                    └──────────┬───────────┴───────────┬──────────┘
                               ▼                       │
                 ┌─────────────────────┐               │
                 │  EvaFace (Caddy)    │               │
                 │  shared CDN/static  │   /api/* via Tailscale
                 │  + shared bundle.js │               │
                 └─────────┬───────────┘               │
                           ▼                           │
                 ┌─────────────────────┐               │
                 │  EvaBrain (Brain)   │◄──────────────┘
                 │  evabot-brain:3000  │
                 │  omniroute:20128    │
                 │  antigravity:9090   │
                 │  n8n:5678           │
                 └─────────────────────┘
```

### 3.1 Key principle

1. **Shared engine (bundle)** — a single JS file with the terminal TUI engine,
   theme, navigation, and widgets. Built once, served as static assets.
2. **Domain-specific config** — a small JSON/JS per node:
   `{ siteId, title, section, modules: [...], apiBase, theme }`.
   Each node selects and mounts only the modules it needs. **The site works without others.**
3. **Shared backend** — one evabot-brain :3000 on Brain, proxied to all domains.
   API contracts are documented separately (see §5).
4. **Mesh navigation** — a shared navigation component, but each page shows a graceful
   fallback (OFFLINE status) when the other nodes are unreachable, without breaking.

---

## 4. Implementation plan (phases)

### Phase A — Frontend refactor: shared bundle + domain config
- [ ] **TASK-22:** Extract the **TUI engine** from the 4 near-identical `index.html`
      into `src/web/` (theme, navigation, live metrics, animations, NOCSS toggle).
- [ ] **TASK-23:** Create a **node config format** `site.config.json` (id, title, section,
      modules, colors, apiBase, langs) for each domain.
- [ ] **TASK-24:** Build a single `bundle.js` + `site.js` (config) via esbuild;
      produce a separate `deploy/<domain>/` directory for each node.
- [ ] **TASK-25:** Ensure **graceful degradation** — if `/api/*` or a neighboring node is
      down, the page shows OFFLINE status and keeps working as static content.

### Phase B — Unified backend with modules
- [ ] **TASK-26:** Describe API contracts and add an **open specification** (OpenAPI 3.0)
      at `/api/openapi.json` and UI docs at `/api/docs`.
- [ ] **TASK-27:** Add **per-node health** (`/api/nodes`) to evabot-brain — status of each
      domain/service so the shared navigation shows live status of all nodes.
- [ ] **TASK-28:** (Optional) Expose n8n and the voice service behind a common API facade on Brain.

### Phase C — Connectivity and deployment unification
- [ ] **TASK-29:** Update `deploy-sync.sh` to sync the **shared bundle** to all EvaFace
      nodes + backend on Brain (independent, but synchronized).
- [ ] **TASK-30:** Update the Caddyfile (shared `import common_api`) to stop duplicating
      the `/api/*` proxy per domain.
- [ ] **TASK-31:** Unify terms/translations (EN/UK/RU) into a single i18n file wired into
      the bundle, not copied into each HTML.

### Phase D — Independence and resilience
- [ ] **TASK-32:** Verify and document that each node opens on its own when the others
      are shut down (independence test).
- [ ] **TASK-33:** Set up live node-status monitoring written into `/api/worklog`.

---

## 5. Unified API contract (shared backend on Brain)

All domains talk to `evabot-brain:3000` via relative paths `/api/*`
(proxied by Caddy). This needs **no** domain-specific keys and simplifies independence.

| Method | Path | Purpose |
| :--- | :--- | :--- |
| GET | `/api/health` | Backend + cluster status (Brain/Face/WireGuard) |
| GET | `/api/nodes` | Live status of all platform nodes *(new)* |
| POST | `/api/chat` | Unary chat generation |
| POST | `/api/chat/stream` | SSE streaming |
| POST | `/api/consilium` | Consilium (solo/broadcast/dialogue/consilium) |
| GET | `/api/models` | Model catalog (36 items, USD/EUR) |
| GET | `/api/roles` | Corporate roles |
| GET | `/api/diagnostics/boot` | Boot diagnostics |
| GET | `/api/worklog` | Chronicle (JSON) |
| GET | `/api/openapi.json` | API specification *(new)* |

---

## 6. Principles that guarantee independence

1. **Static is separated from data.** Each HTML/JS works without a backend:
   metrics and navigation show "OFFLINE", but the page still renders.
2. **Shared code — single source of truth; content — local.** A domain can
   have its own section/module without affecting the others.
3. **`/api/*` proxying is globally optional.** The Caddy block is extracted into a
   shared import; adding a new domain is one line + one folder.
4. **Mesh navigation is not a critical path.** It only informs about neighbor
   availability without blocking the current node.

---

## 7. Risks and mitigations

| Risk | Mitigation |
| :--- | :--- |
| Code duplication in 4 HTML → drift | Single `bundle.js` + node config |
| e2-micro can't handle much static | CDN logic: static is cached, one bundle |
| Failure of one Brain service | Graceful fallback, statuses in `/api/nodes` |
| Many domains in Caddyfile → duplication | Shared `import common_api` + `import common_root` |

---

## 8. Outcome (what implementation delivers)

- **One platform:** shared design, navigation, backend, model catalog.
- **Independent nodes:** each domain is self-sufficient and works when others fail.
- **Minimal duplication:** one bundle, one server, one config format.
- **Scalability:** a new domain = folder + config + a Caddy line.
