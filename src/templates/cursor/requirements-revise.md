---
description: Check alignment between implementation and requirements
allowed-tools: Bash(*), Read(*), AskQuestion(*)
---

# Requirements Alignment Check

Check alignment between the current implementation and requirements/design specifications.
Detect drift early and recommend corrective actions.

---

## Instructions

1. Read `requirements/.current-requirement`
2. Load `06-requirements-spec.md` and `07-design.md`

---

**[Memory Bank Detection — Cursor — skip if unavailable]**

Attempt `mcp_user_memory_bank_list` (or equivalent read probe):
- If call succeeds → `memoryBankMode = true`
- If call fails/unavailable → `memoryBankMode = false`, continue standard flow

**[MB Context Load — Cursor — skip if unavailable]**

When `memoryBankMode = true`:

Extract `{projectName}` from session folder slug.

Attempt to read `{projectName}/activeContext.md` via `mcp_user_memory_bank_read_file`:
- If exists → append to alignment context with label: `🧠 Memory Bank — Active Context`
- If not exists → skip silently

---

3. Identify all implementation changes:
   - Read `10-change-log.md` for files modified per task
   - Run `Bash git diff HEAD` or `Bash git log --oneline` (if git available)
   - Cross-reference with completed tasks in `08-tasks.md`
4. Run alignment checks (Section 3)
5. Detect drift (Section 4)
6. Generate alignment report (Section 5)

---

## Alignment Checks

| Check | What to Verify |
|-------|----------------|
| **FR Coverage** | Is every Functional Requirement implemented? |
| **TR Compliance** | Do technical specifications match implementation? |
| **AC Satisfaction** | Does code pass all acceptance criteria? |
| **Design Adherence** | Does code follow the approved `07-design.md`? |
| **Scope Creep** | Are there features not in requirements? |
| **Convention Compliance** | Does code follow `CURSOR.md`/`CLAUDE.md` patterns? |
| **Documentation Sync** | Are docs/comments in sync with code behavior? |

---

## Drift Categories

| Category | Description | Severity |
|----------|-------------|----------|
| **Requirements Drift** | Implementation diverges from spec | High |
| **Design Drift** | Code uses different approach than `07-design.md` | Medium |
| **Documentation Drift** | Docs/comments out of sync with code | Low |
| **Scope Drift** | Unauthorized features added (scope creep) | Medium |
| **Convention Drift** | Code style deviates from established patterns | Low |

---

## Alignment Report Format

```
╔════════════════════════════════════════════════════════════╗
║  Alignment Report — [Feature Name]                         ║
╠════════════════════════════════════════════════════════════╣
║  Compliance: [X]% ([N]/[M] requirements covered)          ║
╚════════════════════════════════════════════════════════════╝

FR Coverage:
  ✅ FR-1.1 — implemented | AC-1.1 satisfied
  ✅ FR-1.2 — implemented | AC-1.2 satisfied
  ⚠️ FR-2.1 — partial    | AC-2.1 missing edge case in [file:line]
  ❌ FR-3.1 — not yet implemented

TR Compliance:
  ✅ TR-1 Performance ≤200ms — measured: ~145ms
  ✅ TR-2 JWT authentication — implemented in [file]
  ⚠️ TR-3 Audit logging — logging exists but missing user-id field

Design Adherence:
  ✅ UserService pattern — matches 07-design.md § 3.1
  ✅ Database schema — matches data model spec
  ⚠️ AuthMiddleware — uses Singleton but design spec says Factory pattern

Drift Detected:
  🟠 Design Drift   : UserService uses Singleton (design spec: Factory)
                      → File: src/services/UserService.ts:45
  🟡 Scope Drift    : Extra debug logging added in UserController
                      → Not harmful but not in requirements
  🟢 Doc Drift      : UserService.createUser() missing JSDoc
                      → src/services/UserService.ts:78

Required Actions:
  1. [Fix FR-2.1 edge case — missing input validation in [file]]
  2. [Implement FR-3.1 — add to 08-tasks.md or mark deferred]
  3. [Align UserService with Factory pattern per 07-design.md § 3.1]
  4. [Add audit user-id to logging (TR-3)]
```

---

---

**[MB Alignment Write-Back — Cursor — skip if unavailable]**

When `memoryBankMode = true`:

Update `{projectName}/activeContext.md` via `mcp_user_memory_bank_write_file`:
```markdown
# Active Context — {projectName}

**Last Updated**: {timestamp}
**Current Focus**: Alignment check complete
**Last Action**: Ran requirements-revise — {overall compliance}%

## Drift Findings
{drift detected entries from report above, or "None detected"}

## Required Actions
{required actions from report above, or "None"}
```

If write fails: log warning, continue without blocking.

---

## Action Recommendations

After showing report, present options using the AskQuestion tool:
```
AskQuestion({
  questions: [{
    id: "after_alignment",
    prompt: "Alignment check complete. What would you like to do?",
    options: [
      { id: "a", label: "🐛 Fix drift as bugs — /requirements-bug-fix" },
      { id: "b", label: "🔄 Add missing items as tasks — /requirements-spec-enhance" },
      { id: "c", label: "⚙️ Continue with next task — /requirements-specs-execute" },
      { id: "d", label: "✅ Looks good — archive session" }
    ]
  }]
})
```
→ `"a"` : `/requirements-bug-fix`
→ `"b"` : `/requirements-spec-enhance`
→ `"c"` : `/requirements-specs-execute`
→ `"d"` : `/requirements-end`

---

## Automated Drift Detection Heuristics

When reviewing code, flag these automatically:

### Design Pattern Drift
- Class named differently than spec
- Different pattern (Singleton vs Factory, Repository vs Active Record)
- Missing layers (no service layer when design specifies one)

### Requirement Coverage Gaps
- FRs with no corresponding implementation file
- ACs with no test coverage
- TRs with no measurable verification

### Convention Violations
- Files not in directories specified by `CURSOR.md`/`CLAUDE.md`
- Naming conventions not followed
- Missing error handling where spec requires it

---

## Related Commands

- `/requirements-bug-fix` — Fix identified drift as bugs
- `/requirements-spec-enhance` — Add missing items as scope change
- `/requirements-specs-execute` — Continue implementation
- `/requirements-code-review` — Full eight-pillar quality review
