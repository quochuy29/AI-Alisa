# Copilot Agents

This directory contains the VS Code Copilot orchestrator agent and specialist sub-agents for `requirement-commands`.

---

## `@Requirements Manager`

> **The recommended entry point for all requirement workflows.**  
> Talk to it naturally — it reads your project state and routes to the right prompt automatically.

### How to invoke

```
1. Open Copilot Chat  (Ctrl+Shift+I)
2. Switch to Agent Mode
3. Type @Requirements Manager  then describe what you need
```

### Examples

```
@Requirements Manager  add Google OAuth login
@Requirements Manager  what's the status?
@Requirements Manager  there's a bug — login fails with + in email
@Requirements Manager  we need to change the payment provider
@Requirements Manager  start implementing
@Requirements Manager  review the code
```

---

## What the agent does

The agent runs a **Boot Sequence** on every invocation:

```
1. Read requirements/.current-requirement
2. Read [session]/metadata.json  →  load phase, progress, active bugs/changes
3. Match your intent
4. Collect missing input via vscode/askQuestion  (if needed)
5. Invoke the correct prompt
6. Ask what to do next  (via vscode/askQuestion)
```

It never leaves you guessing what to do next — every action ends with a structured
choice presented through the VS Code question UI.

---

## Full Lifecycle the Agent Orchestrates

```
  You say anything  →  @Requirements Manager reads your state and routes:

  ┌─────────────────────────────────────────────────────────────────┐
  │  STAGE 1 — CAPTURE                                              │
  │  → #prompt:requirements-start                                   │
  ├─────────────────────────────────────────────────────────────────┤
  │  STAGE 2 — DESIGN & PLAN                                        │
  │  → #prompt:requirements-specs-generate                          │
  ├─────────────────────────────────────────────────────────────────┤
  │  STAGE 3 — IMPLEMENT  (one task at a time)                      │
  │  → #prompt:requirements-specs-execute                           │
  ├─────────────────────────────────────────────────────────────────┤
  │  STAGE 4 — QUALITY  (optional)                                  │
  │  → #prompt:requirements-code-review                             │
  │  → #prompt:requirements-revise                                  │
  ├─────────────────────────────────────────────────────────────────┤
  │  STAGE 5 — CLOSE                                                │
  │  → #prompt:requirements-end                                     │
  └─────────────────────────────────────────────────────────────────┘

  At any point, the agent handles side-tracks automatically:
  🐛 You report a bug      →  routes to  #prompt:requirements-bug-fix
  🔄 You request a change  →  routes to  #prompt:requirements-spec-enhance
  📊 You ask for status    →  routes to  #prompt:requirements-status
```

---

## Phase-Aware Decision Making

The agent reads `phase` from `metadata.json` and applies this routing table when
your request is ambiguous:

| Phase | Agent action |
|-------|-------------|
| `discovery` / `context` / `detail` | Show status and current gathering progress |
| `requirements_complete` | Ask: Generate specs or review what was captured? |
| `specs_generated` | Resume design approval flow |
| `design_approved` / `specs_complete` | Ask: Start implementing or review the plan? |
| `executing` | Continue with next pending task |
| `implemented` | Ask: Code review, alignment check, or close session? |
| `bug_fixing` | Resume active bug fix |
| `change_review` | Resume active change request |

---

## Interaction Model — vscode/askQuestion

All user choices are collected through the VS Code question UI — **not** plain chat text.
The agent uses these named interactions:

| Interaction | When triggered |
|-------------|----------------|
| `CHOICE_NO_SESSION` | No active session found |
| `ASK_DESCRIPTION` | Start needs a feature description |
| `ASK_BUG_DESCRIPTION` | Bug fix needs a bug description |
| `ASK_CHANGE_DESCRIPTION` | Spec-enhance needs a change description |
| `CHOICE_AFTER_CAPTURE` | After requirements gathering completes |
| `CHOICE_AFTER_DESIGN` | After design & tasks are generated |
| `CHOICE_AFTER_TASK` | After each implementation task completes |
| `CHOICE_AFTER_IMPLEMENT` | After all tasks are done |
| `CHOICE_AFTER_REVIEW` | After code review or alignment check |
| `CHOICE_AFTER_BUGFIX` | After a bug fix completes |
| `CHOICE_AFTER_CHANGE` | After a change request is applied |
| `CHOICE_END_BLOCKED` | End requested but active bug/change exists |

---

## Agent Configuration

**File:** `requirements.agent.md`  
**Model:** Claude Sonnet 4.6  
**Tools:**

| Tool | Purpose |
|------|---------|
| `vscode/askQuestion` | Collect user decisions — primary interaction channel |
| `search/codebase` | Read and search the workspace |
| `edit/editFiles` | Write and update files |
| `execute/runInTerminal` | Run shell commands |
| `execute/getTerminalOutput` | Read terminal output |
| `read/problems` | VS Code Problems panel |
| `read/terminalLastCommand` | Last command output |

---

## Guardrails

The agent enforces workflow integrity:

- ❌ Won't generate specs unless requirements are complete
- ❌ Won't start implementation unless design is approved
- ❌ Won't close a session with an unresolved active bug or change request
- ❌ Won't invoke two prompts in the same turn without user confirmation
- ✅ Always passes required arguments (`start`, `bug-fix`) before invoking

---

## Installation & Regeneration

```bash
# First-time install
npx requirement-commands init --editor=vscode-copilot

# Regenerate after package update
npx requirement-commands init --editor=vscode-copilot --force
```

---

## Specialist Sub-Agents

These agents can be invoked directly for focused tasks, or are used internally by the workflow prompts.

| Agent | File | Model | Purpose |
|-------|------|-------|---------|
| `@junior-engineer` | `junior-engineer.agent.md` | Haiku | Data models, config, types, simple CRUD, CSS |
| `@mid-engineer` | `mid-engineer.agent.md` | Sonnet | Standard features, API, UI, tests (default) |
| `@senior-engineer` | `senior-engineer.agent.md` | Opus | Security, auth, payment, complex algorithms |
| `@spec-reviewer` | `spec-reviewer.agent.md` | Sonnet | Independent spec compliance verification |
| `@task-orchestrator` | `task-orchestrator.agent.md` | Opus | Converts design to 08-tasks.md |
| `@code-seeker` | `code-seeker.agent.md` | Sonnet | Codebase analysis from 3 perspectives |
| `@librarian` | `librarian.agent.md` | Haiku | Queries project knowledge library |
| `@curator` | `curator.agent.md` | Sonnet | Harvests session knowledge into library |

### Tier-Based Agent Delegation

`#prompt:requirements-specs-execute` automatically delegates implementation to the right engineer:

| Task Complexity (`_Agent Level:_`) | Agent | Model |
|------------------------------------|-------|-------|
| `Junior` | `@junior-engineer` | Haiku |
| `Mid` (default) | `@mid-engineer` | Sonnet |
| `Senior` | `@senior-engineer` | Opus |

### Project Knowledge Library

Use `#prompt:requirements-library` to initialize and manage the knowledge base.
The library auto-grows as sessions complete via `#prompt:requirements-end` (curator harvests knowledge).

---

## Related

- [../prompts/README.md](../prompts/README.md) — individual prompt reference  
- [../../README.md](../../README.md) — full package documentation
