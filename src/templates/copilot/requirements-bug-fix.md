# Requirements Bug Fix

Fix implementation issues discovered after task execution.

**Usage**: `#prompt:requirements-bug-fix [bug description]`

> **CRITICAL RULE:** ❌ **NEVER jump straight to fixing.** ✅ **ALWAYS analyze first.**
> (Two-Step Method: Analyze → Approve → Fix)

---

## 🎯 MANDATORY WORKFLOW (STRICTLY ENFORCED)

```
Five Phases — Cannot Skip:
1. Bug Intake       (Interactive: AskQuestion tool)
2. Root Cause       (100% Autonomous — NO user interaction)
3. Fix Validation   (Interactive: AskQuestion tool)
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

---

**[Memory Bank Detection — Cursor — skip if unavailable]**

Attempt `mcp_user_memory_bank_list` (or equivalent read probe):
- If call succeeds → `memoryBankMode = true`
- If call fails/unavailable → `memoryBankMode = false`, continue standard flow

Show in output:
```
Memory Bank: ✓ Available (MCP)    [or]
Memory Bank: ✗ Not available — standard mode
```

---

2. Verify `phase ∈ {"executing", "implemented"}`
3. Get bug description from `$ARGUMENTS` or ask user
4. Generate exactly 5 intake questions — present in **2 batches**:

**Batch 1 (Q1-Q3):**

Use the AskQuestion tool for Batch 1 (Q1-Q3):

```
AskQuestion({
  questions: [
    {
      id: "q1",
      prompt: "Q1: What type of issue is this?",
      options: [
        { id: "a", label: "Bug — Existing code behaves unexpectedly" },
        { id: "b", label: "Missing feature — Expected functionality not implemented" },
        { id: "c", label: "Performance — Feature works but is slow/inefficient" },
        { id: "d", label: "Security — Potential vulnerability found" }
      ]
    },
    {
      id: "q2",
      prompt: "Q2: How reliably does this reproduce?",
      options: [
        { id: "a", label: "Always — Happens every time (100%)" },
        { id: "b", label: "Sometimes — Intermittent (50-80%)" },
        { id: "c", label: "Rarely — Hard to reproduce (<20%)" },
        { id: "d", label: "Unknown — Not yet tested" }
      ]
    },
    {
      id: "q3",
      prompt: "Q3: What is the severity?",
      options: [
        { id: "a", label: "Critical — Blocks all users, data loss, security breach" },
        { id: "b", label: "High — Major feature broken for most users" },
        { id: "c", label: "Medium — Partially broken, workaround exists" },
        { id: "d", label: "Low — Minor, cosmetic, edge case" }
      ]
    }
  ]
})
```

**Batch 2 (Q4-Q5):**

Ask via chat (open-ended questions):

**Q4: Which component is affected?**
(Reply with the component name from 08-tasks.md completed tasks)

**Q5: What diagnostic information do you have?**
(Reply with: error messages, stack traces, screenshots, or behavior description)

5. Write intake data to `09-bug-tracker.md`
6. Update `metadata.json`: `phase: "bug_fixing"`, add bug entry `status: "analyzing"`

---

## Phase 2: Root Cause Analysis (100% Autonomous — NO user interaction)

**CRITICAL:** Complete analysis silently. NO questions during this phase.

7. Semantic search for affected components:
   - `Bash grep -rn "[affected method/class]" src/`
   - `Bash grep -rn "[error message key]" src/`
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
12. Search for similar patterns: `Bash grep -rn "[pattern]" src/`
13. Document full analysis in `09-bug-tracker.md`
14. Update metadata: `status: "analyzing"` → `"fix_proposed"`

---

**[MB Bug Log — Cursor — skip if unavailable]**

When `memoryBankMode = true`:

Extract `{projectName}` from session folder slug. Identify the current task number `T-{NNN}`.

Append bug entry to `{projectName}/develop/T-{NNN}/progress.md` via `mcp_user_memory_bank_write_file` (append mode — include existing content + new entry):
```markdown
## Bug #{ID}: {title}

