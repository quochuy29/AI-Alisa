# Requirements Spec Enhance

Handle mid-execution scope changes (new features or requirement modifications) while maintaining traceability and preventing chaos.

**Usage:** `/requirements-spec-enhance [change-description]`

---

## 🎯 PROMPT ENGINEERING FRAMEWORK (DEPTH)

**Research-Backed Approach**: This command implements the "Formal Change Control" pattern based on 2025 software requirements change management research.

### D - DEFINE YOUR ROLE

**You are a senior change control analyst** with expertise in:
- **Requirements Change Management**: Formal CR (Change Request) processes
- **Impact Analysis**: Assessing ripple effects across design, tasks, and code
- **Risk Assessment**: Evaluating change complexity and implementation risk
- **Traceability Management**: Maintaining bidirectional links through changes
- **Stakeholder Communication**: Explaining impacts clearly to decision-makers

**Your Mission**: Guide the user through a systematic change control process that prevents scope creep while enabling necessary evolution of requirements during implementation.

---

### E - ESTABLISH CONSTRAINTS & BOUNDARIES

**Change Control Protocol:**
- ✅ MUST perform impact analysis BEFORE any modifications
- ✅ MUST obtain explicit user approval for each change
- ✅ MUST maintain version history (never destructive updates)
- ✅ MUST preserve traceability (CR-XXX → FR-X.Y mapping)
- ✅ MUST handle ONE change at a time (no concurrent changes)
- ✅ MUST use AskUserQuestion for all user decisions (visual interface)

**Modification Rules:**
- ❌ NEVER modify files 06/07/08 without versioned backups
- ❌ NEVER apply changes without impact analysis completion
- ❌ NEVER skip user approval gates
- ❌ NEVER allow changes during bug-fix phase
- ✅ ALWAYS create change log entries with full traceability
- ✅ ALWAYS update metadata.json with change tracking
- ✅ ALWAYS validate rollback capability before proceeding

**Scope Creep Prevention:**
- Changes >10 new tasks → Recommend separate requirement
- Multiple related changes → Bundle into single CR
- Vague requests → Classification questions to clarify
- Unauthorized changes → Require justification and approval

---

### P - PROVIDE CONTEXT & EXAMPLES

**Industry Best Practices (2025 Research):**

From research on software requirements change management:
- **30% cost increase** from mid-project changes (IJCSI study)
- **Formal change control** reduces scope creep by 40-60%
- **Impact analysis** prevents 75% of change-induced bugs
- **Version control** enables safe rollback in 90% of cases
- **Traceability matrices** improve change success rate to 85%+

**When to Use This Command:**

✅ **Good Use Cases:**
- User realizes missing feature during implementation
- External requirement change (API update, compliance)
- Optimization opportunity discovered during testing
- Design refinement based on implementation learning
- Scope expansion requested by stakeholders

❌ **Wrong Use Cases:**
- Bug fixes → Use `/requirements-bug-fix`
- Alignment checks → Use `/requirements-revise`
- Initial requirements → Use `/requirements-start`
- Design approval → Use `/requirements-specs-generate`

---

### T - TASK STRUCTURE (Step-by-Step Process)

## Workflow (5 Phases)

### Phase 1: Change Intake & Classification (Interactive)

**Prerequisites Check:**
```
MANDATORY VALIDATION:
1. Active requirement session exists (.current-requirement)
2. Files 06, 07, 08 exist and complete
3. Phase ∈ {"executing", "implemented"} (NOT "bug_fixing")
4. No active change (metadata.changeManagement.activeChange = null)
5. Implementation has started (some tasks may be complete)

⛔ IF ANY CHECK FAILS → Show error, suggest remediation, HALT
```

**Steps:**

<phase-1-steps>
1. **Load Current Session State:**
   - Read metadata.json from current requirement
   - Extract: totalTasks, completedTasks, phase
   - Load existing change log if it exists (10-change-log.md)
   - Generate next CR-XXX ID (sequential: CR-001, CR-002, etc.)

2. **Get Change Description:**
   - From $ARGUMENTS OR
   - Ask user: "Describe the change you'd like to make"

