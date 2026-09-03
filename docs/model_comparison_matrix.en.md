# EvaBot Comprehensive Model Comparison Matrix & Architecture Guide

**Version:** 0.3.0  
**Specification:** Complete Unified Google DeepMind & OpenRouter Model Fleet  
**Pricing Standards:** Strictly USD ($) and EUR (€) — Global Currency Compliance  
**Total Registered Models:** 56 models across 12 architectural categories  

---

## 1. Executive Summary & Fleet Architecture

EvaBot integrates a multi-tier, multi-provider LLM orchestration layer spanning direct Google DeepMind endpoints (`google-genai`), Google Cloud Vertex AI enterprise models (`google-partner`), the global OpenRouter gateway (`openai-compatible`), the high-availability OmniRoute daemon cluster, and private OpenCode Go edge instances.

Every model in the registry is tagged with:
- **Free vs Paid Tier Badge:** Explicit determination between zero-cost community quotas (`100% Free Quota Available`) and metered enterprise billing (`Paid / Pay-As-You-Go Only`).
- **Strict Currency Pricing:** Standardized cost per 1 million input and output tokens in USD ($) and EUR (€).
- **Architectural Specifications:** Real context window size, maximum completion tokens, target protocol, and concrete coding strengths.

---

## 2. Top 10 Coding Models Leaderboard

The leaderboard ranks models based on independent industry benchmarks:
- **SWE-bench Verified (%):** Measures real-world end-to-end software engineering capabilities (resolving actual GitHub pull requests and issues with full unit test validation).
- **LiveCodeBench (%):** Measures holistic coding capabilities on un-contaminated competitive programming, problem solving, code generation, and test completion.

### Top 10 Coding Models Benchmark Summary

| Rank | Model ID | Model Name | Primary Provider | SWE-bench Verified | LiveCodeBench | Context Window | Output Tokens | Free / Paid Tier | Input Price (USD / EUR) | Output Price (USD / EUR) |
|:---:|---|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **1** | `anthropic/claude-3.7-sonnet` | Claude 3.7 Sonnet | Anthropic / OpenRouter | **70.3%** | **65.8%** | 200,000 | 8,192 (64k*) | 🟡 Paid | $3.00 / €2.80 | $15.00 / €14.00 |
| **2** | `deepseek/deepseek-r1:free` | DeepSeek R1 (Free) | DeepSeek / OpenRouter | **49.2%** | **65.7%** | 64,000 | 8,192 | 🟢 100% Free | $0.00 / €0.00 | $0.00 / €0.00 |
| **3** | `openai/o1` | OpenAI o1 | OpenAI / OpenRouter | **48.9%** | **62.5%** | 200,000 | 100,000 | 🟡 Paid | $15.00 / €14.00 | $60.00 / €56.00 |
| **4** | `openai/o3-mini` | OpenAI o3-mini | OpenAI / OpenRouter | **49.2%** | **61.4%** | 200,000 | 100,000 | 🟡 Paid | $1.10 / €1.02 | $4.40 / €4.10 |
| **5** | `gemini-2.5-pro` | Gemini 2.5 Pro | Google DeepMind | **52.1%** | **58.4%** | **2,097,152** | 8,192 | 🟢 Free Quota + Paid | $0.00 (Free)<br>$1.25 / €1.17 | $0.00 (Free)<br>$5.00 / €4.68 |
| **6** | `gemini-2.0-flash-thinking-exp` | Gemini 2.0 Flash Thinking Exp | Google DeepMind | **45.6%** | **57.1%** | 1,048,576 | 8,192 | 🟢 Free Quota | $0.00 / €0.00 | $0.00 / €0.00 |
| **7** | `qwen/qwen-2.5-coder-32b-instruct:free` | Qwen 2.5 Coder 32B (Free) | Alibaba / OpenRouter | **39.8%** | **55.5%** | 128,000 | 8,192 | 🟢 100% Free | $0.00 / €0.00 | $0.00 / €0.00 |
| **8** | `anthropic/claude-3.5-sonnet` | Claude 3.5 Sonnet | Anthropic / OpenRouter | **49.0%** | **55.2%** | 200,000 | 8,192 | 🟡 Paid | $3.00 / €2.80 | $15.00 / €14.00 |
| **9** | `mistralai/codestral-2501` | Codestral 25.01 | Mistral AI / OpenRouter | **37.4%** | **51.2%** | 256,000 | 8,192 | 🟡 Paid | $0.30 / €0.28 | $0.90 / €0.84 |
| **10** | `openai/gpt-4o` | OpenAI GPT-4o | OpenAI / OpenRouter | **38.8%** | **45.3%** | 128,000 | 16,384 | 🟡 Paid | $2.50 / €2.33 | $10.00 / €9.30 |

