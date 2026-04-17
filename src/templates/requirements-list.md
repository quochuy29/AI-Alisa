# List All Requirements

Display all requirements with their status and summaries.

---

## Instructions

<list-workflow>
1. Check `requirements/.current-requirement` for active requirement
2. List all folders in `requirements/` directory
3. For each requirement folder:
   - Read metadata.json
   - Extract key information
   - Format for display
4. Sort by:
   - Active first (if any)
   - Then by status: complete, incomplete
   - Then by date (newest first)
</list-workflow>

---

## Display Format

<display-format>
```
📚 Requirements Documentation

🔴 ACTIVE: profile-picture-upload
   Phase: Discovery (3/5) | Started: 30m ago
   Next: Q4 about file restrictions
   Specs: Not generated
   Bugs: None reported

✅ COMPLETE:

2025-01-26-0900-dark-mode-toggle
   Status: Ready for implementation | 15 questions answered
   Summary: Full theme system with user preferences
   Specs: ✅ Generated (07-design.md, 08-tasks.md)
   Tasks: 23/35 complete
   Changes: 1 applied (v2)
   Bugs: 2 fixed, 0 active
   Linked PR: #234 (merged)

2025-01-25-1400-export-reports
   Status: Implemented | 22 questions answered
   Summary: PDF/CSV export with filtering
   Specs: ⬜ Not generated
   Bugs: None reported

⚠️ INCOMPLETE:

2025-01-24-1100-notification-system
   Status: Paused at Detail phase (2/8) | Last: 2 days ago
   Summary: Email/push notifications for events
   Specs: Not applicable (incomplete)

📈 Statistics:
- Total: 4 requirements
- Complete: 2 (13 avg questions)
  - With specs: 1 (50%)
  - Tasks executed: 1 (23/35 complete)
- Active: 1
- Incomplete: 1
```
</display-format>

---

## Specs Status Indicators

<specs-indicators>
Read from metadata.json specs section:

- ⬜ **Not generated** - specs.designGenerated = false
- 📝 **Design awaiting approval** - designGenerated = true, designApproved = false (phase: specs_generated)
- ✅ **Specs complete, ready** - tasksGenerated = true, completedTasks = 0 (phase: specs_complete)
- 🔄 **In progress** - completedTasks > 0 but < totalTasks (phase: executing)
- ✔️ **Implemented** - completedTasks = totalTasks (phase: implemented)
- ❌ **Not applicable** - status = incomplete (no 06 yet)

Display format:
```
Specs: ✅ Complete (23/35 tasks done)
Specs: 📝 Design pending approval
Specs: ⬜ Not generated
Specs: 🔄 Executing (15/35 tasks)
Specs: ✔️ Implemented (35/35 tasks)
```
</specs-indicators>

---

## Change Management Indicators

<change-indicators>
Read from metadata.json changeManagement section:

- **No changes** - changeManagement doesn't exist or totalChanges = 0
- **Changes applied** - appliedChanges > 0, activeChange = null
- **Change in progress** - activeChange is not null
- **Changes with deferred** - deferredChanges > 0

Display format:
```
Changes: None
Changes: 2 applied (v2)
Changes: ⚠️ CR-003 in progress
Changes: 3 applied, 1 deferred (v3)
```

Enhanced display with change stats:
```
2025-01-26-0900-ajax-cart-popup
   Status: Implemented | 15 questions answered
   Summary: Ajax cart confirmation popup with modal
   Specs: ✔️ Implemented (47/47 tasks)
   Changes: 2 applied (v2)
     - CR-001: Add mobile support (✅ applied)
     - CR-002: OAuth integration (✅ applied)
   Bugs: None
```

Warning indicator if change in progress:
```
Changes: ⚠️ CR-003 in progress (approval_pending)
```
</change-indicators>

---

## Bug Tracking Indicators

<bug-indicators>
Read from metadata.json bugs section:

- **No bugs** - bugs array empty or doesn't exist
- **Bugs fixed** - All bugs have verified = true
- **Bugs active** - One or more bugs with verified = false
- **Bug fixing** - phase = "bug_fixing"

Display format:
```
Bugs: None reported
Bugs: 3 fixed, 0 active
Bugs: 2 fixed, 1 active (analyzing)
Bugs: 1 fixed, 2 active (1 critical)
Bugs: ⚠️ 1 unresolved critical
Bugs: 🔧 Fixing in progress (Bug #003)
```

Enhanced display with bug stats:
```
2025-01-26-0900-ajax-cart-popup
   Status: Implemented | 15 questions answered
   Summary: Ajax cart confirmation popup with modal
   Specs: ✔️ Implemented (47/47 tasks)
   Bugs: 3 fixed, 1 active
     - Bug #001: Email validation (✅ verified)
     - Bug #002: Modal z-index (✅ verified)
     - Bug #003: Mobile layout (✅ verified)
     - Bug #004: Animation timing (⏳ fix_proposed)
```

Warning indicator if critical bugs exist:
```
Bugs: ⚠️ 1 critical bug active
```
</bug-indicators>

---

## Additional Features

<list-features>
1. **Show linked artifacts:**
   - Development sessions
   - Pull requests
   - Implementation status
   - Specs generation status (07-08 files)
   - Task execution progress (if 08-tasks.md exists)

2. **Highlight stale requirements:**
   - Mark if incomplete > 7 days
   - Suggest resuming or ending
   - Show requirements ready for specs (06 exists, 07-08 don't)

3. **Quick actions:**
   - "View details: /requirements-current"
   - "Resume incomplete: /requirements-status"
   - "Start new: /requirements-start [description]"
   - "Generate specs: /requirements-specs-generate" (if 06 exists but 07-08 don't)
   - "Execute tasks: /requirements-specs-execute" (if 08 exists with pending tasks)
</list-features>

---

## Related Commands

- `/requirements-current` - View active requirement details
- `/requirements-status` - Continue active requirement
- `/requirements-start` - Begin new requirement
- `/requirements-specs-generate` - Generate design & tasks
- `/requirements-specs-execute` - Execute implementation
- `/requirements-spec-enhance` - Request mid-execution changes
- `/requirements-bug-fix` - Fix issues
