---
description: Fix implementation issues with two-step method
allowed-tools: Bash(*), Read(*), Write(*), Edit(*), Grep(*), Glob(*), AskUserQuestion(*)
---

# Requirements Bug Fix

Fix implementation issues discovered after task execution.

**Usage**: `/requirements-bug-fix [bug description]`

> **CRITICAL RULE:** ❌ **NEVER jump straight to fixing.** ✅ **ALWAYS analyze first.**
> (Two-Step Method: Analyze → Approve → Fix)

---

## 🎯 MANDATORY WORKFLOW (STRICTLY ENFORCED)

```
Five Phases — Cannot Skip:
1. Bug Intake       (Interactive: AskUserQuestion tool)
2. Root Cause       (100% Autonomous — NO user interaction)
3. Fix Validation   (Interactive: AskUserQuestion tool)
4. Implementation   (Autonomous: apply approved fix only)
5. Verification     (Interactive: inline result check)
```

**WHY Two-Step Method?**
- ✅ Prevents hasty fixes introducing new bugs
- ✅ Ensures complete understanding before code changes
- ✅ Enables user validation of diagnosis
- ✅ Reduces fix iterations by 40-60%
- ✅ Maintains traceability: bug → task → design → requirement

---

## Prerequisites (STRICTLY REQUIRED)

- Current requirement session with `.current-requirement` file
- Files `06-requirements-spec.md`, `07-design.md`, `08-tasks.md` exist
- Phase = `"executing"` OR `"implemented"` (has code to fix)

---

## Phase 1: Bug Intake (Interactive)

1. Read `requirements/.current-requirement` and `metadata.json`
2. Verify `phase ∈ {"executing", "implemented"}`
3. Get bug description from `$ARGUMENTS` or ask user
4. Generate exactly 5 intake questions — present in **2 batches**:

**Batch 1 (Q1-Q3) — via AskUserQuestion tool:**

```
AskUserQuestion("Q1: What type of issue is this?", [
  "Bug — Existing code behaves unexpectedly",
  "Missing feature — Expected functionality not implemented",
  "Performance — Feature works but is slow/inefficient",
  "Security — Potential vulnerability found"
])

AskUserQuestion("Q2: How reliably does this reproduce?", [
  "Always — Happens every time (100%)",
  "Sometimes — Intermittent (50-80%)",
  "Rarely — Hard to reproduce (<20%)",
  "Unknown — Not yet tested"
])

AskUserQuestion("Q3: What is the severity?", [
  "Critical — Blocks all users, data loss, security breach",
  "High — Major feature broken for most users",
  "Medium — Partially broken, workaround exists",
  "Low — Minor, cosmetic, edge case"
])
```

**Batch 2 (Q4-Q5) — ask via chat (open-ended):**

**Q4: Which component is affected?**
(Reply with the component name from 08-tasks.md completed tasks)

**Q5: What diagnostic information do you have?**
(Reply with: error messages, stack traces, screenshots, or behavior description)

5. Write intake data to `09-bug-tracker.md`
6. Update `metadata.json`: `phase: "bug_fixing"`, add bug entry `status: "analyzing"`

---

## Phase 2: Root Cause Analysis (100% Autonomous — NO user interaction)

**CRITICAL:** Complete analysis silently. NO questions during this phase.

7. Search for affected components:
   - `Bash grep -rn "[affected method/class]" src/`
   - `Grep "[error message key]"` across src/
8. Read implementation code in affected files
9. Trace bug origin:
   - Which task in `08-tasks.md` created the code?
   - Original requirement from `06-requirements-spec.md`
   - Design intent from `07-design.md`
10. Attempt bug reproduction:
    ```bash
    # Run relevant tests or verification commands
    # Check similar patterns in codebase
    ```
11. Structured analysis:
    ```
    <analysis>
    Problem Definition: [What is broken?]
    Evidence: [Files, line numbers, code snippets]
    Hypothesis: [Most likely root cause]
    Validation: [How hypothesis explains observed behavior]
    Classification: [implementation_error | design_gap | requirement_gap]
    Similar patterns: [Other files that may have same issue]
    </analysis>
    ```
12. Search for similar patterns: `Grep "[pattern]"` across codebase
13. Document full analysis in `09-bug-tracker.md`
14. Update metadata: `status: "analyzing"` → `"fix_proposed"`

---

## Phase 3: Fix Strategy Validation (Interactive)

15. Present analysis summary:
```
═══════════════════════════════════════════════════════════════════
Bug Analysis Complete — Bug #[ID]
═══════════════════════════════════════════════════════════════════

ROOT CAUSE     : [Technical explanation]
CLASSIFICATION : [Implementation Error | Design Gap | Requirement Gap]
AFFECTED FILES : [paths:lines]
PROPOSED FIX   : [Strategy + risk assessment]
TRACEABILITY   : [Requirement → Design → Task → Bug]
═══════════════════════════════════════════════════════════════════
```

16. Present validation questions via AskUserQuestion tool:

