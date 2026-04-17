# End Requirements Gathering

Finalize the current requirement gathering session and archive completed requirements.

---

## Instructions

<end-workflow>
1. Read `requirements/.current-requirement`
2. If no active requirement:
   - Show "No active requirement to end"
   - Exit

3. **Check for active changes** (CRITICAL):
   - Read metadata.json changeManagement section
   - Check if activeChange is not null (change in progress)
   - If active change exists → Block archiving, show:
     ```
     ⚠️ Cannot end requirement: Active change in progress

     Change CR-XXX is currently active (status: [phase]).

     Options:
     1. Complete the change first: /requirements-spec-enhance --resume
     2. Cancel the change: /requirements-spec-enhance --rollback CR-XXX
     3. View change details: /requirements-spec-enhance --show CR-XXX
     ```
   - Exit command (do not proceed)

4. **Check for unresolved bugs** (CRITICAL):
   - Read metadata.json bugs section
   - Count bugs with verified = false
   - If unresolved bugs exist → Show warning with 4 options (see below)
   - Wait for user choice
   - Process choice accordingly

5. Show current status and ask user intent:
   - Display phase, progress, specs status
   - Offer 4 options: Complete & Archive / Mark incomplete / Cancel and delete / Keep active
   - Process user choice

5. **Archive completed requirements** (NEW):
   - If user chooses "Complete & Archive":
     - Create `requirements/archived/` folder if not exists
     - Move requirement folder to `requirements/archived/`
     - Clear `.current-requirement`
     - Update metadata with archive timestamp
</end-workflow>

---

## Unresolved Bugs Check (CRITICAL)

<bug-check>
**If unresolved bugs exist (verified = false):**

```
⚠️ WARNING: Unresolved Bugs Detected

Requirement: [name]
Phase: [phase]

🐛 Bug Status:
- Total Bugs: [X]
- Fixed & Verified: [Y]
- Still In Progress: [Z]

Unresolved Bugs:

Bug #[ID]: [title]
  Status: [analyzing|fix_proposed|fixing|fixed awaiting verification]
  Priority: [priority]
  Component: [component]

[Repeat for each unresolved bug]

Options:
1. Fix bugs first (recommended) - Continue with /requirements-bug-fix
2. Mark as incomplete and close - Bugs tracked but not fixed
3. Force close anyway - Bugs remain unresolved (not recommended)
4. Cancel - Return to current session

Which option?
```

**Process user choice:**
- **Option 1:** Exit, remind user to use `/requirements-bug-fix`
- **Option 2:** Proceed to mark as incomplete (skip option 1 in next step)
- **Option 3:** Show final warning, proceed to completion
- **Option 4:** Exit command, return to session
</bug-check>

---

## Status Display and User Intent

<status-and-intent>
```
⚠️ Ending requirement: [name]
Current phase: [phase] ([X/Y] complete)
Specs generated: [Yes (07-08 exist) / No]
Tasks completed: [X/Y] (if applicable)

What would you like to do?
1. Complete & Archive - Mark as done and move to archived folder
2. Mark as incomplete for later - Keep in requirements/ for resumption
3. Cancel and delete - Remove all files permanently
4. Keep active - Return without changes
```

**Use AskUserQuestion tool** with these 4 options for visual selection.
</status-and-intent>

---

## Option 1: Complete & Archive

<complete-archive>
**Actions:**
1. Validate requirement is ready for archival:
   - Check if 06-requirements-spec.md exists (minimum requirement)
   - If 07-08 exist, check task completion status
   - Warn if tasks are incomplete but allow archival

2. Create archive folder structure:
   ```bash
   # Create archived folder if not exists
   mkdir -p requirements/archived/
   ```

3. Update metadata.json before moving:
   ```json
   {
     "status": "archived",
     "archivedAt": "ISO-8601-timestamp",
     "archivedReason": "completed",
     "finalPhase": "[phase at archival]",
     "completionSummary": {
       "tasksCompleted": X,
       "totalTasks": Y,
       "bugsFixed": Z
     }
   }
   ```

4. Move requirement folder to archived:
   ```bash
   # Move entire requirement folder to archived
   mv requirements/[YYYY-MM-DD-HHMM-feature-slug]/ requirements/archived/
   ```

5. Clear active requirement tracking:
   ```bash
   # Remove current requirement pointer
   rm -f requirements/.current-requirement
   ```

6. Show completion message:

```
✅ Requirement Archived Successfully!

📦 Archived to: requirements/archived/[folder-name]/

📋 Final Summary:
- Phase completed: [phase]
- Files generated: [count]
- Tasks completed: [X/Y] (if applicable)
- Bugs fixed: [Z] (if applicable)

📂 Archived Files:
- 00-initial-request.md
- 01-discovery-questions.md
- 02-discovery-answers.md
- 03-context-findings.md
- 04-detail-questions.md
- 05-detail-answers.md
- 06-requirements-spec.md
[if exists:]
- 07-design.md
- 08-tasks.md
- 09-bug-tracker.md
[if changes were made:]
- 10-change-log.md
- 11-change-backlog.md
- 06-requirements-spec-v*.md (backups)
- 07-design-v*.md (backups)
- 08-tasks-v*.md (backups)

🔍 To view archived requirements:
- /requirements-list --archived
- Read files directly: requirements/archived/[folder-name]/

✨ Ready for next requirement!
- Start new: /requirements-start [feature-description]
```
</complete-archive>

