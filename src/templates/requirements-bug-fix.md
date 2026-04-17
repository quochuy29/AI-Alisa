# Requirements Bug Fix

**CRITICAL RULE:** ❌ **NEVER jump straight to fixing.** ✅ **ALWAYS analyze first.** (Two-Step Method: Analyze → Approve → Fix)

Fix implementation issues discovered after `/requirements-specs-execute`.

**Usage:** `/requirements-bug-fix [bug-description]`

---

## 🎯 MANDATORY WORKFLOW (STRICTLY ENFORCED)

<workflow>
**Five Phases - Cannot Skip**
1. Bug Intake (Interactive: 5 questions via AskUserQuestion, batches 3+2)
2. Root Cause Analysis (100% Autonomous - NO user interaction)
3. Fix Strategy Validation (Interactive: 3 questions via AskUserQuestion)
4. Fix Implementation (Autonomous: Apply approved fix only)
5. Fix Verification (Interactive: AskUserQuestion with 4 options)
</workflow>

**WHY Two-Step Method?** (2025 Research-Backed)
- ✅ Prevents hasty fixes introducing new bugs
- ✅ Ensures complete understanding before code changes
- ✅ Enables user validation of diagnosis
- ✅ Reduces fix iterations by 40-60% (research-proven)
- ✅ Maintains full traceability: bug → task → design → requirement

---

## Prerequisites (STRICTLY REQUIRED)

Must have **exactly all** of:
- Current requirement session with `.current-requirement` file
- Files 06-requirements-spec.md, 07-design.md, 08-tasks.md exist
- Phase = "executing" OR "implemented" (has code to fix)
- Bug relates to implemented code (NOT requirements gathering issues)

---

## Phase 1: Bug Intake (Interactive)

<phase-steps>
1. Auto-discover requirement from `.current-requirement`
2. Verify phase ∈ {"executing", "implemented"}
3. Load context: 06 (requirements) + 07 (design) + 08 (tasks) + metadata.json
4. Get bug description (from $ARGUMENTS or ask user)
5. Generate exactly 5 intake questions with MCP research context:
   - Q1: Bug type (bug/missing feature/performance/security/docs)
   - Q2: Reproducibility (always/sometimes/once/unknown)
   - Q3: Severity (critical/high/medium/low)
   - Q4: Affected component (from 08-tasks.md completed tasks)
   - Q5: Diagnostic info (logs/errors/behavior description)
6. Use AskUserQuestion: Batch 1 (Q1-Q3), Batch 2 (Q4-Q5)
7. Create/append 09-bug-tracker.md with intake data
8. Update metadata.json: phase="bug_fixing", add bug entry with status="analyzing"
</phase-steps>

**Metadata Structure:**
```json
{
  "phase": "bug_fixing",
  "bugs": [{"bugId": "bug-001", "title": "...", "reportedAt": "ISO-8601",
           "status": "analyzing", "priority": "high", "relatedTasks": [5],
           "component": "Component Name"}]
}
```

---

## Phase 2: Root Cause Analysis (100% Autonomous)

**CRITICAL:** NO user interaction in this phase. Complete analysis first.

<analysis-steps>
1. Search codebase (Grep/Read) for affected components
2. Review implementation history:
   - Which task in 08-tasks.md created buggy code
   - Original requirement from 06-requirements-spec.md
   - Design from 07-design.md
   - Understand code INTENT
3. Reproduce bug (if possible): identify exact failure point
4. Analyze root cause using mcp__sequential-thinking:
   - Process thoughts through structured stages (Problem Definition → Analysis → Synthesis)
   - Hypothesis + Evidence + Validation
   - Classify: implementation_error | design_gap | requirement_gap
5. MCP research for similar issues:
   - Prime Search: "[bug-type] common causes best practices"
   - Brave Search: Similar bugs in framework/language
   - Sequential Thinking: Validate hypothesis logic through structured reasoning
6. Document analysis in 09-bug-tracker.md:
   - Root cause (technical)
   - Files affected with line numbers
   - Traceability: task → design → requirement
   - Classification
7. Update metadata: status="analyzing" → "fix_proposed"
</analysis-steps>

**Output:** Complete analysis ready for Phase 3 validation.

---

## Phase 3: Fix Strategy Validation (Interactive)

**MANDATORY USER APPROVAL** - Cannot proceed to fixing without it.

