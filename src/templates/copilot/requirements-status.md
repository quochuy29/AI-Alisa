# Check Requirements Status

Show current requirement-gathering progress and continue from the last checkpoint.

---

## Instructions

1. Read `requirements/.current-requirement` → get active session path
2. Read `[session]/metadata.json` → load phase, status, task progress
3. If `08-tasks.md` exists → parse task completion counts per phase
4. If `09-bug-tracker.md` exists → count active/resolved bugs

---

**[Memory Bank Detection — Cursor — skip if unavailable]**

Attempt `mcp_user_memory_bank_list` (or equivalent read probe):
- If call succeeds → `memoryBankMode = true`
- If call fails/unavailable → `memoryBankMode = false`, skip MB enrichment

**[MB Context Enrichment — Cursor — skip if unavailable]**

When `memoryBankMode = true`:

Extract `{projectName}` from session folder slug.

Attempt to read `{projectName}/activeContext.md` via `mcp_user_memory_bank_read_file`:
- If exists → append a `🧠 Memory Bank` section to the dashboard output:
  ```
  🧠 Memory Bank: ✓ Active
  └── Last Action: {lastAction from activeContext.md}
  └── Current Focus: {currentFocus from activeContext.md}
  ```
- If not exists → show `🧠 Memory Bank: ✓ Available (no context yet)`

---

5. Display formatted status dashboard
6. Determine and suggest next action based on current phase

---

## Status Dashboard Format

```
══════════════════════════════════════════════════════════════
📋 Requirements Status — [Feature Name]
══════════════════════════════════════════════════════════════

Session     : requirements/[session-folder]/
Phase       : [phase]
Status      : [active | complete | bug_fixing | change_review]
Last Updated: [relative time, e.g. "2 hours ago"]

Requirements Progress:
  Discovery   [████████░░] 4/5 answered
  Detail      [██████████] 5/5 answered
  Spec        [✅ Complete]

Implementation Progress:
  Tasks       [████░░░░░░] 4/10 complete (40%)
  Phase 1     [████████░░] 4/5  Foundation
  Phase 2     [░░░░░░░░░░] 0/5  Business Logic
  Phase 3     [░░░░░░░░░░] 0/0  API Layer (not started)

Quality:
  Bugs        : 1 active (bug-001), 2 resolved
  Changes     : 1 applied, 0 deferred

Awaiting Verification: [Yes — Task #4 | No]
══════════════════════════════════════════════════════════════
```

---

## Phase-Specific Next Actions

| Phase | Condition | Suggested Action |
|-------|-----------|-----------------|
| `discovery` | Questions unanswered | Answer pending discovery questions |
| `context` | Analysis running | Autonomous analysis in progress |
| `detail` | Questions unanswered | Answer pending expert questions |
| `requirements_complete` | Files 00-06 done | `#prompt:requirements-specs-generate` |
| `specs_generated` | Design pending approval | `#prompt:requirements-specs-generate` (approve design) |
| `design_approved` | Tasks pending | `#prompt:requirements-specs-generate` (fresh session) |
| `specs_complete` | Tasks ready | `#prompt:requirements-specs-execute` (new Copilot Chat session) |
| `executing` | Tasks in progress | `#prompt:requirements-specs-execute` (next task, new session) |
| `bug_fixing` | Bug open | `#prompt:requirements-bug-fix` |
| `change_review` | Change pending | `#prompt:requirements-spec-enhance` |
| `implemented` | All tasks done | `#prompt:requirements-code-review` or `#prompt:requirements-end` |

---

## Checkpoint Resume

If `awaitingVerification: true` in metadata:
```
⚠️ Task #[N] is awaiting verification.

Run #prompt:requirements-specs-execute to resume verification of Task #[N].
(No re-execution — will resume from verification step)
```

---

## Related Commands

- `#prompt:requirements-current` — View full session details and file listing
- `#prompt:requirements-list` — List all requirement sessions
- `#prompt:requirements-remind` — Show phase-specific rules
