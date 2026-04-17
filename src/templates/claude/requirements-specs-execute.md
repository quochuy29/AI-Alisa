---
description: Execute implementation tasks from task breakdown (one task per session)
allowed-tools: Bash(*), Read(*), Write(*), Edit(*), Glob(*), Grep(*), AskUserQuestion(*), Agent(*)
---

# Requirements Specs Execute

Execute ONE implementation task from `08-tasks.md` per Claude Code session.

**CRITICAL RULE**: Execute **exactly ONE task per session**.
Fresh context per task = better code quality, cleaner error isolation, natural review checkpoint.

---

## 🏗️ ARCHITECTURE OVERVIEW

```
┌──────────────────────────────────────────────────────────────┐
│  /requirements-specs-execute (ORCHESTRATOR)                  │
├──────────────────────────────────────────────────────────────┤
│  Phase 1: Session Validation                                 │
│  Phase 2: Task Parsing                                       │
│  Phase 3: Context Preparation                                │
│  Phase 4: Research + Implementation                          │
│  Phase 5: Result Validation                                  │
│  Phase 6: User Verification Loop (AskUserQuestion tool)      │
│  Phase 7: Completion + Session End                           │
└──────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Session Validation

1. Read `requirements/.current-requirement`
2. Read `metadata.json` — verify `phase ∈ {specs_complete, design_approved, executing}`
3. Check required files: `06-requirements-spec.md`, `07-design.md`, `08-tasks.md`
4. Check for `CLAUDE.md` for project conventions
5. If `awaitingVerification: true` → **skip to Phase 6** (resume verification, do NOT re-execute)

⛔ If any check fails → show error with remediation suggestion, HALT

---

## Phase 2: Task Parsing

6. Read `08-tasks.md` — find next `- [ ]` task (skip `- [x]`)
7. Extract:
   - Task number, description, sub-tasks
   - Requirements references (`FR-X.Y`, `TR-Z`)
8. Lookup acceptance criteria from `06-requirements-spec.md`
9. Lookup design details from `07-design.md` (relevant section)

Show parsed task:
```
══════════════════════════════════════════════════════
📋 Next Task: #[N] — [Description]
──────────────────────────────────────────────────────
Sub-tasks : [count]
Type      : [CODE | DOCUMENTATION | CONFIG | TEST]
Size      : [S | M | L] (~XXX lines)
Requires  : FR-X.Y, TR-Z
Design    : 07-design.md § [Section]
══════════════════════════════════════════════════════
```

---

## Phase 3: Context Preparation

**Task Type Detection:**

| Type | Keywords | Strategy |
|------|----------|----------|
| **CODE** | Create, Implement, Add, Build, Develop | Delegate to engineer agent (per tier) |
| **DOCUMENTATION** | Document, Write README, Create guide | Execute directly |
| **CONFIGURATION** | Configure, Set up, Initialize config | Execute directly |
| **TEST** | Test, Write tests, Unit test | Delegate to engineer agent |

**Context Hierarchy (Priority Order):**
1. `CLAUDE.md` — project-specific conventions (HIGHEST)
2. `07-design.md` — architectural decisions
3. `03-context-findings.md` — existing codebase patterns
4. `06-requirements-spec.md` — acceptance criteria

---

**[Library Injection — skip if `.library/_catalog.json` not found]**

Check `requirements/.library/_catalog.json`:
- If exists → use Agent tool to invoke `librarian` agent:
  - `workflow_phase`: `specs-execute/phase-3`
  - `task_tags`: extract keywords from task description
  - `token_budget`: 250 (Junior) / 350 (Mid) / 450 (Senior)
- Append received `<library_context>` to task context package
- If not found → skip silently, continue

---

## Phase 4: Research + Implementation

**For CODE and TEST tasks — Delegate to Engineer Agent (Tier System):**

10. Determine agent tier from `_Agent Level:_` field in task (default: `Mid` if missing):

    | Tier | Agent | Model |
    |------|-------|-------|
    | Junior | `junior-engineer` | Haiku |
    | Mid | `mid-engineer` | Sonnet ← DEFAULT |
    | Senior | `senior-engineer` | Opus |

11. Use the Agent tool to invoke engineer agent with `TASK_CONTEXT`:
    ```yaml
    TASK_CONTEXT:
      task_number: [N]
      description: "[task description]"
      sub_tasks: [list]
      requirements: ["FR-X.Y", "TR-Z"]
      acceptance_criteria: ["AC-X.Y"]
      design_section: "[relevant 07-design.md section]"
      architecture_context: "[from 03-context-findings.md]"
      files_to_create: [list]
      files_to_modify: [list]
      conventions_path: "CLAUDE.md"
      library_context: "[if available]"
    ```

12. Receive `IMPLEMENTATION_PACKAGE` from agent.

13. Check quality gates from package:
    - `research_gate` ≥ 2/4 (Junior) / 4/4 (Mid or Senior)
    - `self_review_score` ≥ 12/20 (Junior) / 16/20 (Mid) / 18/20 (Senior)
    - If gates not met → ask agent to retry (max 2 attempts) → escalate tier if still failing

**For DOCUMENTATION and CONFIGURATION tasks — Execute directly:**
- New files → `Write` tool
- Existing files → `Read` first, then targeted `Edit` (NEVER `Write` on existing)
- Follow ALL conventions from `CLAUDE.md`
- Minimal, focused changes only

14. Run verification if applicable: `Bash [test command]`
15. Log changes in `10-change-log.md`
16. Update `metadata.json`: `awaitingVerification: true`

---

## Phase 5: Spec Review (Mid and Senior tiers only)

For `Mid` and `Senior` tasks, use the Agent tool to invoke `spec-reviewer` agent:
```yaml
SPEC_REVIEW_REQUEST:
  task_number: [N]
  task_description: "[from 08-tasks.md]"
  sub_tasks: [...]
  requirements: ["FR-X.Y", "TR-Z"]
  acceptance_criteria: ["AC-X.1"]
  files_created: [from IMPLEMENTATION_PACKAGE]
  files_modified: [from IMPLEMENTATION_PACKAGE]
  requirements_spec_path: "[session]/06-requirements-spec.md"
  design_path: "[session]/07-design.md"
  agent_traceability: [from IMPLEMENTATION_PACKAGE]
