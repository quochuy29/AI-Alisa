# Check Requirements Status

Show current requirement gathering progress and continue from last checkpoint.

---

## Instructions

<status-workflow>
1. Read `requirements/.current-requirement`
2. If no active requirement:
   - Show: "No active requirement gathering"
   - Suggest: `/requirements-start` or `/requirements-list`
   - Exit

3. If active requirement exists:
   - Read `metadata.json` for phase and progress
   - Determine phase-specific continuation
   - Show formatted status
   - Continue from last checkpoint
</status-workflow>

---

## Status Display Format

<status-display>
```
📋 Active Requirement: [name]
Started: [time ago]
Phase: [current phase name]
Progress: [X/Y] questions answered | [completedTasks/totalTasks] tasks done

[Last 3 answered questions/completed tasks with responses]

Next: [Phase-specific action]
```
</status-display>

---

## Phase-Specific Continuation

### Phase: discovery / detail

<question-phase-continuation>
**Display:**
- Last 3 answered questions
- Next unanswered question with smart default

**Action:**
1. Read next unanswered question from 01/04 questions file
2. Present with default via AskUserQuestion
3. Accept response
4. Update answer file (02/05)
5. Update metadata progress
6. Move to next question or transition phase

**Phase Transitions:**
- Discovery complete (5/5) → Run context gathering → Generate detail questions
- Detail complete (5/5) → Generate 06-requirements-spec.md → Mark complete
</question-phase-continuation>

---

### Phase: requirements_complete

<requirements-complete-status>
```
✅ Requirements Gathering Complete!

📋 Generated Files:
- 00-initial-request.md
- 01-discovery-questions.md
- 02-discovery-answers.md
- 03-context-findings.md
- 04-detail-questions.md
- 05-detail-answers.md
- 06-requirements-spec.md ✨ COMPLETE

🎯 Next Steps:

RECOMMENDED: Start fresh session for better results
- The requirements phase built up significant context
- Fresh session for design/implementation provides:
  ✓ Better focus on technical architecture
  ✓ More accurate task breakdown
  ✓ Cleaner design documentation
  ✓ Reduced context overhead

To generate executable specifications in NEW session:
1. Start new conversation
2. Run: /requirements-specs-generate

---

⚠️ Alternative: Continue this session (not recommended)
If you prefer to continue immediately:
- Type: /requirements-specs-generate

What would you like to do?
```

**Do NOT automatically run /requirements-specs-generate** - Wait for explicit user decision.
</requirements-complete-status>

---

### Phase: specs_generated / specs_complete

<specs-phase-status>
**If specs_generated (design awaiting approval):**
```
📐 Design Specification Generated

Status: Awaiting your approval
File: 07-design.md

You need to validate the design before tasks can be generated.

Continue with: /requirements-specs-generate
(Will show design and ask for approval via AskUserQuestion)
```

**If specs_complete (design approved, tasks ready):**
```
📐 Executable Specifications Ready!

✅ 07-design.md - Technical design (approved)
✅ 08-tasks.md - Implementation tasks ([completedTasks]/[totalTasks] complete)

Next: Continue execution with /requirements-specs-execute
```
</specs-phase-status>

---

### Phase: change_review

<change-review-status>
**CRITICAL:** Must show change review session status prominently.

**Read metadata.json changeManagement section** → Identify active change

**Display:**
```
═══════════════════════════════════════════════════════════
🔄 CHANGE REVIEW SESSION
═══════════════════════════════════════════════════════════

📋 Requirement: [feature-name]
Previous Phase: [executing|implemented]

Current Change: CR-[ID] ([status])
Title: [change title]
Type: [new_feature|modify_existing|remove_feature|expand_scope]
Urgency: [blocking|high|medium|low]

Change Status: [intake|analyzing|approval_pending|updating]

Change Stats:
- Total Changes: [X]
- Applied: [Y]
- Active: CR-[ID]
- Deferred: [Z]

═══════════════════════════════════════════════════════════
```

**Continuation Options Based on Change Status:**

**If status = "intake":**
```
📝 Change intake in progress...

Options:
1. Continue intake (resume /requirements-spec-enhance)
2. View change log (Read 10-change-log.md)
3. Cancel change (start fresh)
```

**If status = "analyzing":**
```
🔍 Impact analysis in progress...

The change is being analyzed for requirements, design, and task impacts.

Options:
1. Continue analysis (resume /requirements-spec-enhance)
2. View change details (Read 10-change-log.md)
```

