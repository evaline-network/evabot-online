# `un-ui` Framework Specification (Universal Text UI)
**Specification Version**: `1.1.0-RFC`  
**Purpose**: Line-by-line universal text UI framework designed to render identically across plain `.txt`/`.md` files, CLI streams (`curl`), terminal browsers (`lynx`, `links2`, `w3m`), and modern GUI web browsers (Chrome, Firefox, Safari).

---

## 1. Core Principles and Axioms

1. **Text-First Sovereignty**:  
   The interface must remain 100% readable, informative, and structurally intact in plain text viewers (`cat`, `nano`, `vim`, Obsidian) or across raw text streams.

2. **Single Source of Truth**:  
   A single `.unui.md` or `.unui.txt` template compiles into 4 distinct execution targets:
   - **CLI Stream**: Pure UTF-8 monospace output for `curl`, `wget`, `httpie`.
   - **TUI HTML**: Semantic zero-JS HTML (`<pre>`, `<a>`, `<table>`) for `lynx`, `links2`, `w3m`.
   - **GUI Responsive Web**: 100vw/100vh full-screen web app with theme toggle (Dark/Light), 16px monospace font, and live-polling event logs.
   - **Native Markdown**: Human-friendly document view in IDEs and Git platforms.

3. **Strict No-Emoji Standard**:  
   The use of Emoji presentation characters (such as 🟢, 🟡, 🔴, ⚡, ★, ➜, ✔, ✖, or any Unicode emoji symbols) is **strictly prohibited**.  
   Permitted characters:
   - Standard ASCII characters: alphanumeric, punctuation, square brackets `[*]`, `[->]`, `[OK]`, `[WARN]`, `[ERR]`.
   - Unicode box-drawing and geometric symbols: single/double borders (`┌─┐│└─┘`), bullets and block characters (`●`, `■`, `□`, `▲`, `▼`, `█`).
   - Standard ANSI terminal escape codes for color highlighting.

4. **Traffic-Light & Monochrome Axiom**:  
   All layout elements, borders, labels, and text are strictly monochrome (B&W/grayscale). Color is strictly reserved for traffic-light operational statuses via text badges and CSS/ANSI:
   - Green (`#00e676` / `#059669`): `[OK]`, `LIVE`, `HEALTHY`, `ONLINE`, active node `[*]`.
   - Yellow/Amber (`#ffd600` / `#d97706`): `[WARN]`, `[WRN]`, `308 Redirect`, `INGRESS`.
   - Red (`#ff1744` / `#dc2626`): `[ERR]`, `404/500`, `CRITICAL`, `OFFLINE`.

5. **Monospace Grid Alignment**:  
   Strict 1ch character grid. All tables, metadata keys, and columns are space-padded to fixed widths.

6. **Zero-Scroll (100vh)**:  
   Fixed vertical viewport fit without outer window scrolling. The log stream occupies remaining height (`flex: 1`) with internal smooth scrolling.

---

## 2. Line-by-Line Visual Anatomy

```text
Line 01: ┌── EVALINE CONSOLE // {DOMAIN} [{ROLE_BADGE}] ── ● LIVE  UTC: {TIMESTAMP} ── [◐ THEME] ──┐
Line 02: │                                                                                        │
Line 03: > NODE         : {DOMAIN} [{ROLE_BADGE}]
Line 04: > ROLE         : {ROLE_DESCRIPTION}
Line 05: > INFRA        : {HOST_NAME} · {CPU_SPEC} · {RAM_SPEC} · {LOCATION}
Line 06: ───────────────────────────────────────────────────────────────────────────────────────────
Line 07: [ CLUSTER MESH NAVIGATION // NODES ]:
Line 08:   [*] {DOMAIN_CURRENT} :: {ROLE} [CURRENT NODE]
Line 09:   [->] https://{DOMAIN_PEER_1} :: {ROLE}
Line 10:   [->] https://{DOMAIN_PEER_2} :: {ROLE}
Line 11:   [->] https://{DOMAIN_PEER_3} :: {ROLE}
Line 12: ───────────────────────────────────────────────────────────────────────────────────────────
Line 13: [ DUAL-NODE TELEMETRY ]:
Line 14:   • {CORE_NAME} (Compute Core): CPU: {LOAD} ({PCT}%) [{BAR}] | RAM: {USED}/{TOTAL} | Status: [HEALTHY [OK]]
Line 15:   • {EDGE_NAME} (Edge Ingress): Load: {LOAD} ({PCT}%) [{BAR}] | RAM: {USED}/{TOTAL} | Status: [Caddy HTTP/3 OK]
Line 16:   • WIREGUARD BACKBONE        : {IP_A} <-> {IP_B} | RTT: {RTT_MS} ms | Packet Loss: 0.0%
Line 17:   • AI MODEL POOL             : Active: {COUNT} models online | Mode: [ONLINE OK]
Line 18: ───────────────────────────────────────────────────────────────────────────────────────────
Line 19: [ LIVE PROCESS WATCHER ]:
Line 20:   PID     NODE             PROCESS / SERVICE            CPU    RAM      STATUS
Line 21:   {PID_1} {NODE_1}         {NAME_1}                     {CPU}  {MEM}    [HEALTHY]
Line 22:   {PID_2} {NODE_2}         {NAME_2}                     {CPU}  {MEM}    [HEALTHY]
Line 23:   {PID_3} {NODE_3}         {NAME_3}                     {CPU}  {MEM}    [OPERATIONAL]
Line 24:   {PID_4} {NODE_4}         {NAME_4}                     {CPU}  {MEM}    [HEALTHY]
Line 25: ───────────────────────────────────────────────────────────────────────────────────────────
Line 26: [ ACCESS & EVENT LOGS ]: [ALL] [DOMAINS (CADDY)] [SYSTEM]                           Entries: {N}
Line 27..N-1 (Dynamic stream buffer - fills remaining screen height):
           [08:36:51] [OK]  200 GET evabot.online    /api/health (HTTP/2.0 148ms) ip:34.159.202.82
           [08:36:50] [OK]  200 GET evaline.website  / (HTTP/3.0 152ms)           ip:46.211.44.120
           [08:36:49] [WRN] 308 GET evaline.online   /admin (HTTP/2.0 12ms)       ip:104.23.223.32
           [08:36:48] [ERR] 404 GET evaline.network  /unknown (HTTP/1.1 5ms)      ip:198.51.100.1
Line N : evabot@evaline-mesh:~$ █
```
