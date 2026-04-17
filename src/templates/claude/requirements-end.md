---
description: Complete and archive current requirement session
allowed-tools: Bash(*), Read(*), Write(*), AskUserQuestion(*), Agent(*)
---

# End Requirements Session

Complete and archive the current requirement session.

---

## Pre-flight Checks

1. Read `requirements/.current-requirement`
2. Read `metadata.json`

   **If `activeBug` is non-null:**

   Use AskUserQuestion tool:
   ```
   AskUserQuestion("⚠️ There is an unresolved bug in progress: [bug-id]. How would you like to proceed?", [
     "Resolve the bug first — run /requirements-bug-fix",
     "Archive anyway — mark session as incomplete",
     "Cancel — keep working"
   ])
   ```
   → "Resolve…" : run `/requirements-bug-fix`
   → "Archive anyway…" : proceed with archive (mark incomplete)
   → "Cancel…" : do nothing, acknowledge

   **If `activeChange` is non-null:**

   Use AskUserQuestion tool:
   ```
   AskUserQuestion("⚠️ There is an unresolved change in progress: [change-id]. How would you like to proceed?", [
     "Resolve the change first — run /requirements-spec-enhance",
     "Archive anyway — mark session as incomplete",
     "Cancel — keep working"
   ])
   ```
   → "Resolve…" : run `/requirements-spec-enhance`
   → "Archive anyway…" : proceed with archive (mark incomplete)
   → "Cancel…" : do nothing, acknowledge

   **If `phase ≠ "implemented"`:**

   Use AskUserQuestion tool:
   ```
   AskUserQuestion("⚠️ Implementation is not complete. Tasks: [X]/[Y] done. How would you like to proceed?", [
     "Archive anyway — some tasks remain (mark incomplete)",
     "Cancel — continue working"
   ])
   ```

---

## Knowledge Harvest (Before Archive)

**[Library Harvest — skip if `requirements/.library/_catalog.json` not found]**

When session `phase = "implemented"` (or archived with meaningful content):

Use Agent tool to invoke `curator` agent with:
```yaml
HARVEST_REQUEST:
  session_folder: "[session-path]"
  session_summary: "[feature-name] — [X] tasks completed"
  artifacts:
    - "06-requirements-spec.md"
    - "07-design.md"
    - "08-tasks.md"
    - "10-change-log.md"
  priority: "standard"
```

Curator will extract reusable knowledge → save to `requirements/.library/`.
Show harvest summary: `📚 Library updated: [N] new entries saved`

If curator unavailable or errors → log warning, continue to archive.

---

## Archive Procedure

1. Update `metadata.json`:
   ```json
   {
     "status": "complete",
     "phase": "implemented",
     "completedAt": "ISO-8601-timestamp"
   }
   ```
2. Move session folder to archive:
   ```bash
   mv requirements/[session-folder]/ requirements/archive/[session-folder]/
   ```
3. Clear `requirements/.current-requirement` (write empty string or delete)
4. Verify archive: confirm folder exists in `requirements/archive/`

## Completion Summary

```
╔══════════════════════════════════════════════════════════════╗
║  Session Archived: [Feature Name]                            ║
╠══════════════════════════════════════════════════════════════╣
║  Duration   : [start] → [end]                                ║
║  Tasks      : [X] / [Y] completed                           ║
║  Bugs fixed : [N] (all verified)                             ║
║  Changes    : [N] applied                                    ║
╚══════════════════════════════════════════════════════════════╝

Files archived:
  requirements/archive/[session-folder]/
  ├── 00-initial-request.md
  ├── 01-04 Questions & Answers
  ├── 06-requirements-spec.md
  ├── 07-design.md
  ├── 08-tasks.md
  ├── 09-bug-tracker.md ([N] bugs)
  ├── 10-change-log.md ([N] changes)
  └── metadata.json (status: complete)

Active session cleared.

🎯 Next: Run /requirements-start to begin a new feature.
```

---

## Error Handling

- **Session not found** → "No active requirement session. Nothing to archive."
- **Archive directory inaccessible** → Show error with `requirements/archive/` path
- **Move command fails** → Show bash command for manual archiving
