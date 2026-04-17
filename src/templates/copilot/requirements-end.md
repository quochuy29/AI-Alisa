# End Requirements Session

Complete and archive the current requirement session.

---

## Pre-flight Checks

1. Read `requirements/.current-requirement`
2. Read `metadata.json`

3. Read `metadata.json`:

   **If `activeBug` is non-null:**

   Use the AskQuestion tool:
   ```
   AskQuestion({
     questions: [{
       id: "bug_block",
       prompt: "⚠️ There is an unresolved bug in progress: [bug-id]. How would you like to proceed?",
       options: [
         { id: "a", label: "Resolve the bug first — run #prompt:requirements-bug-fix" },
         { id: "b", label: "Archive anyway — mark session as incomplete" },
         { id: "c", label: "Cancel — keep working" }
       ]
     }]
   })
   ```
   → `"a"` : run `#prompt:requirements-bug-fix`
   → `"b"` : proceed with archive (mark incomplete)
   → `"c"` : do nothing, acknowledge

   **If `activeChange` is non-null:**

   Use the AskQuestion tool:
   ```
   AskQuestion({
     questions: [{
       id: "change_block",
       prompt: "⚠️ There is an unresolved change in progress: [change-id]. How would you like to proceed?",
       options: [
         { id: "a", label: "Resolve the change first — run #prompt:requirements-spec-enhance" },
         { id: "b", label: "Archive anyway — mark session as incomplete" },
         { id: "c", label: "Cancel — keep working" }
       ]
     }]
   })
   ```
   → `"a"` : run `#prompt:requirements-spec-enhance`
   → `"b"` : proceed with archive (mark incomplete)
   → `"c"` : do nothing, acknowledge

   **If `phase ≠ "implemented"`:**

   Use the AskQuestion tool:
   ```
   AskQuestion({
     questions: [{
       id: "incomplete_phase",
       prompt: "⚠️ Implementation is not complete. Tasks: [X]/[Y] done. How would you like to proceed?",
       options: [
         { id: "a", label: "Archive anyway — some tasks remain (mark incomplete)" },
         { id: "b", label: "Cancel — continue working" }
       ]
     }]
   })
   ```

---

## Knowledge Harvest (Before Archive)

---

**[Library Harvest — skip if `skills/library-ops.md` not found]**

When session `phase = "implemented"` (or archived with meaningful content):

Follow `skills/library-ops.md` (Harvest operation) — invoke `agents/curator.md` with:
```yaml
HARVEST_REQUEST:
  session_folder: "[session-path]"
  session_summary: "[feature-name] — [X] tasks completed"
  artifacts:
    - "06-requirements-spec.md"
    - "07-design.md"
    - "08-tasks.md"
    - "10-change-log.md"
  priority: "standard"   # or "high" if session had architectural decisions
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

🎯 Next: Run #prompt:requirements-start to begin a new feature.
```

---

## Error Handling

- **Session not found** → "No active requirement session. Nothing to archive."
- **Archive directory inaccessible** → Show error with `requirements/archive/` path
- **Move command fails** → Show bash command for manual archiving
