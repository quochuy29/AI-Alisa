---
description: Handle mid-execution scope changes and modifications
allowed-tools: Bash(*), Read(*), Write(*), Edit(*), AskUserQuestion(*)
---

# Requirements Spec Enhance

Handle mid-execution scope changes and modifications.

**Usage**: `/requirements-spec-enhance [change description]`

---

## Change Types

| Type | Description |
|------|-------------|
| `new_feature` | Add new functionality |
| `modify_existing` | Change existing feature |
| `remove_feature` | Remove functionality |
| `expand_scope` | Increase project scope |
| `performance` | Optimization without behavior change |
| `fix_bug` | Address implementation issues |

---

## Phase 1: Change Intake (Interactive)

1. Read `requirements/.current-requirement` and `metadata.json`
2. Get change description from `$ARGUMENTS` or ask user:
   ```
   Describe the scope change you need:
   (Type your description and press Enter)
   ```
3. Classify change type (see table above)
4. Create entry in `10-change-log.md`
5. Update metadata: `phase: "change_review"`

---

## Phase 2: Impact Analysis (Autonomous)

**CRITICAL:** Complete analysis silently. No user interaction.

6. Analyze impact on each layer:
   - **Requirements** (`06-requirements-spec.md`) — which FRs/TRs affected?
   - **Design** (`07-design.md`) — which components change?
   - **Tasks** (`08-tasks.md`) — which tasks need add/modify/remove?
7. Estimate effort:
   - **S** — 1-3 hours (small change, 1-2 files)
   - **M** — 3-8 hours (moderate change, 3-5 files)
   - **L** — 8+ hours (large change, multiple components)
8. Identify risks (breaking changes, dependencies, tests)

---

## Phase 3: Impact Presentation + Approval (Interactive)

9. Show analysis:
```
═══════════════════════════════════════════════════════════════════
Change Request Analysis
═══════════════════════════════════════════════════════════════════

Description    : [change description]
Type           : [change type]
Impact Level   : [High | Medium | Low]
Effort         : [S | M | L] (~X hours)

Requirements   : [N] affected (FR-X, FR-Y, ...)
Design changes : [components list]
Tasks impact   :
  + [N] new tasks to add
  ~ [N] tasks to modify
  - [N] tasks to remove/skip

Risks          : [description or "None identified"]
═══════════════════════════════════════════════════════════════════
```

10. Ask for approval using AskUserQuestion tool:
```
AskUserQuestion("How would you like to proceed with this change?", [
  "Approve — apply changes to specs, design, and tasks",
  "Modify — adjust the proposed change (I'll explain what)",
  "Defer — add to backlog for later (11-change-backlog.md)",
  "Cancel — discard this change request"
])
```
→ "Approve…" : proceed to Phase 4
→ "Modify…"  : ask "What would you like to change?" → update analysis → return to step 9
→ "Defer…"   : append to `11-change-backlog.md`, restore previous phase
→ "Cancel…"  : discard, restore previous phase

---

## Phase 4: Apply Changes (After Approval)

11. Update `06-requirements-spec.md`:
    - Add new FRs/TRs for new functionality
    - Modify existing FRs for scope changes
    - Strike-through or remove deprecated requirements
12. Update `07-design.md`:
    - Revise affected component specifications
    - Update data models if needed
    - Update API contracts
    - Add architecture notes for new approach
13. Update `08-tasks.md`:
    - Add new tasks (with full template: type, size, sub-tasks, ACs)
    - Modify affected existing tasks
    - Mark removed tasks with `~~strikethrough~~`
14. Append entry to `10-change-log.md`:
    ```markdown
    ## Change #[ID]: [Title]
    **Date**: [ISO-8601] | **Type**: [type] | **Impact**: [H|M|L]
    **Description**: [what changed]
    **Files updated**: [list]
    **New tasks**: [count] | **Modified**: [count] | **Removed**: [count]
    ```
15. Update metadata: restore previous phase (`executing` or `specs_complete`)

---

## Completion

```
✅ Change Applied

Updated files:
- 06-requirements-spec.md ([N] requirements updated)
- 07-design.md ([N] sections revised)
- 08-tasks.md ([N] tasks added, [N] modified)
- 10-change-log.md (change logged)

Next: /requirements-specs-execute (start a new Claude Code session)
```

---

## 10-change-log.md Template

```markdown
# Change Log

**Requirement:** [Feature Name]
**Last Updated:** [ISO-8601]

---

## Change #[ID]: [Title]

**Date:** [ISO-8601] | **Type:** [new_feature|modify_existing|remove_feature|expand_scope]
**Requested By:** User | **Applied By:** AI
**Status:** [✅ Applied | ⏳ Pending | 🗂️ Deferred]

### Description
[What changed and why]

### Impact Summary
- Requirements: [what FRs/TRs changed]
- Design: [what components/data models changed]
- Tasks: [+N new, ~N modified, -N removed]

### Task Updates
- Added: Task [N] — [description]
- Modified: Task [N] — [what changed]
- Deferred: Task [N] → 11-change-backlog.md
```

---

## Related Commands

- `/requirements-specs-execute` — Resume task execution after change applied
- `/requirements-revise` — Check alignment after changes
- `/requirements-current` — View updated plan
- `/requirements-status` — Check current phase