<validation-steps>
1. Present analysis summary:
   ```
   ═══════════════════════════════════════════════════════════
   Bug Analysis Complete - Bug #[ID]
   ═══════════════════════════════════════════════════════════

   ROOT CAUSE: [Technical explanation]
   CLASSIFICATION: [Implementation Error | Design Gap | Requirement Gap]
   AFFECTED FILES: [paths:lines]
   PROPOSED FIX: [Strategy with risk assessment]
   TRACEABILITY: [Requirement → Design → Task links]
   ```

2. Use AskUserQuestion with exactly 3 questions:
   - Q1: "Does root cause match your understanding?" (Yes/Partially/No)
   - Q2: "Is fix strategy acceptable?" (Yes/Modify/Too risky)
   - Q3: "Check for similar issues?" (Yes Recommended/No)

3. Wait for user response (MANDATORY)

4. Process response:
   - All "Yes" → Update status="fixing", proceed to Phase 4
   - "Partially"/"No" on Q1 → Ask clarification, return to Phase 2
   - "Modify"/"Too risky" on Q2 → Ask better approach, re-strategize, repeat validation

5. Update 09-bug-tracker.md with approved strategy
</validation-steps>

---

## Phase 4: Fix Implementation (Autonomous)

After Phase 3 approval only:

<implementation-steps>
1. Apply code fixes using Edit tool:
   - Minimal, targeted changes only
   - Follow exact approved strategy
   - Add comments: `// Bug #[ID]: [reason]`
2. Update related files if needed (config, docs, tests)
3. Update 09-bug-tracker.md: files modified, exact changes, before/after code
4. Update metadata: status="fixing" → "fixed", add fixedAt timestamp, filesModified array
5. If Q3 approved: Search similar patterns, document findings, ask proactive fix (optional)
</implementation-steps>

---

## Phase 5: Fix Verification (Interactive)

**MANDATORY USER TESTING** - Must verify fix works.

<verification-steps>
1. Show fix completion summary:
   ```
   ═══════════════════════════════════════════════════════════
   Bug Fix Applied - Bug #[ID] ⏳ Awaiting Verification
   ═══════════════════════════════════════════════════════════

   What was fixed: [changes list]
   Files modified: [paths]
   How to verify: [test steps]
   Similar issues: [findings]
   ```

2. Use AskUserQuestion with exactly 4 options:
   - "Yes - Bug is fixed" → Mark verified, phase back to previous
   - "Partially - Better but issues remain" → Ask clarification, return Phase 2
   - "No - Problem persists" → Ask details, return Phase 2
   - "New issue appeared" → Create bug-002, optionally revert, return Phase 2

3. Wait for user testing

4. Process result:
   - "Yes" → Update metadata: verified=true, status="fixed", verifiedAt timestamp
           → Revert phase to previous ("executing"/"implemented")
           → Ask: "Any other bugs? [Yes/No]"
   - Others → Loop back to Phase 2 with new information

5. Update 09-bug-tracker.md with final verification status
</verification-steps>

---

## 09-bug-tracker.md Template

<bug-tracker-template>
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

### Reproduction Steps
1. [Step one]
2. [Step two]
3. **Bug**: [What goes wrong]

### Root Cause Analysis

**Files Affected:**
- `[path:lines]` - [description]

**Root Cause:** [Technical explanation referencing requirements/design]

**Classification:** [Implementation Error | Design Gap | Requirement Gap]

**MCP Research:** [Brave/Prime Search findings + Sequential Thinking validation]

### Fix Implementation

**Strategy:** [Approach with risk assessment]

**Changes Made:**
```[language]
// BEFORE (Bug #[ID])
[old code]

// AFTER (Bug #[ID]: [reason])
[new code]
```

**Risk Assessment:** [LOW|MEDIUM|HIGH] - [justification]

### Verification
- [x] Bug reproduced before fix
- [x] Fix applied to [files]
- [x] Manual testing passed ([test case])
- [x] Related functionality tested
- [x] No new issues introduced

**Test Results:**
✅ [test case 1] - PASS
✅ [test case 2] - PASS

### Traceability
- **Requirement:** [FR-X.Y] "[title]" (06-requirements-spec.md:[line])
- **Design:** [Section] § [Subsection] (07-design.md:[line])
- **Task:** Task [N] "[title]" (08-tasks.md:[line])
- **Related Tasks:** Task [M], Task [P]

### Similar Issues Found
[Search results for similar patterns, or "✅ No other occurrences"]