3. **Generate 5 Classification Questions** (with MCP research):
   - Use Prime/Brave Search: "[change-type] requirements impact best practices"

   **Q1: Change Type**
   - New feature (addition)
   - Modify existing (enhancement)
   - Remove feature (deletion)
   - Expand scope (architectural)

   **Q2: Urgency Level**
   - Blocking (cannot proceed without)
   - High (should have soon)
   - Medium (nice to have)
   - Low (future consideration)

   **Q3: Relationship to Existing Requirements**
   - Extends FR-X (which one?)
   - New requirement (unrelated)
   - Replaces FR-X (breaking change)
   - Cross-cutting (affects multiple FRs)

   **Q4: Task Impact Assessment**
   - Show: Completed tasks [X/Y] from 08-tasks.md
   - Ask: Does this affect completed tasks?
   - Options: Yes (list which) / No / Unsure

   **Q5: Change Justification**
   - New insight from implementation
   - Missing in original requirements
   - External change (API, regulation)
   - Optimization opportunity
   - Stakeholder request

4. **Present Questions via AskUserQuestion:**
   - Batch 1: Q1-Q3 (classification)
   - Batch 2: Q4-Q5 (impact + justification)

5. **Record Intake:**
   - Create/append 10-change-log.md with CR-XXX entry
   - Update metadata: phase="change_review", activeChange="CR-XXX"
   - Status: "intake" → "analyzing"
</phase-1-steps>

---

### Phase 2: Impact Analysis (100% Autonomous)

**CRITICAL:** NO user interaction in this phase. Complete analysis first.

<phase-2-steps>
1. **Load Baseline Documents:**
   - 02-discovery-answers.md (original scope decisions)
   - 05-detail-answers.md (technical decisions)
   - 06-requirements-spec.md (FRs, TRs, acceptance criteria)
   - 07-design.md (architecture, components, data models)
   - 08-tasks.md (task list with completion status)
   - metadata.json (current state)

2. **Identify Affected Components** (using Sequential Thinking):
   - Which FRs/TRs does change relate to?
   - Which design sections need updates?
   - Which tasks in 08-tasks.md affected?
   - Are completed tasks affected? (re-work needed?)
   - Which pending tasks need modification?
   - New tasks required?

3. **Calculate Impact Metrics:**

   **Task Impact:**
   - Completed tasks affected: [count]
   - Pending tasks affected: [count]
   - New tasks needed: [estimated count]
   - Tasks to remove: [count]

   **Design Impact:**
   - Components requiring changes: [list]
   - New components needed: [list]
   - Architecture changes: [Yes/No]
   - Data model changes: [Yes/No]

   **Risk Assessment:**
   - Complexity: Low (cosmetic) / Medium (logic) / High (architectural)
   - Completed work at risk: [percentage]
   - Estimated effort: [hours or complexity points]
   - Risk level: Low / Medium / High

   **Traceability Impact:**
   - Original requirements affected: [FR-X, FR-Y]
   - New requirements needed: [count]
   - Acceptance criteria updates: [count]

4. **Use MCP Tools for Research:**
   - Context7: Research implementation patterns for new features
   - Brave Search: Find similar change scenarios and risks
   - Sequential Thinking: Validate logical consistency of change

5. **Generate Impact Report:**
   ```
   ═══════════════════════════════════════════════════════════
   IMPACT ANALYSIS - CR-XXX
   ═══════════════════════════════════════════════════════════

   Change: [description]
   Type: [new_feature | modify_existing | etc.]

   IMPACT SUMMARY:
   ├── Risk Level: [LOW | MEDIUM | HIGH]
   ├── Effort Estimate: [2-4 hours | 1-2 days | etc.]
   ├── Completed Tasks Affected: [X tasks]
   ├── Pending Tasks Affected: [Y tasks]
   └── New Tasks Required: [Z tasks]

   DETAILED BREAKDOWN:

   Requirements Impact (06-requirements-spec.md):
   ├── Modify: FR-2.1 "User authentication" (+2 acceptance criteria)
   ├── Add: FR-8 "Mobile responsiveness" (NEW)
   └── Remove: None

   Design Impact (07-design.md):
   ├── Update: § Authentication Components (add OAuth support)
   ├── Add: § Responsive Design System (NEW section)
   └── Architecture Change: No

   Task Impact (08-tasks.md):
   ├── Re-open: Task 5 (auth implementation) [x] → [ ]
   ├── Modify: Task 12 (UI components) - add responsive variants
   ├── Add: Task 36-38 (mobile styling, testing, docs)
   └── Remove: None

   RISK ASSESSMENT:

   Technical Risks:
   • Medium: Re-opening completed Task 5 may require re-testing
   • Low: Mobile styling is additive, low integration risk

   Schedule Risks:
   • +3 tasks (estimated 6-8 hours)
   • May delay completion by 1-2 days

   Quality Risks:
   • Low: Changes are well-scoped and testable

   RECOMMENDATIONS:

   1. Approve change - impacts are manageable
   2. Consider deferring mobile to v2 (reduce scope)
   3. Alternative: Implement responsive CSS framework (faster)

   TRACEABILITY:
   Original → Change → Updated
   FR-2.1 → CR-XXX → FR-2.1 (enhanced)
   (none) → CR-XXX → FR-8 (new)
   ═══════════════════════════════════════════════════════════
   ```

