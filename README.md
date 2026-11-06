# Concord Demo Taskboard

A tiny full stack task board (Node.js/Express + vanilla JS) built as a **playground for testing [Concord MCP](https://github.com/Get-Concord-AI/concord-mcp)** with two coding agents working in the same repository.

The app itself is deliberately small. The point is the experiment: two agents get two features that **overlap on purpose** (shared API contract, shared docs, shared tests), so you can observe how Concord handles presence, overlapping work, messaging and handoff.

## The app

```bash
npm install
npm start      # http://localhost:3000
npm test       # 4 tests, Node's built-in test runner
```

- `src/` – Express API + in-memory store
- `public/` – plain HTML/CSS/JS front end
- `test/` – API tests
- `docs/API.md` – API contract (shared by both features)

## The experiment

Two features are developed in parallel by two different agents:

| Agent | Feature | Files likely touched |
|-------|---------|----------------------|
| **A – backend** | Add a `priority` field (`low` / `normal` / `high`), validate it, support `GET /api/tasks?priority=high` | `src/server.js`, `src/store.js`, `test/api.test.js`, `docs/API.md` |
| **B – frontend** | Priority selector in the form, colored badge on each task, filter dropdown | `public/*`, `docs/API.md` |

Both depend on the same API contract and both edit `docs/API.md`, which is where overlapping work is expected. A third session (or a human) acts as the **reviewer** at the end.

### How to run it

1. Install Concord and set it up in this repo (see the Concord README for the current instructions):
   ```bash
   npm install -g @concord-ai/concord-mcp
   concord setup
   ```
2. Restart your agent clients (for example Claude Code and Cursor/Codex).
3. Give each agent its prompt from [`AGENT_PROMPTS.md`](AGENT_PROMPTS.md).
4. Watch the coordination with `concord status`, `concord who` and `concord tasks`.
5. When both are done, hand off to the reviewer prompt and run `npm test`.
6. Write down what happened in [`docs/EXPERIMENT_LOG.md`](docs/EXPERIMENT_LOG.md).

## Results

> _To be completed after running the experiment. Only write what you actually observed._

- Setup: _what worked / what was unclear_
- Overlap detection: _did Concord warn about the shared files? when?_
- Messaging between agents: _what was exchanged?_
- Handoff / review: _was the evidence useful?_
- Bugs or rough edges found: _link the issues you opened, if any_

## About

Built by [Mame Fama Fall](https://mamefama-rgb.github.io/MameFamaFall.github.io/), Master 2 Software Engineering student at ESP/UCAD, Dakar.
