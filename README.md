# OutreachAI — Autonomous Consumer Action Agent
**The Ken's Case-Build Competition 2026 — "The Great Rewiring" (Unstop Edition)**  
*Prize Pool: ₹20,00,000 | Track: Autonomous Agents & Consumer Action Architecture*

---

## 1. What OutreachAI Does
OutreachAI transforms consumer grievance redressal in India from a passive, frustrating process into an **autonomous, verifiable execution engine**. Rather than leaving consumers to wait on customer support lines or navigate opaque carrier tracking, OutreachAI:
1. **Perceives Intent & Evidence**: Extracts order IDs, waybill numbers, transaction hashes, and merchant details from raw consumer input or regional voice telephony.
2. **Plans & Orchestrates Across Real-World Rails**: Synthesizes a deterministic task graph connecting **Delhivery Logistics**, **Pine Labs Payments**, and **Gnani Indic Voice** telephony.
3. **Enforces Human-in-the-Loop Safeguards**: High-risk actions (such as direct bank refund reversals and legal filing dockets) require explicit 1-tap cryptographic user authorization.
4. **Follows Up & Settles Autonomously**: Executes bounded retry loops with exponential backoff and verifies bank UTR settlements on NPCI/payment switches.

---

## 2. Infrastructure & External Rail Status

| Rail / Integration | Role in Resolution Architecture | Status | Fallback / Simulation Mode |
| :--- | :--- | :--- | :--- |
| **Google OAuth (SSO)** | User authentication & session token isolation | **LIVE_API** | Supabase Auth with PKCE validation |
| **Supabase PostgreSQL** | Relational state store with Row Level Security (RLS) | **LIVE_API** | 11 tables with `auth.uid() = user_id` isolation |
| **NVIDIA NIM AI** | Primary reasoning & dynamic plan formulation | **LIVE_API** | `meta/llama-3.1-8b-instruct` (Server-side) |
| **Google Gemini 1.5** | Secondary high-speed streaming fallback | **LIVE_API** | `gemini-1.5-flash` |
| **OpenRouter** | Deep reasoning & statutory notice drafting | **LIVE_API** | `meta-llama/llama-3.3-70b-instruct` |
| **Delhivery Logistics** | AWB track & trace, false NDR flag override, RTO freeze | **SANDBOX_SIMULATED** | Deterministic telemetry with verified rider exception logs |
| **Pine Labs Payments** | Payment gateway TAT audit, direct refund settlement | **SANDBOX_SIMULATED** | Validated UTR `#423891004812` reversal payloads |
| **Gnani Voice AI** | Regional Indic multilingual voice calls (Hindi/English) | **SANDBOX_SIMULATED** | Synthetic telephony dispatcher for hub supervisors |

---

## 3. Getting Started Locally

### Prerequisites
- Node.js 18.17+ or Node.js 20+
- npm, pnpm, or bun

### 1. Clone & Install Dependencies
```bash
cd outreach-ai
npm install
```

### 2. Configure Environment Variables (`.env.local`)
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://oevifluecwdnjrxmaglx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Primary AI Provider (NVIDIA NIM)
NVIDIA_API_KEY=nvapi-XXXXX

# Fallback AI Providers
GEMINI_API_KEY=AIzaSyXXXXX
OPENROUTER_API_KEY=sk-or-v1-XXXXX

# Application Host
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Schema Setup
Execute the consolidated master schema in your Supabase SQL Editor:
- Migration file: [`supabase/migrations/20260829_unstop_master_schema.sql`](./supabase/migrations/20260829_unstop_master_schema.sql)
- This creates: `profiles`, `cases`, `case_events`, `case_evidence`, `agent_actions`, `leads`, `templates`, `sequences`, `chat_conversations`, `chat_messages` with strict Row Level Security (RLS) policies and automatic profile creation triggers on `auth.users`.

### 4. Build & Run
```bash
# Build for production
npm run build

# Start production server
npm run start
```
Open [http://localhost:3000](http://localhost:3000) to access the application.

---

## 4. Competition 3-Minute Demo Script for Judges

| Time | Action | UI View | Key Evaluation Takeaway |
| :--- | :--- | :--- | :--- |
| **0:00 - 0:20** | **The Consumer Problem** | `/demo` or Landing Page | E-Commerce package marked falsely with NDR "Customer Not Reachable", Zara ₹3,499 refund delayed past 72h. |
| **0:20 - 0:40** | **Agent Intake & Perception** | Case Intake Box | Consumer enters problem or clicks Hindustani voice input via Gnani rail. |
| **0:40 - 1:00** | **Autonomous Task Plan** | Dynamic Execution Graph | Agent decomposes problem into 4 structured stages across Delhivery, Pine Labs, and CPA 2019 legal rails. |
| **1:00 - 1:20** | **Evidence & Telemetry Verification** | Rail Telemetry Tab | Delhivery audit exposes false NDR rider exception; Pine Labs audit verifies 74-hour TAT violation. |
| **1:20 - 1:40** | **Statutory Notice Generation** | Legal Notice Preview | CPA 2019 Section 2(47) notice generated with live variable interpolation. |
| **1:40 - 2:00** | **Human-in-the-Loop Authorization** | Approvals Modal | High-risk financial settlement of ₹3,499 presented with clear impact analysis for 1-tap consumer consent. |
| **2:00 - 2:20** | **Execution on Payment Rail** | Execution Console | Consumer clicks "Approve Action"; Pine Labs instant settlement rail triggers bank reversal. |
| **2:20 - 2:40** | **Outcome & UTR Verification** | Follow-Up State Machine | Bank UTR `#423891004812` confirmed; audit log marked immutable. |
| **2:40 - 3:00** | **Resolution Summary** | Verified Outcome Banner | ₹3,499 recovered, 180 consumer minutes saved, 100% direct bank credit. |

---

## 5. Judge Mode Q&A (Architectural Defensibility)

### Q1: What specific Indian consumer problem does OutreachAI solve?
**Answer**: E-Commerce consumers in India face systemic breakdown during post-order failures—specifically false Non-Delivery Reports (NDRs) by courier riders and delayed payment reversals exceeding RBI 72-hour Turn Around Time (TAT). Consumers spend 2-4 hours on support chat trees with zero agency. OutreachAI gives consumers an autonomous advocate.

### Q2: Why an Agent rather than a standard SaaS form or CRM?
**Answer**: Standard apps are static aggregators. OutreachAI is a stateful agent that reasons, coordinates across external logistics and banking APIs, adapts to counterparty responses, dispatches regional voice telephony, and follows up until verified resolution.

### Q3: Why these specific external rails (Delhivery, Pine Labs, Gnani)?
**Answer**:
1. **Delhivery Logistics**: India's largest third-party logistics network handling millions of daily packages.
2. **Pine Labs**: Dominant payment gateway switch handling merchant settlement and instant UPI/IMPS reversals.
3. **Gnani Voice AI**: Deep Indic multilingual speech AI enabling voice communication in Hindi and regional dialects.

### Q4: How is Human-in-the-Loop safety guaranteed?
**Answer**: Actions are classified by risk tier (`READ_ONLY`, `LOW`, `MEDIUM`, `HIGH`). Low-risk operations (status audits) execute autonomously; high-risk actions (initiating chargebacks, legal dockets, payment settlements) strictly require 1-tap consumer cryptographic authorization.

### Q5: How is user data isolated in the database?
**Answer**: Supabase PostgreSQL Row Level Security (RLS) is active on every table (`auth.uid() = user_id`). No user can access or view another user's cases, leads, chat history, or evidence dossiers.
