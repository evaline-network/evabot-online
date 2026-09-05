# EvaBot AI Engine Glossary

## Core Architecture Terms

*   **Server**: In the context of EvaBot, a server provides the runtime environment or backend infrastructure (e.g., Node.js backend, MCP servers) that hosts services and manages network requests, external connections, or database access.
*   **Service**: A standalone, self-contained functional component running within or alongside the server. It exposes a specific capability (e.g., Memory Service, Authentication Service, External API Service) that modules or agents can consume.
*   **Module**: A logical unit of code or functionality within the EvaBot AI architecture (such as a tool or a plugin). Modules are integrated into the agent's context to expand its capabilities (e.g., a "filesystem module"). They represent the internal building blocks of the AI agent's logic.
*   **Model**: The underlying Large Language Model (LLM) or neural network (e.g., Gemini, GPT-4, Claude) that provides the cognitive reasoning, natural language processing, and decision-making capabilities. Note: Costs for models are calculated per token, strictly in USD ($) or EUR (€).