---
```
</bug-tracker-template>

---

## Metadata Tracking

<metadata-schema>
```json
{
  "phase": "bug_fixing",
  "bugs": [
    {
      "bugId": "bug-001",
      "title": "Short description",
      "reportedAt": "ISO-8601",
      "status": "analyzing|fix_proposed|fixing|fixed",
      "priority": "critical|high|medium|low",
      "relatedTasks": [5, 12],
      "component": "Component Name",
      "rootCause": "Technical explanation",
      "classification": "implementation_error|design_gap|requirement_gap",
      "fixedAt": "ISO-8601",
      "verifiedAt": "ISO-8601",
      "filesModified": ["path1", "path2"],
      "verified": true
    }
  ],
  "bugStats": {
    "total": 1,
    "fixed": 1,
    "inProgress": 0,
    "verified": 1,
    "critical": 0,
    "high": 1,
    "medium": 0,
    "low": 0
  }
}
```
</metadata-schema>

**Phase Transitions:**
- `executing|implemented` → `bug_fixing` (when bug reported)
- Bug status progression: `analyzing` → `fix_proposed` → `fixing` → `fixed` → verified=true
- `bug_fixing` → previous phase (when all bugs verified=true)

---

## Command Arguments

```bash
/requirements-bug-fix                                    # Interactive mode
/requirements-bug-fix "Login fails with + in email"     # Quick mode
/requirements-bug-fix --list                             # List all bugs
/requirements-bug-fix --show=bug-001                     # Show specific bug
/requirements-bug-fix --reanalyze=bug-001                # Re-analyze bug
```

---

## Error Handling

<error-messages>
**No Active Requirement:**
❌ No active requirement session. Use /requirements-status or /requirements-list.

**Phase Too Early:**
⚠️ Cannot fix bugs - no implementation exists. Current phase: [phase]. Run /requirements-specs-execute first.

**Missing Files:**
❌ Required files missing: [list]. Run /requirements-specs-generate to create them.
</error-messages>

---

## Integration Points

Other commands handle bug_fixing phase:
- `/requirements-current` - Shows bug stats and status
- `/requirements-status` - Handles bug_fixing phase continuation
- `/requirements-list` - Shows bug indicators per requirement
- `/requirements-end` - Checks for unresolved bugs before closing

See individual command docs for details.

---

## STRICT RULES (NO EXCEPTIONS)

1. ❌ **NEVER skip Phase 2** (root cause analysis is MANDATORY)
2. ❌ **NEVER jump to fixing** (analyze first, ALWAYS)
3. ❌ **NEVER proceed Phase 2→4** without Phase 3 approval
4. ✅ **ALWAYS complete Phase 2** 100% autonomous (NO user questions)
5. ✅ **ALWAYS use AskUserQuestion** for Phases 1, 3, 5 (visual interface)
6. ✅ **ALWAYS update 09-bug-tracker.md** at EVERY phase transition
7. ✅ **ALWAYS update metadata.json** status at EVERY phase transition
8. ✅ **ALWAYS maintain traceability** bug → task → design → requirement
9. ✅ **ALWAYS use MCP research** in Phase 2 (Prime/Brave Search + Sequential Thinking)
10. ✅ **EXACTLY one bug at a time** (focus and quality)

---

## Success Metrics

Track after bug fixes:
- **Resolution Time**: Report → verification duration
- **First-Fix Success**: % fixed on first attempt (target: >80%)
- **Regression Rate**: % fixes introducing new bugs (target: <5%)
- **Requirement Gaps**: % bugs revealing missing requirements
- **Design Gaps**: % bugs revealing design flaws

---

## Related Commands

- `/requirements-specs-execute` - Resume implementation after fixes
- `/requirements-status` - Check requirement and bug status
- `/requirements-current` - View full details with bug stats
- `/requirements-list` - All requirements with bug indicators
- `/requirements-end` - Complete (checks unresolved bugs)

---

## Notes

- Bug fixes are **reactive** (user reports) vs implementation is **proactive**
- Each bug gets unique sequential ID (bug-001, bug-002, etc.)
- 09-bug-tracker.md is **cumulative** (grows with each bug)
- **Two-step method** (analyze → fix) prevents hasty solutions (research-proven)
- Uses **AskUserQuestion** for all interactive validation (visual batch interface)
- **Full traceability** at all times: bug → task → design → requirement
- Supports **multiple bugs** concurrently (each with independent status)
- Can handle **"bug reveals requirement gap"** (updates 06 if needed)
- **MCP tools** provide research-backed solutions (not guesswork)