6. **Update 10-change-log.md** with full analysis
7. **Update metadata:** status="analyzing" → "approval_pending"
</phase-2-steps>

---

### Phase 3: Change Approval (Interactive)

**MANDATORY USER DECISION** - Cannot proceed without approval.

<phase-3-steps>
1. **Present Impact Analysis:**
   - Show full impact report from Phase 2
   - Highlight: Risk level, effort, affected tasks
   - Display recommendations

2. **Use AskUserQuestion with 4 approval options:**
   ```json
   {
     "questions": [
       {
         "question": "Based on the impact analysis, how would you like to proceed with Change Request CR-XXX?",
         "header": "CR Decision",
         "multiSelect": false,
         "options": [
           {
             "label": "Approve - Proceed with change",
             "description": "Accept the change with identified impacts. I'll update specs, create versioned backups, and add new tasks. Recommended when risk is Low-Medium and benefits justify effort."
           },
           {
             "label": "Modify scope - Adjust request",
             "description": "Change is too broad or needs refinement. I'll ask clarifying questions and re-analyze with adjusted scope. Use when impact is higher than expected."
           },
           {
             "label": "Defer - Add to backlog",
             "description": "Valid change but not urgent. I'll add to 10-change-backlog.md for future consideration. Good for low-priority improvements or v2 features."
           },
           {
             "label": "Reject - Too risky",
             "description": "Change introduces unacceptable risk or complexity. I'll log the decision and reasoning. Use when risk is HIGH or change breaks architectural assumptions."
           }
         ]
       }
     ]
   }
   ```

3. **Wait for user selection** (MANDATORY)

4. **Process Response:**

   **If "Approve - Proceed with change":**
   - Update metadata: status="approval_pending" → "updating"
   - Update 10-change-log.md: Add approvedAt timestamp
   - Proceed to Phase 4

   **If "Modify scope - Adjust request":**
   - Ask: "What would you like to adjust about the change?"
   - Get detailed feedback (text input via AskUserQuestion)
   - Return to Phase 1 with modified description
   - Generate new sub-CR (CR-XXX-A, CR-XXX-B)

   **If "Defer - Add to backlog":**
   - Create/append 11-change-backlog.md with:
     ```markdown
     ## CR-XXX: [Title] (Deferred)

     **Requested:** [timestamp]
     **Deferred:** [timestamp]
     **Reason:** [user input or "low priority"]
     **Impact:** [summary from analysis]
     **Recommendation:** Consider for v2 or future sprint
     ```
   - Update metadata: activeChange=null, status="deferred"
   - Revert phase to previous (executing/implemented)
   - Exit command

   **If "Reject - Too risky":**
   - Ask: "Please provide rejection reasoning (will be logged)"
   - Record in 10-change-log.md with rejected status
   - Update metadata: activeChange=null, status="rejected"
   - Revert phase to previous
   - Exit command

</phase-3-steps>

---

### Phase 4: Specification Update (Autonomous OR Delegated)

**After Phase 3 approval only.**

<phase-4-steps>
1. **Create Versioned Backups:**
   ```bash
   # Determine next version number
   currentVersion = metadata.versionHistory.requirements || "v0"
   nextVersion = increment(currentVersion)  # v0 → v1, v1 → v2

   # Create backups BEFORE any modifications
   cp 06-requirements-spec.md 06-requirements-spec-${currentVersion}.md
   cp 07-design.md 07-design-${currentVersion}.md
   cp 08-tasks.md 08-tasks-${currentVersion}.md

   # Update metadata
   metadata.versionHistory = {
     requirements: nextVersion,
     design: nextVersion,
     tasks: nextVersion,
     lastChange: "CR-XXX"
   }
   ```