---

## Option 2: Mark Incomplete

<mark-incomplete>
**Actions:**
1. Update metadata status to "incomplete"
2. Add "lastUpdated" timestamp
3. Create summary of progress
4. Note what's still needed
5. Show completion message:

```
⚠️ Requirement marked as incomplete: [name]

Progress saved:
- Phase: [phase]
- Answered: [X] questions
- Files: [list existing files]
- Status: incomplete

Resume later with:
- /requirements-status (continue from checkpoint)
- /requirements-list (view all requirements)
```
</mark-incomplete>

---

## Option 3: Cancel and Delete

<cancel-delete>
**Actions:**
1. Confirm deletion: "Are you sure? This cannot be undone. [Yes/No]"
2. If Yes:
   - Remove requirement folder completely
   - Clear `.current-requirement`
   - Show: "Requirement deleted: [name]"
3. If No:
   - Cancel, return to session
</cancel-delete>

---

## Option 4: Keep Active

<keep-active>
**Actions:**
1. Show current status summary
2. Exit without changes
3. Show message:

```
ℹ️ Requirement kept active: [name]

Current Status:
- Phase: [phase]
- Progress: [X/Y] tasks complete
- Status: active

Continue working with:
- /requirements-specs-execute (execute next task)
- /requirements-revise (check alignment)
- /requirements-status (view details)
```
</keep-active>

---

## Final Spec Format

<final-spec-template>
```markdown
# Requirements Specification: [Name]

Generated: [timestamp]
Status: [Complete with X assumptions / Partial]

## Overview
[Problem statement and solution summary]

## Detailed Requirements

### Functional Requirements
[Based on answered questions - Given-When-Then format]

### Technical Requirements
- Affected files: [list with paths]
- New components: [if any]
- Database changes: [if any]

### Assumptions
[List any defaults used for unanswered questions with "ASSUMED:" prefix]

### Implementation Notes
[Specific guidance for implementation]

### Acceptance Criteria
[Testable criteria for completion]
```
</final-spec-template>

---

## Archive vs Active Decision Guide

<decision-guide>
**When to Archive (Option 1):**
- ✅ All tasks completed and verified
- ✅ Implementation is done and working
- ✅ No further work planned on this requirement
- ✅ Want to clean up active requirements list

**When to Mark Incomplete (Option 2):**
- ⏸️ Need to pause work temporarily
- ⏸️ Blocked by external dependencies
- ⏸️ Switching to higher priority work
- ⏸️ Will resume later

**When to Delete (Option 3):**
- ❌ Requirement was exploratory/experimental
- ❌ Direction changed, work is obsolete
- ❌ Started by mistake

**When to Keep Active (Option 4):**
- 🔄 Still actively working on tasks
- 🔄 Just checking status, not ending
- 🔄 Made a mistake selecting /requirements-end
</decision-guide>

---

## AskUserQuestion Format

<ask-user-format>
When showing end options, use AskUserQuestion tool:

```json
{
  "questions": [
    {
      "question": "How would you like to end this requirement?",
      "header": "End Action",
      "multiSelect": false,
      "options": [
        {
          "label": "Complete & Archive",
          "description": "Mark as done, move to requirements/archived/. Use when all work is finished and verified. Clears active requirement."
        },
        {
          "label": "Mark Incomplete",
          "description": "Pause for later. Keeps files in requirements/ for easy resumption. Use when blocked or switching priorities."
        },
        {
          "label": "Cancel & Delete",
          "description": "Permanently remove all files. Cannot be undone. Use for obsolete or mistaken requirements only."
        },
        {
          "label": "Keep Active",
          "description": "Return without changes. Requirement stays active for continued work. Use if you selected /requirements-end by mistake."
        }
      ]
    }
  ]
}
```
</ask-user-format>

---

## Related Commands

- `/requirements-current` - View full details
- `/requirements-list` - List all requirements (add `--archived` flag to include archived)
- `/requirements-specs-generate` - Generate design & tasks
- `/requirements-specs-execute` - Execute implementation
- `/requirements-spec-enhance` - Request mid-execution changes
- `/requirements-revise` - Check code alignment with requirements
- `/requirements-bug-fix` - Fix issues

---

## Archive Folder Structure

<archive-structure>
After archiving, requirements are stored in:

```
requirements/
├── archived/                           # Completed requirements
│   ├── 2025-11-01-1430-user-auth/     # Archived requirement 1
│   │   ├── 00-initial-request.md
│   │   ├── ...
│   │   ├── 08-tasks.md
│   │   ├── 09-bug-tracker.md          # If bugs were reported
│   │   ├── 10-change-log.md           # If changes were made
│   │   ├── 11-change-backlog.md       # If changes were deferred
│   │   ├── *-v*.md                    # Version backups (if changes made)
│   │   └── metadata.json              # Contains archivedAt timestamp
│   │
│   └── 2025-11-15-0900-payment-flow/  # Archived requirement 2
│       └── ...
│
├── templates/                          # Templates (unchanged)
├── 2025-12-01-1000-current-feature/   # Active requirement
└── .current-requirement                # Points to active only
```

**Benefits of Archive Structure:**
- Clean separation of active vs completed work
- Easy to find past requirements for reference
- Prevents accidental modification of completed work
- Supports `/requirements-list --archived` for historical view
</archive-structure>