```

Receive `SPEC_REVIEW_RESULT` → show verdict in completion summary (Phase 6).

---

## Phase 5.5: Result Self-Validation

Before presenting to user, verify:
```
<self-check>
□ All sub-tasks addressed?
□ Acceptance criteria satisfied?
□ Conventions from CLAUDE.md followed?
□ No unintended changes to unrelated files?
□ Verification commands ready?
□ Traceability to FR-X.Y maintained?
</self-check>
```

---

## Phase 6: Completion Summary + Verification Loop

17. Show what was done:
```
══════════════════════════════════════════════════════════
Task #[N] Complete ⏳ Awaiting Your Verification
══════════════════════════════════════════════════════════

Task: [Description from 08-tasks.md]

What was done:
✓ Created [file] ([N] lines)
✓ Created [file] ([N] lines)
✓ Modified [file] ([description])

Requirements Satisfied:
✓ FR-X.Y → [implementation note]
✓ AC-X.1 → [satisfied by]
✓ AC-X.2 → [satisfied by]

You can verify by:
- [verification command 1]
- [verification command 2]
Expected: [expected result]

Files to review:
- [file_path_1]
- [file_path_2]
══════════════════════════════════════════════════════════
```

18. Ask for verification using AskUserQuestion tool:
```
AskUserQuestion("Is Task #[N] correctly implemented and complete?", [
  "Yes — mark complete and end this session",
  "Changes needed — minor adjustments required",
  "Not working — functional issues or bugs",
  "Incomplete — missing functionality"
])
```
→ "Yes…"            : Proceed to Phase 7
→ "Changes needed…" : Ask "What changes are needed?" → apply → return to step 17
→ "Not working…"    : Ask "What's not working?" → debug + fix → return to step 17
→ "Incomplete…"     : Ask "What's missing?" → add functionality → return to step 17

**After 3+ revisions:** Use AskUserQuestion:
```
AskUserQuestion("This task has required multiple revisions. How would you like to proceed?", [
  "Continue trying — one more revision",
  "Skip this task — mark incomplete, continue to next",
  "Pause for manual intervention — stop here for external help",
  "Redesign approach — return to design phase"
])
```

---

## Phase 7: Completion

19. Mark task complete in `08-tasks.md`:
    ```markdown
    # Before:
    - [ ] N. [Task description]

    # After:
    - [x] N. [Task description]
    ```

20. Update `metadata.json`:
    ```json
    {
      "phase": "executing",
      "specs": {
        "completedTasks": "X + 1",
        "awaitingVerification": false,
        "currentTaskNumber": "N",
        "lastCompletedAt": "ISO-8601"
      }
    }
    ```

21. If all tasks complete → update `phase: "implemented"`

22. Show session end:
```
══════════════════════════════════════════════════════════
✅ Task #[N] Marked Complete

Progress: [X+1]/[Y] tasks ([percentage]%)

Session Summary:
├── Task: [description]
├── Files Created: [count]
├── Files Modified: [count]
└── Revisions: [count]

══════════════════════════════════════════════════════════
```

**[If more tasks remain]:**
```
Next Task: #[N+1] - [preview description]

To continue: Start a NEW Claude Code session → /requirements-specs-execute
(Fresh context provides optimal code quality)
```

**[If all tasks complete]:**
```
🎉 IMPLEMENTATION COMPLETE!

All [Y] tasks have been implemented and verified.

Next steps:
1. Run tests: [suggested command]
2. Review code: /requirements-code-review
3. Archive session: /requirements-end
```

---

## ⚠️ CRITICAL: SESSION ENDS HERE

**Do NOT continue to the next task in this session.**
Each task MUST be executed in its own Claude Code session for optimal quality.

---

## Resumption Protocol

If `awaitingVerification: true` in metadata (interrupted session):

```
Task #[N] was executed but not verified. Resuming verification...

[Show last completion summary]
```

Use AskUserQuestion:
```
AskUserQuestion("Is Task #[N] correctly implemented?", [
  "Yes — mark complete",
  "Changes needed",
  "Not working",
  "Incomplete"
])
```

---

## Related Commands

- `/requirements-specs-generate` — Generate design + tasks before executing
- `/requirements-revise` — Check code alignment with requirements/design
- `/requirements-status` — Check current session status
- `/requirements-bug-fix` — Fix bugs found during implementation
- `/requirements-end` — Archive completed session