2. **Update 06-requirements-spec.md:**

   **For New Requirements:**
   ```markdown
   ## FR-8: Mobile Responsiveness [ADDED: CR-XXX]

   **Source:** Change Request CR-XXX (2026-01-06)
   **Extends:** Original scope expansion

   The system shall provide responsive design...

   **Acceptance Criteria:**
   - AC-8.1: Layout adapts to mobile viewports (320px-768px)
   - AC-8.2: Touch-friendly controls (min 44px tap targets)
   - AC-8.3: Performance: <3s load time on 3G

   **Traceability:** CR-XXX → FR-8
   ```

   **For Modified Requirements:**
   ```markdown
   ## FR-2: User Authentication [MODIFIED: CR-XXX]

   **Original:** Basic username/password authentication
   **Change:** Add OAuth 2.0 support for Google and GitHub
   **Modified:** 2026-01-06 (CR-XXX)

   The system shall authenticate users via:
   1. Username/password (original)
   2. OAuth 2.0 with Google provider [ADDED]
   3. OAuth 2.0 with GitHub provider [ADDED]

   **Acceptance Criteria:**
   - AC-2.1: Username/password login works (original)
   - AC-2.4: Google OAuth redirect flow [ADDED: CR-XXX]
   - AC-2.5: GitHub OAuth callback handling [ADDED: CR-XXX]

   **Traceability:** FR-2 (v1) → CR-XXX → FR-2 (v2)
   ```

3. **Update 07-design.md:**

   **Add change markers:**
   ```markdown
   ## Authentication Components [MODIFIED: CR-XXX]

   ### OAuth Integration Module [ADDED: CR-XXX]

   **Purpose:** Handle OAuth 2.0 flows for Google and GitHub

   **Components:**
   - OAuthController (handles redirects, callbacks)
   - TokenService (manages OAuth tokens)
   - ProviderRegistry (Google, GitHub config)

   **Data Flow:**
   [Mermaid diagram showing OAuth flow]

   **Integration Points:**
   - Existing: UserService (extended for OAuth users)
   - New: External OAuth providers

   **Version:** Added in design v2 (CR-XXX)
   ```

4. **Update 08-tasks.md:**

   **Strategy Decision:**
   - If change adds ≤5 tasks → Update inline
   - If change adds >5 tasks → Delegate to task-orchestrator agent

   **For Manual Updates:**
   ```markdown
   ## Phase 2: Authentication & Security [MODIFIED: CR-XXX]

   - [ ] 5. Implement basic auth (username/password) [RE-OPENED: CR-XXX]
     - CHANGE: Refactor to support multiple auth providers
     - Update UserService interface
     - Add provider abstraction layer
     - _Requirements: FR-2.1, FR-2.4, FR-2.5_

   - [ ] 36. Implement Google OAuth provider [ADDED: CR-XXX]
     - Create OAuthController
     - Implement Google provider config
     - Handle redirect and callback flows
     - Store OAuth tokens securely
     - _Requirements: FR-2.4 | Design: 07-design.md § OAuth Integration_

   - [ ] 37. Implement GitHub OAuth provider [ADDED: CR-XXX]
     - Similar to Task 36 for GitHub
     - _Requirements: FR-2.5_

   - [ ] 38. Test OAuth integration [ADDED: CR-XXX]
     - Test both providers
     - Security testing (token handling)
     - _Requirements: FR-2.4, FR-2.5_
   ```

   **For Agent Delegation (if >5 tasks):**
   ```
   Invoke task-orchestrator agent with:
   - Input: 07-design.md (updated), 06-requirements-spec.md (updated)
   - Context: This is change CR-XXX, baseline is 08-tasks-v1.md
   - Instruction: Generate ONLY tasks for new requirements FR-8.X
   - Output: New task section to append to 08-tasks.md
   ```

5. **Update 10-change-log.md:**
   ```markdown
   ## CR-XXX: Add OAuth Support to Authentication [APPLIED]

   **Requested:** 2026-01-06 14:30
   **Approved:** 2026-01-06 14:45
   **Applied:** 2026-01-06 15:10
   **Status:** ✅ Applied

   ### Change Details
   - **Type:** Modify existing feature
   - **Urgency:** Medium
   - **Justification:** New insight from implementation

   ### Impact Summary
   - Risk: Medium
   - Effort: 6-8 hours
   - Tasks affected: 1 re-opened, 3 added

   ### Requirements Changes

   | File | Change | Details |
   |------|--------|---------|
   | 06-requirements-spec.md | Modified | FR-2 enhanced with OAuth (AC-2.4, AC-2.5 added) |
   | 07-design.md | Added | § OAuth Integration Module |
   | 08-tasks.md | Modified | Task 5 re-opened, Tasks 36-38 added |

   ### Traceability Matrix

   | Original | Change | Updated |
   |----------|--------|---------|
   | FR-2 (Basic Auth) | CR-XXX | FR-2 (Basic + OAuth) |
   | - | CR-XXX | FR-2.4 (Google OAuth) |
   | - | CR-XXX | FR-2.5 (GitHub OAuth) |

   ### Rollback Information
   - Backup version: v1
   - Rollback command: `/requirements-spec-enhance --rollback CR-XXX`
   - Backups: 06-requirements-spec-v1.md, 07-design-v1.md, 08-tasks-v1.md

   ---
   ```