**If status = "approval_pending":**
```
⏳ Analysis complete. Awaiting approval.

An impact analysis has been prepared and is waiting for your decision.

Options:
1. Continue to approval (resume /requirements-spec-enhance)
2. View impact analysis (Read 10-change-log.md)
```

**If status = "updating":**
```
📝 Specifications being updated...

Options:
1. Continue update (resume /requirements-spec-enhance)
2. View change details (Read 10-change-log.md)
```

**Quick Actions:**
```
→ Continue change: /requirements-spec-enhance --resume
→ View change log: Read 10-change-log.md
→ Cancel change: /requirements-spec-enhance --rollback CR-XXX
→ Return to implementation: (after change complete)
```
</change-review-status>

---

### Phase: executing / implemented

<execution-phase-status>
**Display:**
```
📐 Implementation In Progress

Tasks: [completedTasks]/[totalTasks] complete
Current task: [description of next pending task]

Continue with: /requirements-specs-execute
```

**If all tasks complete:**
```
✅ All Tasks Complete!

Implementation finished: [totalTasks]/[totalTasks] tasks done

Options:
- Report bugs: /requirements-bug-fix [description]
- Complete requirement: /requirements-end
- Review: /requirements-current
```
</execution-phase-status>

---

### Phase: bug_fixing

<bug-fixing-status>
**CRITICAL:** Must show bug fix session status prominently.

**Read metadata.json bugs array** → Identify current bug (status ≠ "verified")

**Display:**
```
═══════════════════════════════════════════════════════════
🐛 BUG FIX SESSION
═══════════════════════════════════════════════════════════

📋 Requirement: [feature-name]
Previous Phase: [executing|implemented]

Current Bug: Bug #[ID] ([status])
Title: [bug title]
Priority: [priority]
Component: [component name]

Bug Status: [analyzing|fix_proposed|fixing|fixed|awaiting verification]

Bug Stats:
- Total Bugs: [X]
- Fixed & Verified: [Y]
- In Progress: [Z]
- Critical: [A] | High: [B] | Medium: [C] | Low: [D]

═══════════════════════════════════════════════════════════
```

**Continuation Options Based on Bug Status:**

**If status = "analyzing":**
```
⚙️ Root cause analysis in progress...

Options:
1. Continue analysis (resume /requirements-bug-fix)
2. View bug tracker (Read 09-bug-tracker.md)
3. Cancel bug fix (return to previous phase)
```

**If status = "fix_proposed":**
```
⏳ Analysis complete. Awaiting fix approval.

A fix strategy has been proposed and is waiting for validation.

Options:
1. Continue to fix validation (resume /requirements-bug-fix)
2. View proposed fix (Read 09-bug-tracker.md)
3. Re-analyze with new information
```

**If status = "fixing":**
```
🔧 Fix is being implemented...

Options:
1. Continue fix implementation (resume /requirements-bug-fix)
2. View fix details (Read 09-bug-tracker.md)
```

**If status = "fixed" and verified = false:**
```
⏳ Fix applied. Awaiting verification.

The bug fix has been implemented and is ready for testing.

Options:
1. Continue to verification (resume /requirements-bug-fix)
2. View fix details (Read 09-bug-tracker.md)
3. Test the fix manually
```

**If all bugs verified:**
```
✅ All bugs fixed and verified!

All reported bugs have been resolved.

Bug Summary:
[List each bug with ✅ Verified status]

Options:
1. Report new bug (/requirements-bug-fix)
2. Return to implementation (/requirements-specs-execute)
3. Complete requirement (/requirements-end)
```

**Quick Actions:**
```
→ Continue bug fix: /requirements-bug-fix
→ View bug tracker: Read 09-bug-tracker.md
→ Return to implementation: /requirements-specs-execute
```
</bug-fixing-status>

---

## Related Commands

- `/requirements-current` - View full session details
- `/requirements-list` - List all requirements
- `/requirements-remind` - Show phase-specific rules
- `/requirements-specs-generate` - Generate design & tasks (after Phase 5)
- `/requirements-specs-execute` - Execute implementation tasks
- `/requirements-spec-enhance` - Request mid-execution changes
- `/requirements-bug-fix` - Fix implementation issues
- `/requirements-end` - Complete requirement session
