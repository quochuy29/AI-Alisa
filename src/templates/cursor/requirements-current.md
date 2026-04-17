# View Current Requirement

View the full details of the active requirement session.

---

## Instructions

1. Read `requirements/.current-requirement` → get active session path
2. If no active session → show "No active session. Use /requirements-start to begin."
3. Read `metadata.json` → get phase, status, progress, specs

---

**[Memory Bank Detection — Cursor — skip if unavailable]**

Attempt `mcp_user_memory_bank_list` (or equivalent read probe):
- If call succeeds → `memoryBankMode = true`
- If call fails/unavailable → `memoryBankMode = false`, skip MB section

**[MB Context Enrichment — Cursor — skip if unavailable]**

When `memoryBankMode = true`:

Extract `{projectName}` from session folder slug.

Attempt to read `{projectName}/activeContext.md` via `mcp_user_memory_bank_read_file`:
- If exists → append a `🧠 Memory Bank` section to the output:
  ```
  🧠 Memory Bank Status:
  ├── Project: {projectName}
  ├── Active Context: ✓ Found
  ├── Last Action: {lastAction}
  └── Current Focus: {currentFocus}
  ```
- If not exists → show `🧠 Memory Bank: ✓ Available (no context written yet)`

---
4. For each file that exists, show a summary:
   - `00` → first 3 lines (initial request snippet)
   - `01` / `04` → question count
   - `02` / `05` → answer count
   - `03` → key findings summary (file count, patterns found)
   - `06` → FR count, TR count, AC count
   - `07` → design section count (if exists)
   - `08` → task completion status per phase (if exists)
   - `09` → bug count by status (if exists)
   - `10` → change count (if exists)
5. Display file listing with sizes

---

## Output Format

```
╔══════════════════════════════════════════════════════════════════╗
║  Current Requirement: [Feature Name]                             ║
╠══════════════════════════════════════════════════════════════════╣
║  Phase: [phase]   Status: [status]   Updated: [time ago]        ║
║  Session: requirements/[folder]/                                 ║
╚══════════════════════════════════════════════════════════════════╝

📄 Session Files:
  ✅ 00-initial-request.md     "[first line snippet...]"
  ✅ 01-discovery-questions.md (5 questions)
  ✅ 02-discovery-answers.md   (5 answers)
  ✅ 03-context-findings.md    ([N] files analyzed, [N] patterns)
  ✅ 04-detail-questions.md    (5 questions)
  ✅ 05-detail-answers.md      (5 answers)
  ✅ 06-requirements-spec.md   ([N] FRs, [N] TRs, [N] ACs)
  ✅ 07-design.md              ([N] sections, [approved/pending])
  ✅ 08-tasks.md               [[X]/[Y] done]
  ⚠️ 09-bug-tracker.md         ([N] active, [N] resolved)
  ✅ 10-change-log.md          ([N] changes applied)
  ⬜ 11-change-backlog.md      (no deferred changes)
  ✅ metadata.json             (phase: [phase])

📊 Task Progress: [[X]/[Y]] ([percent]%)
  Phase 1 Foundation  [████████░░] [a]/[b]
  Phase 2 Services    [████░░░░░░] [c]/[d]
  Phase 3 API         [░░░░░░░░░░] [e]/[f]
  Phase 4 UI          [░░░░░░░░░░] [g]/[h]
  Phase 5 Testing     [░░░░░░░░░░] [i]/[j]

🐛 Bugs: [N] total ([N] active, [N] resolved, [N] verified)
🔄 Changes: [N] applied, [N] deferred

Next suggested action: [based on phase]
```

---

## File Status Legend

- `✅` — File exists with content
- `⬜` — File doesn't exist yet (expected at this phase)
- `⚠️` — File exists with active items requiring attention

---

## Related Commands

- `/requirements-status` — Quick progress dashboard
- `/requirements-remind` — Show phase-specific rules
- `/requirements-list` — All requirement sessions