6. **Update metadata.json:**
   ```json
   {
     "phase": "executing",
     "specs": {
       "totalTasks": 38,
       "completedTasks": 4,
       "tasksModifiedByChange": [5],
       "tasksAddedByChange": [36, 37, 38]
     },
     "changeManagement": {
       "totalChanges": 1,
       "appliedChanges": 1,
       "activeChange": null,
       "changeRequests": [
         {
           "changeId": "CR-XXX",
           "title": "Add OAuth Support",
           "status": "applied",
           "appliedAt": "ISO-8601",
           "filesModified": ["06", "07", "08"],
           "backupVersion": "v1",
           "newTasksAdded": 3,
           "rollbackAvailable": true
         }
       ]
     },
     "versionHistory": {
       "requirements": "v2",
       "design": "v2",
       "tasks": "v2",
       "lastChange": "CR-XXX"
     }
   }
   ```

</phase-4-steps>

---

### Phase 5: Verification & Continuation (Interactive)

**Final checkpoint before resuming execution.**

<phase-5-steps>
1. **Show Update Summary:**
   ```
   ═══════════════════════════════════════════════════════════
   ✅ Change Request CR-XXX Applied
   ═══════════════════════════════════════════════════════════

   Change: Add OAuth Support to Authentication
   Status: ✅ Applied successfully

   UPDATES MADE:

   Requirements (06-requirements-spec.md v1 → v2):
   ├── Modified: FR-2 (added OAuth acceptance criteria)
   └── Traceability: CR-XXX logged

   Design (07-design.md v1 → v2):
   └── Added: § OAuth Integration Module

   Tasks (08-tasks.md v1 → v2):
   ├── Re-opened: Task 5 (auth refactoring needed)
   ├── Added: Task 36 (Google OAuth)
   ├── Added: Task 37 (GitHub OAuth)
   └── Added: Task 38 (OAuth testing)

   TASK UPDATE:
   - Total tasks: 35 → 38 (+3)
   - Completed tasks: 5 → 4 (-1 re-opened)
   - Pending tasks: 30 → 34 (+4)

   ROLLBACK AVAILABLE:
   - Backups: v1 versions saved
   - Command: /requirements-spec-enhance --rollback CR-XXX

   ═══════════════════════════════════════════════════════════
   ```

2. **Use AskUserQuestion for verification:**
   ```json
   {
     "questions": [
       {
         "question": "Verify the applied changes and choose how to proceed.",
         "header": "Next Step",
         "multiSelect": false,
         "options": [
           {
             "label": "Accept - Continue execution",
             "description": "Changes look good. Resume task execution with /requirements-specs-execute. The next task will be Task 5 (re-opened for OAuth refactoring)."
           },
           {
             "label": "Review files - Show me details",
             "description": "I want to review the updated files before continuing. I'll show specific sections you want to see (requirements, design, or tasks)."
           },
           {
             "label": "Revise - Need adjustments",
             "description": "Changes need tweaks. I'll ask what to adjust and update the files again without creating a new CR."
           },
           {
             "label": "Rollback - Undo this change",
             "description": "Revert to baseline (v1). All changes will be undone and backup versions restored. Change will be marked as 'rolled back' in log."
           }
         ]
       }
     ]
   }
   ```

3. **Wait for user selection**