**Reported**: {timestamp}
**Status**: analyzing
**Root Cause**: {from analysis}
**Classification**: {implementation_error | design_gap | requirement_gap}
**Files Affected**: {paths}
```

If write fails: log warning, continue without blocking.

---

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

16. Present validation questions:

Use the AskQuestion tool:

```
AskQuestion({
  questions: [
    {
      id: "root_cause",
      prompt: "Root Cause: Does the analysis match your understanding?",
      options: [
        { id: "a", label: "Correct — analysis matches my understanding" },
        { id: "b", label: "Partially correct — I'll clarify what's wrong" },
        { id: "c", label: "Wrong — I'll explain the real issue" }
      ]
    },
    {
      id: "fix_strategy",
      prompt: "Fix Strategy: How do you want to proceed?",
      options: [
        { id: "a", label: "Acceptable — apply the proposed fix" },
        { id: "b", label: "Modify — I have a better approach" },
        { id: "c", label: "Too risky — may break other things" }
      ]
    },
    {
      id: "similar_check",
      prompt: "Check for similar issues elsewhere in codebase?",
      options: [
        { id: "a", label: "Yes (Recommended) — scan codebase for same pattern" },
        { id: "b", label: "No — fix only this specific instance" }
      ]
    }
  ]
})
```

17. **Wait for user response — MANDATORY**

18. Process responses:
    - All `A` → Update `status: "fixing"`, proceed to Phase 4
    - `B`/`C` on Root Cause → ask clarification, return to Phase 2
    - `B`/`C` on Strategy → ask better approach, re-strategize, repeat Phase 3

19. Update `09-bug-tracker.md` with approved strategy

---

## Phase 4: Fix Implementation (Autonomous)

After Phase 3 approval only:

20. Apply code fixes:
    - **Minimal, targeted changes only**
    - Follow exact approved strategy
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

26. Ask for verification result:

Use the AskQuestion tool:

```
AskQuestion({
  questions: [{
    id: "verification",
    prompt: "Please test the fix and report your result:",
    options: [
      { id: "a", label: "Fixed — bug is resolved, working as expected" },
      { id: "b", label: "Partially — better but issues remain (describe remaining issues)" },
      { id: "c", label: "Not fixed — problem still persists (describe what still fails)" },
      { id: "d", label: "New issue — fix introduced a new problem (describe new problem)" }
    ]
  }]
})
```

27. Process result:
    - **[A]** → Update metadata: `verified: true, status: "fixed"` → restore previous phase (`"executing"/"implemented"`) → show "Bug #[ID] resolved ✅"
    - **[B]/[C]** → Return to Phase 2 with new information, mark `status: "analyzing"`
    - **[D]** → Create `bug-002` entry, return to Phase 1 for new bug

28. Update `09-bug-tracker.md` with final verification status

---

**[MB Resolved Log — Cursor — skip if unavailable]**

When `memoryBankMode = true` AND bug verified resolved (`[A]`):

Update `{projectName}/develop/T-{NNN}/progress.md` via `mcp_user_memory_bank_write_file` (append mode):
```markdown
## Bug #{ID} Resolution

**Resolved**: {timestamp}
**Status**: ✅ fixed & verified
**Fix**: {brief description of fix applied}
```

If write fails: log warning, continue without blocking.

---

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
5. ✅ **ALWAYS use AskQuestion tool** for interactive choices
6. ✅ **ALWAYS update 09-bug-tracker.md** at EVERY phase transition
7. ✅ **ALWAYS update metadata.json** at EVERY phase transition
8. ✅ **ALWAYS maintain traceability** bug → task → design → requirement
9. ✅ **ALWAYS use Read + Bash** for codebase research
10. ✅ **EXACTLY one bug at a time** — focus and quality

---

## Related Commands

- `#prompt:requirements-specs-execute` — Resume implementation after fixes
- `#prompt:requirements-status` — Check requirement and bug status
- `#prompt:requirements-current` — View full details with bug stats
- `#prompt:requirements-end` — Complete session (checks unresolved bugs)
