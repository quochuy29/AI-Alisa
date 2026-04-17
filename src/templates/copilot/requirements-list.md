# List All Requirements

List all requirement sessions with status indicators and progress summaries.

---

## Instructions

1. Run `Bash ls requirements/` to get all entries
2. Filter for directories matching the timestamp pattern: `YYYY-MM-DD-HHMM-*`
3. Check `requirements/archive/` for completed sessions
4. For each session folder:
   - Read `metadata.json` to get phase, status, task counts, timestamps
5. Read `requirements/.current-requirement` to identify active session
6. Sort by `lastUpdated` (newest first)
7. Display formatted list

---

## Display Format

```
📚 All Requirement Sessions
══════════════════════════════════════════════════════════════

ACTIVE
● 2025-11-10-1430-user-auth
  Phase: executing | Tasks: 7/15 done | Updated: 2h ago
  → Current active session

PENDING
○ 2025-11-09-0900-payment-gateway
  Phase: requirements_complete | Updated: 1d ago
  → Ready for: #prompt:requirements-specs-generate

○ 2025-11-08-1600-export-reports
  Phase: design_approved | Updated: 2d ago
  → Approved design, tasks pending. Fresh session → #prompt:requirements-specs-generate

COMPLETE / ARCHIVED
✓ 2025-11-05-1030-user-profile
  Phase: implemented | Tasks: 22/22 done | Updated: 5d ago
  → Archived: requirements/archive/2025-11-05-1030-user-profile/

──────────────────────────────────────────────────────────────
Total: 4 sessions (1 active, 2 pending, 1 archived)
```

---

## Status Indicators

| Symbol | Status | Description |
|--------|--------|-------------|
| `●` | **ACTIVE** | Current session (`.current-requirement` pointer) |
| `○` | **PENDING** | Requirements captured, awaiting next phase |
| `⚠` | **BLOCKED** | Active bug or change request in progress |
| `✓` | **COMPLETE** | All tasks done or archived |
| `✗` | **INCOMPLETE** | Archived but not all tasks completed |

---

## Phase Label Mapping

| `metadata.phase` | Display Label |
|-----------------|---------------|
| `discovery` | "Gathering discovery answers" |
| `context` | "Analyzing codebase" |
| `detail` | "Gathering expert answers" |
| `requirements_complete` | "Ready for specs generation" |
| `specs_generated` | "Design awaiting approval" |
| `design_approved` | "Approved design, tasks pending" |
| `specs_complete` | "Ready for task execution" |
| `executing` | "Tasks in progress" |
| `implemented` | "All tasks complete" |
| `bug_fixing` | "Bug fix in progress" |
| `change_review` | "Change request in progress" |

---

## Related Commands

- `#prompt:requirements-status` — Detailed status of active session
- `#prompt:requirements-current` — Full details of active session
- `#prompt:requirements-start [feature]` — Begin a new session