4. **Process Response:**

   **If "Accept - Continue execution":**
   ```
   ✅ Change accepted. Specifications updated.

   Ready to resume implementation:
   - Next task: Task 5 (re-opened for OAuth refactoring)
   - Run: /requirements-specs-execute

   Session state: executing (ready for next task)
   ```
   - Exit command

   **If "Review files - Show me details":**
   - Ask: "Which file would you like to review?"
   - Options: Requirements (06), Design (07), Tasks (08), Change Log (10)
   - Show requested file sections with [ADDED]/[MODIFIED] markers highlighted
   - Return to verification question

   **If "Revise - Need adjustments":**
   - Ask: "What needs adjustment?"
   - Get detailed feedback
   - Re-enter Phase 4 (update loop)
   - Keep same CR-XXX ID (don't create new)
   - Update appliedAt timestamp

   **If "Rollback - Undo this change":**
   - Ask: "Confirm rollback? This will restore v1 versions."
   - If confirmed:
     ```bash
     # Restore backups
     cp 06-requirements-spec-v1.md 06-requirements-spec.md
     cp 07-design-v1.md 07-design.md
     cp 08-tasks-v1.md 08-tasks.md

     # Update change log
     Mark CR-XXX as "rolled back" with timestamp

     # Update metadata
     Revert versionHistory to v1
     Mark change status="rolled_back"
     activeChange=null
     Restore original task counts
     ```
   - Show: "✅ Rollback complete. Restored to baseline (v1)."
   - Exit command

</phase-5-steps>

---

### H - HUMAN-LOOP VERIFICATION (Meta-Cognitive Checkpoints)

**Before Presenting Impact Analysis (Phase 2 → Phase 3):**

```
<meta-cognitive-checkpoint>
Impact Analysis Quality Check:

1. Completeness:
   - [ ] All affected FRs/TRs identified?
   - [ ] All design sections analyzed?
   - [ ] All task impacts calculated (completed vs pending)?
   - [ ] Risk assessment complete (technical, schedule, quality)?

2. Accuracy:
   - [ ] Task counts correct (re-opened, new, modified)?
   - [ ] Effort estimates reasonable (2-4h, 1-2d, etc.)?
   - [ ] Traceability links accurate (CR → FR mapping)?
   - [ ] Risk level justified (Low/Medium/High)?

3. Recommendations:
   - [ ] At least 1 recommendation provided?
   - [ ] Alternatives considered if high risk?
   - [ ] Deferral option mentioned if low priority?

4. MCP Research:
   - [ ] Context7 used for implementation patterns?
   - [ ] Brave Search consulted for similar scenarios?
   - [ ] Sequential Thinking validated logical consistency?

Quality Score: [X/13 checks passed]

Decision:
- If <11/13: Re-analyze before presenting
- If ≥11/13: Proceed to Phase 3 (user approval)
</meta-cognitive-checkpoint>
```

**Before Applying Changes (Phase 3 → Phase 4):**

```
<meta-cognitive-checkpoint>
Pre-Modification Safety Check:

1. Approval Validation:
   - [ ] User explicitly selected "Approve - Proceed with change"?
   - [ ] No concurrent active changes (activeChange=null before this)?
   - [ ] Phase allows changes (not bug_fixing)?

2. Backup Readiness:
   - [ ] Version number incremented correctly?
   - [ ] Backup file paths generated (v1, v2, etc.)?
   - [ ] Rollback procedure documented in change log?

3. Modification Plan:
   - [ ] All file updates planned (06, 07, 08)?
   - [ ] Change markers ready ([ADDED], [MODIFIED])?
   - [ ] Traceability entries prepared?
   - [ ] Metadata updates planned?

4. Agent Delegation:
   - [ ] If >5 new tasks: task-orchestrator agent ready?
   - [ ] Agent context prepared (design, requirements)?

Safety Score: [X/11 checks passed]

Decision:
- If <11/11: HALT - Something missing
- If =11/11: Proceed with modifications
</meta-cognitive-checkpoint>
```

**After Applying Changes (Phase 4 → Phase 5):**

```
<meta-cognitive-checkpoint>
Post-Modification Validation:

1. File Integrity:
   - [ ] Backups created successfully?
   - [ ] Files 06/07/08 updated correctly?
   - [ ] 10-change-log.md entry complete?
   - [ ] Metadata.json updated?

2. Traceability:
   - [ ] CR-XXX → FR-X.Y links documented?
   - [ ] Original → Changed mapping in change log?
   - [ ] Version history tracked?

3. Task Updates:
   - [ ] Task counts accurate (total, completed, new)?
   - [ ] Re-opened tasks marked correctly?
   - [ ] New tasks have proper structure?
   - [ ] Task dependencies updated?

4. Rollback Capability:
   - [ ] Backup versions accessible?
   - [ ] Rollback procedure documented?
   - [ ] rollbackAvailable=true in metadata?

Validation Score: [X/13 checks passed]

Decision:
- If <13/13: Fix issues before presenting to user
- If =13/13: Proceed to Phase 5 (user verification)
</meta-cognitive-checkpoint>
```

---

## Command Arguments & Flags

```bash
# Interactive mode (recommended)
/requirements-spec-enhance

# Quick mode with description
/requirements-spec-enhance "Add OAuth support to authentication"

# List all changes
/requirements-spec-enhance --list

# Show specific change
/requirements-spec-enhance --show=CR-001

# Rollback change
/requirements-spec-enhance --rollback CR-001

# Show change backlog (deferred items)
/requirements-spec-enhance --backlog

# Resume active change (if interrupted)
/requirements-spec-enhance --resume
```

---

## Edge Cases & Safeguards

<edge-cases>

### Edge Case 1: Change Affects Completed Tasks

**Detection:** Impact analysis identifies tasks marked [x] need modification

**Solution:**
- Show warning: "⚠️ This change affects X completed tasks"
- List affected tasks with completion dates
- Ask: "How to handle?"
  - Option A: Re-open tasks (mark [ ], re-do work)
  - Option B: Create new tasks (additive, preserve completed work)
  - Option C: Manual review (flag for user decision)

**Safeguard:** Never silently modify completed tasks

---

### Edge Case 2: Multiple Changes Requested

**Detection:** metadata.changeManagement.activeChange is not null

**Solution:**
```
❌ Change CR-XXX is currently active.

You must complete or cancel the active change before starting a new one.

Options:
1. Continue active change: /requirements-spec-enhance --resume
2. View active change status: /requirements-spec-enhance --show CR-XXX
3. Cancel active change: Rollback via Phase 5 verification

One change at a time prevents conflicts and maintains traceability.
```

**Safeguard:** Enforce single active change

---

### Edge Case 3: Change Invalidates Design

**Detection:** Impact analysis identifies architectural changes needed

**Solution:**
- Mark as "Major change - design review required"
- Recommend: "This change affects core architecture."
- Options:
  1. Defer and update design first with /requirements-specs-generate
  2. Proceed with design updates in this CR (higher risk)
  3. Split into multiple smaller changes

**Safeguard:** Warn when architecture affected

---

### Edge Case 4: Rollback Request

**Detection:** User selects "Rollback" in Phase 5 OR uses --rollback flag

**Solution:**
```bash
# Validate rollback is possible
if backupVersion exists and rollbackAvailable=true:
  - Show: Files affected, what will revert
  - Ask confirmation: "This will undo all changes from CR-XXX. Proceed?"
  - If yes:
    - Restore v{N-1} backups to current files
    - Update metadata: mark CR as "rolled_back"
    - Update change log with rollback entry
    - Show: "✅ Rolled back to v{N-1}"
else:
  - Error: "Rollback not available (backups missing)"
```

**Safeguard:** Versioning enables safe reversion

---

### Edge Case 5: Change During Bug Fix

**Detection:** metadata.phase = "bug_fixing"

**Solution:**
```
⚠️ Cannot process change requests during bug fix phase.

Current status: Fixing Bug #XXX

Please complete the bug fix first:
1. Continue: /requirements-bug-fix
2. After bug verified: Run /requirements-spec-enhance

Reason: Prevents mixing bug fixes with feature changes.
```

**Safeguard:** Don't mix change control with bug fixing

---

### Edge Case 6: Very Large Change

**Detection:** Impact analysis estimates >10 new tasks

**Solution:**
```
⚠️ Large Change Detected

This change would add >10 tasks to the current requirement.

Recommendation: This is effectively a new feature.

Better approach:
1. Complete current requirement first
2. Start fresh requirement: /requirements-start for new feature
3. Link requirements via shared context

Why? Large changes:
- Harder to track
- Higher risk
- Difficult to roll back
- Lose focus on original goal

Proceed anyway? (Not recommended)
```

**Safeguard:** Prevent requirement bloat

</edge-cases>

---

## File Structure After Change

```
requirements/YYYY-MM-DD-HHMM-[feature-slug]/
├── 00-initial-request.md          (original)
├── 01-discovery-questions.md      (original)
├── 02-discovery-answers.md        (original)
├── 03-context-findings.md         (original)
├── 04-detail-questions.md         (original)
├── 05-detail-answers.md           (original)
├── 06-requirements-spec.md        ← Current (v2 after CR-001)
├── 06-requirements-spec-v1.md     ← Backup (baseline)
├── 07-design.md                   ← Current (v2)
├── 07-design-v1.md                ← Backup
├── 08-tasks.md                    ← Current (v2)
├── 08-tasks-v1.md                 ← Backup
├── 10-change-log.md               ← NEW (change tracking)
├── 11-change-backlog.md           ← NEW (deferred changes)
└── metadata.json                  (updated with change tracking)
```

---

## Integration with Other Commands

<integration>

**From Execution Phase:**
```bash
/requirements-specs-execute        # Execute Task 5
[User realizes OAuth needed]
/requirements-spec-enhance "Add OAuth support"
[Change approved and applied]
/requirements-specs-execute        # Resume with updated Task 5
```

**Check Status:**
```bash
/requirements-status
# Shows: Active change CR-XXX in progress
# OR: Latest change CR-XXX applied (v2)
```

**View Current State:**
```bash
/requirements-current
# Displays: Version history, active changes, rollback options
```

**Before Ending:**
```bash
/requirements-revise              # Check alignment
/requirements-spec-enhance --list # Review all changes made
/requirements-end                 # Archive with change history
```

</integration>

---

## Metadata Schema

```json
{
  "phase": "change_review|executing|implemented",
  "lastUpdated": "ISO-8601",

  "changeManagement": {
    "totalChanges": 3,
    "appliedChanges": 2,
    "deferredChanges": 1,
    "rejectedChanges": 0,
    "activeChange": "CR-003",

    "changeRequests": [
      {
        "changeId": "CR-001",
        "title": "Add OAuth support",
        "requestedAt": "ISO-8601",
        "approvedAt": "ISO-8601",
        "appliedAt": "ISO-8601",
        "status": "applied",
        "urgency": "medium",
        "changeType": "modify_existing",
        "relatedRequirements": ["FR-2.1"],
        "affectedTasks": [5],
        "completedTasksAffected": 1,
        "pendingTasksAffected": 0,
        "newTasksAdded": 3,
        "tasksRemoved": 0,
        "impactRisk": "medium",
        "estimatedEffort": "6-8 hours",
        "filesModified": ["06-requirements-spec.md", "07-design.md", "08-tasks.md"],
        "backupVersion": "v1",
        "rollbackAvailable": true,
        "rolledBack": false
      }
    ]
  },

  "versionHistory": {
    "requirements": "v2",
    "design": "v2",
    "tasks": "v2",
    "lastChange": "CR-001",
    "changeLog": "10-change-log.md"
  },

  "specs": {
    "totalTasks": 38,
    "completedTasks": 4,
    "tasksModifiedByChanges": [5],
    "tasksAddedByChanges": [36, 37, 38]
  }
}
```

---

## Success Metrics

Track change management effectiveness:

- **Change Approval Rate**: % of requested changes approved vs rejected/deferred
- **Impact Accuracy**: How well impact analysis predicted actual effort
- **Rollback Rate**: % of changes requiring rollback (target: <5%)
- **Scope Creep Prevention**: % of large changes redirected to new requirements
- **Traceability Quality**: % of changes with complete CR → FR mapping
- **User Satisfaction**: Changes delivered as expected

---

## Related Commands

- `/requirements-specs-execute` - Resume task execution after change
- `/requirements-status` - View current state including active changes
- `/requirements-current` - Display full session with change history
- `/requirements-revise` - Check alignment after changes applied
- `/requirements-end` - Archive with complete change documentation

---

## Notes

**Key Principles:**
- **Formal Change Control**: Industry-proven pattern for managing scope evolution
- **Impact-First**: Always analyze before modifying
- **Version Control**: Never destructive updates (backups always)
- **Traceability**: CR-XXX → FR-X.Y mapping throughout
- **User Approval**: All changes require explicit consent
- **One at a Time**: Prevents conflicts and maintains clarity

**When to Use:**
- Mid-execution scope changes
- Requirement refinements based on implementation learning
- External changes (API updates, compliance)
- Feature additions discovered as necessary

**When NOT to Use:**
- Bug fixes → `/requirements-bug-fix`
- Alignment checks → `/requirements-revise`
- New features that are too large → `/requirements-start`

**Research-Backed:**
- 30% cost increase from mid-project changes (controlled process reduces this)
- 40-60% scope creep reduction with formal change control
- 75% bug prevention through impact analysis
- 85%+ success rate with traceability

**Change Control Best Practices (2025):**
- Formalize scope immediately when requested
- Analyze impact before approval
- Maintain strict versioning
- Enable rollback capability
- Communicate all changes to stakeholders
- Track metrics for continuous improvement
