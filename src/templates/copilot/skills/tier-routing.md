# Skill: Tier Routing

Reusable routing logic. Determines the appropriate engineer agent for a task and packages context for handoff.

---

## When to Use This Skill

Called by:
- `requirements-specs-execute` — Phase: Delegate to Agent
- `requirements-auto-execute` — Phase: Delegate per task
- `requirements-bug-fix` — Phase: Fix Implementation

---

## Step 1 — Determine Tier

### Read `_Agent Level:_` in task from `08-tasks.md`

```
_Agent Level: Junior_  →  @junior-engineer
_Agent Level: Mid_     →  @mid-engineer       ← DEFAULT if field missing
_Agent Level: Senior_  →  @senior-engineer
```

**If `_Agent Level:_` field is missing** → default to `Mid`.

### Tier Reference Table

| Tier | Agent | Model | Scope |
|------|-------|-------|-------|
| **Junior** | `@junior-engineer` | Haiku | Data models, config, types, simple CRUD, CSS, scaffolding |
| **Mid** | `@mid-engineer` | Sonnet | Standard features, CRUD with validation/auth, API, UI, tests |
| **Senior** | `@senior-engineer` | Opus | Security/auth/crypto/payment, complex algorithms, multi-context architecture |

---

## Step 2 — Scope Check

Before delegating a task, confirm it matches the assigned tier:

**Junior escalation triggers** (escalate to Mid if task has any):
- Complex business logic
- Validation/auth rules
- Multi-table relationships
- Error handling flows

**Mid escalation triggers** (escalate to Senior if task has any):
- Authentication / session / JWT
- Encryption / hashing / signing
- Payment processing
- > 3 service dependencies
- Performance-critical paths

---

## Step 3 — Package Context

Create `TASK_CONTEXT` package before invoking agent. Content varies by tier:

### Junior Context Package (minimal)
```yaml
TASK_CONTEXT:
  task_number: [N]
  description: "[brief description]"
  sub_tasks: ["item 1", "item 2"]
  files_to_create: ["path/file.ext"]
  files_to_modify: ["path/existing.ext"]
  # NOT needed: rationale, trade-offs, architecture context
```

### Mid Context Package (standard)
```yaml
TASK_CONTEXT:
  task_number: [N]
  description: "[description]"
  sub_tasks: ["item 1", "item 2"]
  requirements: ["FR-X.Y", "TR-Z"]
  design_section: "07-design.md § [Section]"
  approach_hint: "[1-2 sentence approach suggestion]"
  files_to_create: [...]
  files_to_modify: [...]
  library_context: "[injected from library-ops if available]"
```

### Senior Context Package (comprehensive)
```yaml
TASK_CONTEXT:
  task_number: [N]
  description: "[full description]"
  sub_tasks: [...]
  requirements: ["FR-X.Y", "TR-Z"]
  acceptance_criteria: ["AC-X.1", "AC-X.2"]
  design_section: "07-design.md § [Section]"
  architecture_context: "[relevant architectural decisions]"
  security_requirements: "[if any]"
  performance_requirements: "[if any]"
  files_to_create: [...]
  files_to_modify: [...]
  library_context: "[injected from library-ops if available]"
```

---

## Step 4 — Invoke Agent

```
1. Construct TASK_CONTEXT per tier template above
2. Invoke the appropriate @agent with TASK_CONTEXT
3. Wait for agent completion
4. Proceed to verification (spec-review skill)
```

---

## Immutable Principles

1. **Never skip scope check** — always verify task matches tier before delegating
2. **Escalate up, never down** — if a task exceeds a tier's capability, escalate to next tier
3. **Context is tier-appropriate** — Junior gets minimal, Senior gets everything
4. **Default is Mid** — when uncertain, use Mid tier