```
AskUserQuestion("Root Cause: Does the analysis match your understanding?", [
  "Correct — analysis matches my understanding",
  "Partially correct — I'll clarify what's wrong",
  "Wrong — I'll explain the real issue"
])

AskUserQuestion("Fix Strategy: How do you want to proceed?", [
  "Acceptable — apply the proposed fix",
  "Modify — I have a better approach",
  "Too risky — may break other things"
])

AskUserQuestion("Check for similar issues elsewhere in codebase?", [
  "Yes (Recommended) — scan codebase for same pattern",
  "No — fix only this specific instance"
])
```

17. **Wait for user response — MANDATORY**

18. Process responses:
    - All positive → Update `status: "fixing"`, proceed to Phase 4
    - "Partially correct"/"Wrong" on Root Cause → ask clarification, return to Phase 2
    - "Modify"/"Too risky" on Strategy → ask better approach, re-strategize, repeat Phase 3

19. Update `09-bug-tracker.md` with approved strategy

---

## Phase 4: Fix Implementation (Autonomous)

After Phase 3 approval only:

20. Apply code fixes:
    - **Minimal, targeted changes only**
    - Follow exact approved strategy
    - `Read` existing files first, then use `Edit` for targeted changes
    - Add comment: `// Bug #[ID]: [reason for change]`
21. Update related files if needed (config, docs, tests)
22. Update `09-bug-tracker.md`: files modified, exact changes made
23. Update metadata: `status: "fixing"` → `"fixed"`, add `fixedAt` timestamp, `filesModified` array
24. If similar-pattern scan was approved: search and document findings

---

## Phase 5: Fix Verification (Interactive)

**MANDATORY USER TESTING** — Must verify fix works.

25. Show fix completion summary:
```
══════════════════════════════════════════════════════════════
Bug Fix Applied — Bug #[ID] ⏳ Awaiting Your Verification
══════════════════════════════════════════════════════════════

What was fixed : [changes list]
Files modified : [paths]
How to verify  : [specific test steps]
══════════════════════════════════════════════════════════════
```

26. Ask for verification result via AskUserQuestion tool:
```
AskUserQuestion("Please test the fix and report your result:", [
  "Fixed — bug is resolved, working as expected",
  "Partially — better but issues remain (describe remaining issues)",
  "Not fixed — problem still persists (describe what still fails)",
  "New issue — fix introduced a new problem (describe new problem)"
])
```

27. Process result:
    - **"Fixed"** → Update metadata: `verified: true, status: "fixed"` → restore previous phase → show "Bug #[ID] resolved ✅"
    - **"Partially"/"Not fixed"** → Return to Phase 2 with new information, mark `status: "analyzing"`
    - **"New issue"** → Create `bug-002` entry, return to Phase 1 for new bug

28. Update `09-bug-tracker.md` with final verification status

---

## 09-bug-tracker.md Template

```markdown
# Bug Tracker

**Requirement:** [Feature Name]
**Last Updated:** [ISO-8601-timestamp]

---

## Bug #[ID]: [Title]

**Reported:** [timestamp] | **Fixed:** [timestamp] | **Verified:** [timestamp]
**Status:** [✅ Fixed & Verified | ⏳ In Progress | ❌ Failed]
**Priority:** [critical|high|medium|low] | **Component:** [name]

### Description
[User-facing bug description]

### Root Cause Analysis

**Files Affected:**
- `[path:lines]` — [description]

**Root Cause:** [Technical explanation referencing requirements/design]
**Classification:** [Implementation Error | Design Gap | Requirement Gap]

### Fix Implementation

**Strategy:** [Approach with risk assessment]

**Changes Made:**
```[language]
// BEFORE (Bug #[ID])
[old code]

// AFTER (Bug #[ID]: [reason])
[new code]
```

### Verification
- [x] Bug reproduced before fix
- [x] Fix applied to [files]
- [x] Testing passed

### Traceability
- **Requirement:** [FR-X.Y] (06-requirements-spec.md)
- **Design:** [Section] (07-design.md)
- **Task:** Task [N] (08-tasks.md)
```

---

## STRICT RULES (NO EXCEPTIONS)

1. ❌ **NEVER skip Phase 2** — root cause analysis is MANDATORY
2. ❌ **NEVER jump to fixing** — analyze first, ALWAYS
3. ❌ **NEVER proceed Phase 2→4** without Phase 3 approval
4. ✅ **ALWAYS complete Phase 2** autonomously (NO user questions)
5. ✅ **ALWAYS use AskUserQuestion tool** for interactive choices
6. ✅ **ALWAYS update 09-bug-tracker.md** at EVERY phase transition
7. ✅ **ALWAYS update metadata.json** at EVERY phase transition
8. ✅ **ALWAYS maintain traceability** bug → task → design → requirement
9. ✅ **ALWAYS use Read before Edit** for codebase changes
10. ✅ **EXACTLY one bug at a time** — focus and quality

---

## Related Commands

- `/requirements-specs-execute` — Resume implementation after fixes
- `/requirements-status` — Check requirement and bug status
- `/requirements-current` — View full details with bug stats
- `/requirements-end` — Complete session (checks unresolved bugs)
