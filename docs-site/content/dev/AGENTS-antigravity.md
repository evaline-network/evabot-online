---
title: "AGENTS antigravity"
date: "2026-09-06"
tags: 
  - "agents"
  - "antigravity"
description: "Global EvaBot Agent Guidelines & System Architecture"
---

# Global EvaBot Agent Guidelines & System Architecture

This file establishes shared guidelines, system conventions, and tool definitions for all AI agents running on this system (**Antigravity CLI `agy`**, **Antigravity 2.0**, **Antigravity IDE**, **OpenCode**, and **KiloCode**).

---

## 1. System & Cluster Topology

- **Compute Node (Here)**: `evabot-agent-vm` (GCP `europe-west3-a`, `100.66.98.4`, user: `evabot`).
  - All builds, tests, heavy agents, and backend microservices run locally on this VM.
  - Web backend: `/var/www/evabot-backend`
  - Active projects: `/home/evabot/Desktop/`

- **Micro Node**: `evaline-micro-vm` (Serves lightweight frontend, proxying to this compute node).
  - Deployment to micro-server: `/var/www/evabot-backend/deploy-sync.sh`

---

## 2. Model Context Protocol (MCP) Unified Standards

All agents share a unified 21-server MCP suite managed by `sync-mcp`.

- **NotebookLM (`notebooklm`)**:
  - Persistent authenticated Google session (Gemini 2.5 grounded RAG).
  - Active default notebook: **Antigravity** (`<https://notebooklm.google.com/notebook/1ec088d8-f02c-43c4-9d66-ff279fbffffb`>).
  - Available notebooks: `antigravity`, `evaline-network`, `evaline-ui-ux`.
  - Use tool `ask_question` for grounded documentation queries.

- **Filesystem (`filesystem`)**:
  - Accessible roots: `/var/www/evabot-backend`, `/home/evabot/Desktop`, `/home/evabot`.

- **Git & Memory (`git`, `github`, `memory`, `sqlite`)**:
  - Repository operations anchored to `/var/www/evabot-backend`.
  - Persistent graph memory and SQLite storage at `~/.mcp/sqlite.db`.

- **Web & Browser (`chrome-devtools`, `fetch`, `context7`)**:
  - Connected to display `:0` (TigerVNC 1920x1080).
  - DevTools and live browser automation.

> **Config sync**: If any MCP server is updated, run `sync-mcp` to propagate across all 5 environments.

---

## 3. Language Server Protocol (LSP) Standards

The following language servers are globally installed in PATH and active:

- **TypeScript / JavaScript**: `typescript-language-server --stdio`

- **Python**: `pyright-langserver --stdio`

- **HTML / CSS / JSON**: `vscode-html-language-server`, `vscode-css-language-server`, `vscode-json-language-server`

- **Markdown**: `marksman`

---

## 4. Development Principles

1. **Preserve Documentation**: Never remove existing comments, docstrings, or license headers unless explicitly requested.

2. **Deterministic Paths**: Always use absolute paths or resolve relative to the active workspace.

3. **Encoding**: All text/markdown files must be strictly UTF-8.

## Related

- [[dev/AGENTS-desktop|Desktop AGENTS]]

---

Back to [[index]]
