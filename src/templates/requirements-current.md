# View Current Requirement

Display detailed information about the active requirement (view-only, doesn't continue).

---

## Instructions

<current-workflow>
1. Read `requirements/.current-requirement`
2. If no active requirement:
   - Show "No active requirement"
   - Display last 3 completed requirements
   - Exit

3. For active requirement:
   - Load ALL files from requirement folder (00-11)
   - Display comprehensive status with codebase overview
   - Show all questions and answers
   - Display context findings if available
   - Indicate current phase and next steps
   - Show specs status if generated (07-08)
   - Show bug tracking if bugs exist (09)
   - Show change management if changes exist (10-11)
</current-workflow>

---

## File Structure

<file-structure>
- 00-initial-request.md - Original user request
- 01-discovery-questions.md - Context discovery questions
- 02-discovery-answers.md - User's answers
- 03-context-findings.md - AI's codebase analysis
- 04-detail-questions.md - Expert requirements questions
- 05-detail-answers.md - User's detailed answers
- 06-requirements-spec.md - Final requirements document
- 07-design.md - Technical design (if generated)
- 08-tasks.md - Implementation tasks (if generated)
- 09-bug-tracker.md - Bug tracking (if bugs reported)
- 10-change-log.md - Change request tracking (if changes made)
- 11-change-backlog.md - Deferred changes (if changes deferred)
- metadata.json - Session state tracking
</file-structure>

---

## Display Format

<display-format>
```
📋 Current Requirement: [name]
⏱️  Duration: [time since start]
📊 Phase: [phase name with description]
🎯 Progress: [metric specific to phase]

📄 Initial Request:
[Content from 00-initial-request.md]

🏗️ Codebase Overview (Phase 1):
- Architecture: [e.g., React + Node.js + PostgreSQL]
- Main components: [identified services/modules]
- Key patterns: [discovered conventions]

✅ Context Discovery Phase (5/5 complete):
Q1: [question] → [answer]
Q2: [question] → [answer]
Q3: [question] → [answer]
Q4: [question] → [answer] (default used)
Q5: [question] → [answer] (default used)

🔍 Targeted Context Findings:
- Files identified: [count] key files
- Similar feature: [name] at [path]
- Integration points: [services]
- Technical constraints: [identified constraints]

🎯 Expert Requirements Phase ([X]/5 answered):
Q1: [question] → [answer]
Q2: [question] → [answer]
Q3: [question] → [PENDING]
...

📝 Next Action:
- Continue: /requirements-status
- End early: /requirements-end
- View rules: /requirements-remind
```
</display-format>

---

## Additional Sections (If Applicable)

### Executable Specifications

<specs-status-display>
**If specs not generated (designGenerated = false):**
```
📐 Executable Specifications: Not yet generated
- Phase: requirements_complete
- Generate with: /requirements-specs-generate
```

**If design generated, awaiting approval (designGenerated = true, designApproved = false):**
```
📐 Design Specification: Generated, awaiting approval
- Phase: specs_generated
- Status: Review 07-design.md and approve
- Action: Continue /requirements-specs-generate to validate
```

**If design approved, tasks generated (designApproved = true, tasksGenerated = true):**
```
📐 Design Specification (07-design.md): ✅ Approved
- Approved at: [timestamp]
- Overview: [brief summary from design]
- Components: [X] components defined
- Diagrams: [X] diagrams included

✅ Implementation Tasks (08-tasks.md):
- Phase: [specs_complete|executing|implemented]
- Progress: [completedTasks]/[totalTasks] tasks complete
- [Task group 1]: [X/Y complete]
- [Task group 2]: [X/Y complete]

Next Actions:
- View design: Read 07-design.md
- View tasks: Read 08-tasks.md
- [If specs_complete] Start execution: /requirements-specs-execute
- [If executing] Continue execution: /requirements-specs-execute
- [If implemented] ✅ All tasks complete!
```
</specs-status-display>

---

### Bug Tracking

<bug-tracking-display>
**If bugs exist (metadata.bugs not empty):**
```
🐛 Bug Tracking:
- Phase: [bug_fixing|executing|implemented]
- Total Bugs: [total]
- Fixed & Verified: [verified]
- In Progress: [inProgress]
- Priority: Critical: [X] | High: [Y] | Medium: [Z] | Low: [W]

Bug Details:

Bug #001: [title]
  Status: ✅ Fixed & Verified ([timestamp])
  Priority: [priority]
  Component: [component]
  Files Modified: [list]
  Related Tasks: Task [X], Task [Y]

Bug #002: [title]
  Status: ⏳ [analyzing|fix_proposed|fixing|fixed] ([current phase])
  Priority: [priority]
  Component: [component]
  Related Tasks: Task [X], Task [Y]

Next Actions:
- [If bug_fixing and unverified] Continue: /requirements-bug-fix
- [If all verified] Report new: /requirements-bug-fix [description]
- View tracker: Read 09-bug-tracker.md
- Return to implementation: /requirements-specs-execute
```

**If no bugs (metadata.bugs empty or doesn't exist):**
```
🐛 Bug Tracking: No bugs reported
- Implementation appears stable
- Report issues: /requirements-bug-fix [bug-description]
```
</bug-tracking-display>

---

### Change Management

<change-management-display>
**If changes exist (metadata.changeManagement.totalChanges > 0):**
```
🔄 Change Management:
- Phase: [change_review|executing|implemented]
- Total Changes: [X] applied, [Y] deferred, [Z] rejected
- Active Change: [CR-XXX (status) | None]
- Version: v[N] (requirements, design, tasks)
- Rollback: [Available to v{N-1} | Not applicable]

Change History:

CR-001: [title]
  Status: ✅ Applied ([timestamp])
  Impact: [X] tasks added, [Y] modified
  Rollback: Available

CR-002: [title]
  Status: ⏳ Deferred ([timestamp])
  Reason: [reason]

CR-003: [title]
  Status: ⚠️ In Progress ([current phase])
  Phase: [intake|analyzing|approval_pending|updating]

Next Actions:
- [If change_review] Continue: /requirements-spec-enhance --resume
- [If no active] Request change: /requirements-spec-enhance [description]
- View log: Read 10-change-log.md
- View backlog: Read 11-change-backlog.md
```

**If no changes (changeManagement doesn't exist or totalChanges = 0):**
```
🔄 Change Management: No changes recorded
- Original specifications in use (v1)
- Request changes: /requirements-spec-enhance [description]
```
</change-management-display>

---

## Important Notes

<view-only-notes>
- **This command is view-only** (doesn't continue gathering)
- Shows complete history and context
- Use `/requirements-status` to continue work
- Use `/requirements-specs-generate` to create implementation specs (if 06 exists)
- Use `/requirements-specs-execute` to execute tasks (if 08 exists)
- Use `/requirements-bug-fix` to report and fix issues (if code exists)
</view-only-notes>

---

## Related Commands

- `/requirements-status` - Continue from checkpoint
- `/requirements-list` - List all requirements
- `/requirements-remind` - Show phase rules
- `/requirements-specs-generate` - Generate design & tasks
- `/requirements-specs-execute` - Execute tasks
- `/requirements-spec-enhance` - Request mid-execution changes
- `/requirements-bug-fix` - Fix issues
- `/requirements-end` - Complete session