*\*Note: Claude 3.7 Sonnet supports extended thinking mode with output budgets up to 64k tokens via streaming completions.*

---

### Detailed Profiles of the Top 10 Coding Models

#### 1. Claude 3.7 Sonnet (`anthropic/claude-3.7-sonnet`)
- **Key Benchmark:** 70.3% SWE-bench Verified (#1 in the world), 65.8% LiveCodeBench.
- **Architectural Strength:** Hybrid reasoning architecture allowing seamless toggle between rapid instant responses and test-time dynamic chain-of-thought thinking.
- **Coding Capabilities:** End-to-end repository refactoring, complex bug localization across multiple dependent modules, precise frontend UI implementation matching pixel specifications, and zero-shot multi-file code review.
- **Pricing:** $3.00 / €2.80 input, $15.00 / €14.00 output per 1M tokens.

#### 2. DeepSeek R1 (`deepseek/deepseek-r1:free` & `deepseek/deepseek-r1`)
- **Key Benchmark:** 65.7% LiveCodeBench, 49.2% SWE-bench Verified.
- **Architectural Strength:** Large-scale reinforcement learning (RL) reasoning model with open weights, generating comprehensive chain-of-thought verification traces.
- **Coding Capabilities:** Algorithmic competition problem solving (Codeforces Div 1 / LeetCode Hard), complex race condition remediation, mathematical proofs, and AST transformations.
- **Pricing:** 100% Free ($0.00 / €0.00) via OpenRouter Community Tier (`:free`), or $0.55 / €0.51 input and $2.19 / €2.04 output for priority enterprise unthrottled routing.

#### 3. OpenAI o1 (`openai/o1`)
- **Key Benchmark:** 62.5% LiveCodeBench, 48.9% SWE-bench Verified, 83.3% AIME 2024.
- **Architectural Strength:** Native test-time compute reinforcement model designed for complex planning, scientific problem solving, and error self-correction.
- **Coding Capabilities:** Exploiting and fixing deep memory safety vulnerabilities, compiler and parser construction, formal verification of distributed system consensus protocols.
- **Pricing:** $15.00 / €14.00 input, $60.00 / €56.00 output per 1M tokens.

#### 4. OpenAI o3-mini (`openai/o3-mini`)
- **Key Benchmark:** 61.4% LiveCodeBench, 49.2% SWE-bench Verified.
- **Architectural Strength:** Low-cost, high-velocity reasoning model with selectable reasoning effort levels (`low`, `medium`, `high`).
- **Coding Capabilities:** High-frequency competitive math, unit test suite construction, algorithmic optimizations, and fast CI/CD triage.
- **Pricing:** $1.10 / €1.02 input, $4.40 / €4.10 output per 1M tokens.

#### 5. Gemini 2.5 Pro (`gemini-2.5-pro`)
- **Key Benchmark:** 52.1% SWE-bench Verified, 58.4% LiveCodeBench.
- **Architectural Strength:** Massive 2,097,152 token native multimodal context window capable of ingesting entire enterprise codebases in a single prompt.
- **Coding Capabilities:** Full repository dependency graph construction without chunking artifacts, long trace log correlation, complex database schema refactoring, and multi-language codebase translation.
- **Pricing:** Free Quota in Google AI Studio (2 RPM, 50 RPD) ($0.00 / €0.00). Paid tier: $1.25 / €1.17 input, $5.00 / €4.68 output per 1M tokens.

#### 6. Gemini 2.0 Flash Thinking Exp (`gemini-2.0-flash-thinking-exp`)
- **Key Benchmark:** 57.1% LiveCodeBench, 45.6% SWE-bench Verified.
- **Architectural Strength:** Google DeepMind’s ultra-fast experimental reasoning architecture exposing transparent thinking tokens before generation.
- **Coding Capabilities:** Real-time pair programming with explicit chain-of-thought, concurrency debugging, sub-second logic validation, and live execution loop steering.
- **Pricing:** 100% Free Quota in Google AI Studio (10 RPM, 4M TPM) ($0.00 / €0.00).

#### 7. Qwen 2.5 Coder 32B Instruct (`qwen/qwen-2.5-coder-32b-instruct:free`)
- **Key Benchmark:** 55.5% LiveCodeBench, 39.8% SWE-bench Verified.
- **Architectural Strength:** Dedicated coding foundation trained on over 5.5 trillion tokens of source code, documentation, and synthetic coding exercises. Highest performance-per-parameter ratio in open weights.
- **Coding Capabilities:** Multi-file code generation, syntactic mastery across 92 programming languages, AST refactoring, SQL query optimization, and fast local IDE completions.
- **Pricing:** 100% Free ($0.00 / €0.00) via OpenRouter Community Tier (`:free`), or $0.18 / €0.17 input and $0.18 / €0.17 output for paid dedicated infrastructure.

#### 8. Claude 3.5 Sonnet (`anthropic/claude-3.5-sonnet`)
- **Key Benchmark:** 49.0% SWE-bench Verified, 55.2% LiveCodeBench.
- **Architectural Strength:** Industry-standard model for code generation, software architecture design, and tool invocation accuracy.
- **Coding Capabilities:** Robust TypeScript, React, and Python backend scaffolding, detailed unit test generation, UI component crafting, and automated code review summaries.
- **Pricing:** $3.00 / €2.80 input, $15.00 / €14.00 output per 1M tokens.

#### 9. Codestral 25.01 (`mistralai/codestral-2501`)
- **Key Benchmark:** 51.2% LiveCodeBench, 37.4% SWE-bench Verified.
- **Architectural Strength:** Mistral AI’s specialized 256k context coding engine equipped with native Fill-in-the-Middle (FIM) support.
- **Coding Capabilities:** In-line IDE autocompletion, middle-of-file method insertions, multi-file code editing, and low-latency code transformations across 80+ programming languages.
- **Pricing:** $0.30 / €0.28 input, $0.90 / €0.84 output per 1M tokens.

#### 10. OpenAI GPT-4o (`openai/gpt-4o`)
- **Key Benchmark:** 45.3% LiveCodeBench, 38.8% SWE-bench Verified.
- **Architectural Strength:** Flagship omni-modal model with fast inference, broad multi-lingual training, and 128k context.
- **Coding Capabilities:** Visual architecture diagram to code translation, REST and GraphQL API client generation, full-stack prototyping, and automated JSON schema serialization.
- **Pricing:** $2.50 / €2.33 input, $10.00 / €9.30 output per 1M tokens.

---

## 3. Complete Model Registry Catalog (56 Models)

### 3.1 Google Gemini (Next-Gen Frontier)
| Model ID | Model Name | Context Window | Max Output | Free Tier Quota | Input Price (USD / EUR per 1M) | Output Price (USD / EUR per 1M) | Coding Strengths |
|---|---|---|---|---|---|---|---|
| `gemini-3.8-flash` | Gemini 3.8 Flash | 1,048,576 | 8,192 | 15 RPM, 1,500 RPD ($0.00 / €0.00) | $0.00 / €0.00 (Free)<br>$0.075 / €0.070 (Paid) | $0.00 / €0.00 (Free)<br>$0.300 / €0.280 (Paid) | Autonomous multi-file repository refactoring, sub-second live debugging, continuous agentic tool calling |
| `gemini-3.1-pro` | Gemini 3.1 Pro | 2,097,152 | 8,192 | 2 RPM, 50 RPD ($0.00 / €0.00) | $0.00 / €0.00 (Free)<br>$1.250 / €1.150 (Paid) | $0.00 / €0.00 (Free)<br>$5.000 / €4.600 (Paid) | Enterprise system architecture synthesis, SWE-bench level execution, complex AST transformations |
| `gemini-3.1-flash` | Gemini 3.1 Flash | 1,048,576 | 8,192 | 15 RPM, 1M TPM ($0.00 / €0.00) | $0.00 / €0.00 (Free)<br>$0.050 / €0.046 (Paid) | $0.00 / €0.00 (Free)<br>$0.200 / €0.185 (Paid) | Instant syntax validation, rapid unit test generation, fast documentation parsing |
| `gemini-2.5-flash` ⭐ | Gemini 2.5 Flash | 1,048,576 | 8,192 | 15 RPM, 1,500 RPD ($0.00 / €0.00) | $0.00 / €0.00 (Free)<br>$0.075 / €0.070 (Paid) | $0.00 / €0.00 (Free)<br>$0.300 / €0.280 (Paid) | High-throughput code transformations, CI/CD pipeline automation, automated test generation |
| `gemini-2.5-pro` | Gemini 2.5 Pro | 2,097,152 | 8,192 | 2 RPM, 50 RPD ($0.00 / €0.00) | $0.00 / €0.00 (Free)<br>$1.250 / €1.170 (Paid) | $0.00 / €0.00 (Free)<br>$5.000 / €4.680 (Paid) | SWE-bench Verified 52.1%, full-repo bug localization across 2M tokens, concurrency debugging |
| `gemini-2.0-flash` | Gemini 2.0 Flash | 1,048,576 | 8,192 | 15 RPM, 1,500 RPD ($0.00 / €0.00) | $0.00 / €0.00 (Free)<br>$0.100 / €0.093 (Paid) | $0.00 / €0.00 (Free)<br>$0.400 / €0.375 (Paid) | Fast code generation, live bash execution, regex drafting, multi-turn code debugging |
| `gemini-2.0-flash-lite` | Gemini 2.0 Flash Lite | 1,048,576 | 8,192 | 30 RPM, 1,500 RPD ($0.00 / €0.00) | $0.00 / €0.00 (Free)<br>$0.075 / €0.070 (Paid) | $0.00 / €0.00 (Free)<br>$0.300 / €0.280 (Paid) | High-volume linting, boilerplate generation, JSON schema validation, docstrings |
| `gemini-2.0-flash-thinking-exp` | Gemini 2.0 Flash Thinking Exp | 1,048,576 | 8,192 | 10 RPM, 4M TPM ($0.00 / €0.00) | $0.00 / €0.00 (Free)<br>$0.100 / €0.093 (Paid) | $0.00 / €0.00 (Free)<br>$0.400 / €0.375 (Paid) | LiveCodeBench 57.1%, step-by-step thinking tokens, concurrency debugging, mathematical proofs |

*⭐ Recommended default model for EvaBot general operations.*

---

### 3.2 Google Gemini (Long-Context)
| Model ID | Model Name | Context Window | Max Output | Free Tier Quota | Input Price (USD / EUR per 1M) | Output Price (USD / EUR per 1M) | Coding Strengths |
|---|---|---|---|---|---|---|---|
| `gemini-1.5-pro` | Gemini 1.5 Pro | 2,097,152 | 8,192 | 2 RPM, 50 RPD ($0.00 / €0.00) | $0.00 / €0.00 (Free)<br>$1.250 / €1.170 (Paid) | $0.00 / €0.00 (Free)<br>$5.000 / €4.680 (Paid) | Cross-repository dependency analysis, legacy codebase modernization, full-stack audits |
| `gemini-1.5-flash` | Gemini 1.5 Flash | 1,048,576 | 8,192 | 15 RPM, 1M TPM ($0.00 / €0.00) | $0.00 / €0.00 (Free)<br>$0.075 / €0.070 (Paid) | $0.00 / €0.00 (Free)<br>$0.300 / €0.280 (Paid) | Fast full-file parsing, multi-file code searches, log triage, commit message generation |
| `gemini-1.5-flash-8b` | Gemini 1.5 Flash 8B | 1,048,576 | 8,192 | 15 RPM ($0.00 / €0.00) | $0.00 / €0.00 (Free)<br>$0.0375 / €0.035 (Paid) | $0.00 / €0.00 (Free)<br>$0.150 / €0.140 (Paid) | Micro-task execution, syntax check, token-efficient query routing, code snippet extraction |

---

### 3.3 Google Gemma (Open Weights)
| Model ID | Model Name | Context Window | Max Output | Free Tier Quota | Input Price (USD / EUR per 1M) | Output Price (USD / EUR per 1M) | Coding Strengths |
|---|---|---|---|---|---|---|---|
| `gemma-2-27b-it` | Gemma 2 (27B Instruct) | 8,192 | 4,096 | Open Weights / AI Studio ($0.00 / €0.00) | $0.00 / €0.00 (Free)<br>$0.270 / €0.250 (Vertex) | $0.00 / €0.00 (Free)<br>$0.270 / €0.250 (Vertex) | Python, TypeScript, C++ code completion, algorithmic optimization, HumanEval |
| `gemma-2-9b-it` | Gemma 2 (9B Instruct) | 8,192 | 4,096 | Open Weights / AI Studio ($0.00 / €0.00) | $0.00 / €0.00 (Free)<br>$0.100 / €0.090 (Vertex) | $0.00 / €0.00 (Free)<br>$0.100 / €0.090 (Vertex) | Fast local code assistance, unit test generation, script writing, container deployment |
| `gemma-2-2b-it` | Gemma 2 (2B Instruct) | 8,192 | 4,096 | Open Weights / AI Studio ($0.00 / €0.00) | $0.00 / €0.00 (Free)<br>$0.040 / €0.037 (Vertex) | $0.00 / €0.00 (Free)<br>$0.040 / €0.037 (Vertex) | On-device code completion, fast regex construction, lightweight CLI helpers |

---

### 3.4 Google Specialized & Embeddings
| Model ID | Model Name | Context Window | Max Output | Free Tier Quota | Input Price (USD / EUR per 1M) | Output Price (USD / EUR per 1M) | Coding Strengths |
|---|---|---|---|---|---|---|---|
| `codegemma-7b-it` | CodeGemma (7B Instruct) | 8,192 | 4,096 | Open Weights / AI Studio ($0.00 / €0.00) | $0.00 / €0.00 (Free)<br>$0.100 / €0.090 (Vertex) | $0.00 / €0.00 (Free)<br>$0.100 / €0.090 (Vertex) | Fill-in-the-Middle (FIM), multi-language syntax completion (Python, JS, TS, Go, Java, C++, Rust) |
| `codegemma-2b` | CodeGemma (2B Base/FIM) | 8,192 | 2,048 | Open Weights / AI Studio ($0.00 / €0.00) | $0.00 / €0.00 (Free)<br>$0.040 / €0.037 (Vertex) | $0.00 / €0.00 (Free)<br>$0.040 / €0.037 (Vertex) | Sub-50ms Fill-in-the-Middle (FIM), inline code predictions, cursor completion |
| `recurrentgemma-2b-it` | RecurrentGemma (2B Instruct) | 8,192 | 4,096 | Open Weights / AI Studio ($0.00 / €0.00) | $0.00 / €0.00 (Free)<br>$0.040 / €0.037 (Vertex) | $0.00 / €0.00 (Free)<br>$0.040 / €0.037 (Vertex) | Constant-memory generation via Griffin architecture, infinite code trace analysis |
| `text-embedding-004` | Text-Embedding-004 | 2,048 | 768 | 1,500 RPD ($0.00 / €0.00) | $0.00 / €0.00 (Free)<br>$0.025 / €0.023 (Paid) | $0.00 / €0.00 (Vector output) | Semantic codebase indexing, function definition retrieval, duplicate code search |

---

### 3.5 OpenRouter Explicit Free Models (`:free`)
| Model ID | Model Name | Context Window | Max Output | Status | Pricing (USD / EUR per 1M) | Coding Strengths |
|---|---|---|---|---|---|---|
| `deepseek/deepseek-r1:free` | DeepSeek R1 (Free) | 64,000 | 8,192 | 🟢 100% Free | $0.00 / €0.00 | LiveCodeBench 65.7%, deep algorithmic reasoning, complex competitive programming |
| `meta-llama/llama-3.3-70b-instruct:free` | Llama 3.3 70B Instruct (Free) | 128,000 | 4,096 | 🟢 100% Free | $0.00 / €0.00 | Full-stack web development, Python data engineering, REST API scaffolding |
| `google/gemini-2.0-flash-exp:free` | Gemini 2.0 Flash Exp (Free) | 1,048,576 | 8,192 | 🟢 100% Free | $0.00 / €0.00 | Fast code refactoring, instant code reviews, multi-language translation |
| `qwen/qwen-2.5-coder-32b-instruct:free` | Qwen 2.5 Coder 32B (Free) | 128,000 | 8,192 | 🟢 100% Free | $0.00 / €0.00 | LiveCodeBench 55.5%, SWE-bench Verified 39.8%, unmatched efficiency-per-parameter |
| `mistralai/mistral-7b-instruct:free` | Mistral 7B Instruct (Free) | 32,768 | 4,096 | 🟢 100% Free | $0.00 / €0.00 | Fast bash scripting, basic unit testing, regex parsing, config generation |
| `google/gemini-2.0-pro-exp-02-05:free` | Gemini 2.0 Pro Exp 02-05 (Free) | 2,097,152 | 8,192 | 🟢 100% Free | $0.00 / €0.00 | SWE-bench software engineering, architectural planning, massive whole-repository refactoring |
| `microsoft/phi-3-medium-128k-instruct:free` | Phi-3 Medium 128k Instruct (Free) | 128,000 | 4,096 | 🟢 100% Free | $0.00 / €0.00 | Algorithmic logic, Python/C# data structures, mathematics verification |

---

### 3.6 OpenRouter Top Paid Models
| Model ID | Model Name | Context Window | Max Output | Status | Input Price (USD / EUR) | Output Price (USD / EUR) | Coding Strengths |
|---|---|---|---|---|---|---|---|
| `anthropic/claude-3.7-sonnet` | Claude 3.7 Sonnet | 200,000 | 8,192 (64k*) | 🟡 Paid | $3.00 / €2.80 | $15.00 / €14.00 | SWE-bench Verified 70.3%, LiveCodeBench 65.8%, autonomous multi-file refactoring |
| `anthropic/claude-3.5-sonnet` | Claude 3.5 Sonnet | 200,000 | 8,192 | 🟡 Paid | $3.00 / €2.80 | $15.00 / €14.00 | Exceptional code synthesis, UI/UX component generation, thorough test case authoring |
| `anthropic/claude-3.5-haiku` | Claude 3.5 Haiku | 200,000 | 8,192 | 🟡 Paid | $0.80 / €0.75 | $4.00 / €3.75 | High-throughput subagent tasks, rapid code editing, CLI tooling |
| `openai/o3-mini` | OpenAI o3-mini | 200,000 | 100,000 | 🟡 Paid | $1.10 / €1.02 | $4.40 / €4.10 | LiveCodeBench 61.4%, algorithmic optimization, reasoning effort controls |
| `openai/o1` | OpenAI o1 | 200,000 | 100,000 | 🟡 Paid | $15.00 / €14.00 | $60.00 / €56.00 | Complex algorithm design, security vulnerability exploit analysis, formal logic |
| `openai/gpt-4o` | OpenAI GPT-4o | 128,000 | 16,384 | 🟡 Paid | $2.50 / €2.33 | $10.00 / €9.30 | Full-stack app scaffolding, multimodal UI-to-code, robust API design |
| `openai/gpt-4o-mini` | OpenAI GPT-4o-mini | 128,000 | 16,384 | 🟡 Paid | $0.15 / €0.14 | $0.60 / €0.56 | Lightweight script generation, data transformations, unit test stubbing |
| `deepseek/deepseek-r1` | DeepSeek R1 (Paid) | 64,000 | 8,192 | 🟡 Paid | $0.55 / €0.51 | $2.19 / €2.04 | Priority unthrottled competitive programming, formal verification, bug fixing |
| `qwen/qwen-2.5-coder-32b-instruct` | Qwen 2.5 Coder 32B (Paid) | 128,000 | 8,192 | 🟡 Paid | $0.18 / €0.17 | $0.18 / €0.17 | Dedicated low-latency coding infrastructure, AST analysis, unit test generation |
| `meta-llama/llama-3.1-405b-instruct` | Meta Llama 3.1 405B Instruct | 128,000 | 4,096 | 🟡 Paid | $2.50 / €2.33 | $2.50 / €2.33 | Synthetic dataset generation, compiler design, enterprise architecture blueprints |
| `mistralai/codestral-2501` | Codestral 25.01 | 256,000 | 8,192 | 🟡 Paid | $0.30 / €0.28 | $0.90 / €0.84 | Fill-in-the-Middle (FIM), 256k context repo reasoning, 80+ programming languages |
| `x-ai/grok-2-1212` | xAI Grok 2 (1212) | 131,072 | 4,096 | 🟡 Paid | $2.00 / €1.86 | $10.00 / €9.30 | Rapid code generation, creative algorithm design, complex system diagnostics |
| `cohere/command-r-plus-08-2024` | Cohere Command R+ (08-2024) | 128,000 | 4,096 | 🟡 Paid | $2.50 / €2.33 | $10.00 / €9.30 | Multi-hop tool orchestration, automated doc parsing, structured JSON output |
| `openrouter/deepseek-chat` | DeepSeek V3 | 64,000 | 8,192 | 🟡 Paid | $0.14 / €0.13 | $0.28 / €0.26 | 671B MoE cost efficiency, full-stack web applications, refactoring |

---

### 3.7 Google Cloud Vertex AI Model Garden & Cluster Integrations
| Model ID | Model Name | Category | Context Window | Status | Input Price (USD / EUR) | Output Price (USD / EUR) |
|---|---|---|---|---|---|---|
| `claude-3-7-sonnet` | Claude 3.7 Sonnet (Vertex AI) | Anthropic Claude on Google Cloud | 200,000 | 🟡 Paid | $3.00 / €2.80 | $15.00 / €14.00 |
| `claude-3-5-sonnet` | Claude 3.5 Sonnet (Vertex AI) | Anthropic Claude on Google Cloud | 200,000 | 🟡 Paid | $3.00 / €2.80 | $15.00 / €14.00 |
| `claude-3-5-haiku` | Claude 3.5 Haiku (Vertex AI) | Anthropic Claude on Google Cloud | 200,000 | 🟡 Paid | $0.80 / €0.75 | $4.00 / €3.75 |
| `llama-3.3-70b-instruct` | Meta Llama 3.3 (70B Instruct) | Meta Llama 3 on Google Cloud | 128,000 | 🟡 Paid | $0.70 / €0.65 | $0.90 / €0.84 |
| `llama-3.2-90b-vision-instruct` | Meta Llama 3.2 (90B Vision) | Meta Llama 3 on Google Cloud | 128,000 | 🟡 Paid | $0.90 / €0.84 | $1.20 / €1.12 |
| `llama-3.1-405b-instruct` | Meta Llama 3.1 (405B Instruct) | Meta Llama 3 on Google Cloud | 128,000 | 🟡 Paid | $3.50 / €3.25 | $3.50 / €3.25 |
| `mistral-large-2411` | Mistral Large 2 (Vertex AI) | Mistral AI on Google Cloud | 128,000 | 🟡 Paid | $2.00 / €1.86 | $6.00 / €5.60 |
| `codestral-2501` | Codestral 25.01 (Vertex AI) | Mistral AI on Google Cloud | 256,000 | 🟡 Paid | $0.30 / €0.28 | $0.90 / €0.84 |
| `deepseek-r1` | DeepSeek R1 (Vertex AI) | DeepSeek on Google Cloud | 64,000 | 🟡 Paid | $0.55 / €0.51 | $2.19 / €2.04 |
| `jamba-1.5-large` | AI21 Jamba 1.5 Large | AI21 Labs & Cohere on Google Cloud | 256,000 | 🟡 Paid | $2.00 / €1.86 | $8.00 / €7.45 |
| `command-r-plus` | Cohere Command R+ | AI21 Labs & Cohere on Google Cloud | 128,000 | 🟡 Paid | $2.50 / €2.33 | $10.00 / €9.30 |
| `omniroute/gemini-2.5-pro` | OmniRoute Gemini 2.5 Pro | OmniRoute Daemon Cluster | 2,097,152 | 🟢 100% Free | $0.00 (Self-Hosted) / $1.25 | $0.00 (Self-Hosted) / $5.00 |
| `omniroute/deepseek-r1` | OmniRoute DeepSeek R1 | OmniRoute Daemon Cluster | 64,000 | 🟢 100% Free | $0.00 (Local) / $0.55 | $0.00 (Local) / $2.19 |
| `omniroute/claude-3.5-sonnet` | OmniRoute Claude 3.5 Sonnet | OmniRoute Daemon Cluster | 200,000 | 🟡 Paid | $3.00 / €2.80 | $15.00 / €14.00 |
| `opencode/go-coder-32b` | OpenCode Go Coder 32B | OpenCode Go Platforms | 64,000 | 🟢 100% Free | $0.00 (Dev) / $0.20 | $0.00 (Dev) / $0.60 |
| `opencode/go-fast` | OpenCode Go Fast | OpenCode Go Platforms | 32,768 | 🟢 100% Free | $0.00 (Dev) / $0.08 | $0.00 (Dev) / $0.24 |

---

## 4. Cost-to-Performance Pareto Analysis

When designing autonomous agent workloads in EvaBot, cost-to-performance efficiency is paramount:

```
SWE-bench Verified (%)
  ▲
70│                                            ● Claude 3.7 Sonnet ($3.00 / $15.00)
  │
60│
  │
50│                   ● Gemini 2.5 Pro ($1.25 / $5.00)
  │                   ● DeepSeek R1 [FREE] ($0.00 / $0.00)
  │                   ● o3-mini ($1.10 / $4.40)
40│  ● Qwen 2.5 Coder 32B [FREE] ($0.00 / $0.00)
  │  ● Codestral 25.01 ($0.30 / $0.90)
30│  ● Llama 3.3 70B [FREE] ($0.00 / $0.00)
  │
  └──────────────────────────────────────────────────────────────────► Blended Price per 1M ($)
    $0.00 (Free Tier)     $1.00            $5.00            $10.00+
```

### Optimal Routing Strategy:
1. **Zero-Cost High-Yield Tier (100% Free Quotas):**
   - **Lead Architect & Complex Debugging:** `deepseek/deepseek-r1:free` and `google/gemini-2.0-pro-exp-02-05:free`.
   - **Code Editing & Unit Tests:** `qwen/qwen-2.5-coder-32b-instruct:free`.
   - **Fast Chat, Formatting & Linting:** `gemini-2.5-flash` (Google AI Studio Free Quota) and `meta-llama/llama-3.3-70b-instruct:free`.
2. **Enterprise Mission-Critical Tier (Metered):**
   - When absolute state-of-the-art SWE-bench precision is required, escalate tasks to `anthropic/claude-3.7-sonnet` or `openai/o3-mini`.
   - For multi-million token codebases without retrieval chunking, route to `gemini-2.5-pro` (2M context).
