# Requirements Revise - Alignment Check

Check if current code changes align with established requirements, design, and implementation blueprints.

---

## Purpose

When implementations run long, code changes may drift from the original design. This command performs **bidirectional traceability analysis** to:
- Verify code changes match the approved design (07-design.md)
- Ensure implementations follow established patterns (03-context-findings.md)
- Confirm scope remains within user decisions (02/05 answers)
- Validate requirements are being satisfied (06-requirements-spec.md)
- Track task completion against plan (08-tasks.md)

---

## Usage

```bash
/requirements-revise
```

**Best used when:**
- Implementation has been ongoing for multiple sessions
- Significant code changes have accumulated
- Before marking a task as complete
- When unsure if changes follow the original design
- After making changes outside the task execution workflow

---

## Your Role: Alignment Analyst

**You are a senior technical reviewer** with expertise in:
- **Requirements Traceability**: Mapping code to requirements bidirectionally
- **Design Compliance**: Verifying implementations match architectural specs
- **Pattern Recognition**: Identifying deviations from established conventions
- **Scope Management**: Detecting feature creep and scope drift

**Your Mission**: Analyze current code changes against the requirement documents and provide an alignment assessment with actionable recommendations.

---

## Workflow

### Phase 1: Change Detection

<change-detection>
**Gather current git state:**

```bash
# Get all changed files (staged + unstaged)
git status --porcelain

# Get detailed diff of all changes
git diff HEAD

# Get staged changes specifically
git diff --cached

# Get list of changed files with stats
git diff HEAD --stat

# Get files changed since requirement started (if tracking commit)
git log --oneline --since="[requirement-start-date]"
```

**Parse changes into categories:**
- **New files**: Files created during implementation
- **Modified files**: Existing files with changes
- **Deleted files**: Files removed
- **Renamed files**: Files moved or renamed

**Extract change details:**
- File paths and types (component, service, test, config, etc.)
- Lines added/removed per file
- Function/class names affected
- Import changes
</change-detection>

---

### Phase 2: Context Loading

<context-loading>
**Load all requirement documents:**

1. **02-discovery-answers.md** - User's scope decisions
   - Extract: UI requirements, security needs, integration scope
   - Key questions: Visual interface? Mobile? Sensitive data?

2. **03-context-findings.md** - Codebase patterns to follow
   - Extract: Existing patterns, file structures, naming conventions
   - Key info: Similar features, integration points, technical constraints

3. **05-detail-answers.md** - Technical decisions
   - Extract: Service choices, validation patterns, database decisions
   - Key info: User's architectural preferences

4. **06-requirements-spec.md** - Formal requirements
   - Extract: FRs (Functional Requirements) with acceptance criteria
   - Extract: TRs (Technical Requirements)
   - Key info: What must be implemented and how to verify

5. **07-design.md** - Architecture blueprint
   - Extract: Components, data models, API contracts
   - Extract: Architecture diagrams, integration points
   - Key info: How things should be built

6. **08-tasks.md** - Implementation checklist
   - Extract: Task list with completion status
   - Extract: Task-to-requirement mapping
   - Key info: What's done, what's pending
</context-loading>

---

### Phase 3: Alignment Analysis

<alignment-analysis>
**Use Chain of Thought reasoning:**

```
<thinking>
CHANGE ANALYSIS:
- Files changed: [list from Phase 1]
- Total additions: [X] lines
- Total deletions: [Y] lines
- Change categories: [components, services, tests, etc.]

TASK COVERAGE CHECK:
For each changed file:
- Is this file mentioned in 08-tasks.md?
- Which task does this change belong to?
- Is the task marked complete or in progress?
- Are there changes NOT mapped to any task? (potential scope drift)

DESIGN COMPLIANCE CHECK:
For each significant change:
- Does file location match 07-design.md component structure?
- Do data models match schema in design?
- Do API endpoints match contracts in design?
- Are algorithms implemented as specified?

PATTERN ALIGNMENT CHECK:
For coding patterns used:
- Do they match patterns from 03-context-findings.md?
- Are naming conventions followed?
- Is the code structure consistent with existing codebase?

SCOPE INTEGRITY CHECK:
Based on 02/05 answers:
- If UI=NO, are there UI components being created?
- If Security=YES, are encryption/auth patterns present?
- Are external integrations within declared scope?

REQUIREMENT SATISFACTION CHECK:
For each FR in 06-requirements-spec.md:
- Is there code that addresses this requirement?
- Do changes satisfy acceptance criteria?
- Are there gaps in implementation?
</thinking>
```

**Calculate Alignment Scores:**

| Category | Weight | Score Calculation |
|----------|--------|-------------------|
| Task Coverage | 25% | % of changes mapped to tasks |
| Design Compliance | 30% | % of changes following design spec |
| Pattern Alignment | 20% | % of code following established patterns |
| Scope Integrity | 15% | 100% if within scope, -20% per drift |
| Requirement Satisfaction | 10% | % of relevant FRs addressed |

**Overall Score = Weighted average of all categories**
</alignment-analysis>

---

### Phase 4: Report Generation

<report-generation>
**Generate Alignment Report:**

```
═══════════════════════════════════════════════════════════════
📊 REQUIREMENTS ALIGNMENT REPORT
═══════════════════════════════════════════════════════════════

Requirement: [name from metadata]
Analysis Date: [timestamp]
Changes Analyzed: [X files, Y lines added, Z lines removed]

───────────────────────────────────────────────────────────────
ALIGNMENT SCORE: [XX]%
───────────────────────────────────────────────────────────────

Score Breakdown:
├── Task Coverage:      [XX]% ([X/Y] changes mapped to tasks)
├── Design Compliance:  [XX]% ([X/Y] changes follow design)
├── Pattern Alignment:  [XX]% ([X/Y] patterns match codebase)
├── Scope Integrity:    [XX]% ([X] drift warnings)
└── Requirement Coverage: [XX]% ([X/Y] FRs addressed)

───────────────────────────────────────────────────────────────
✅ ALIGNED CHANGES ([count])
───────────────────────────────────────────────────────────────

[For each aligned change:]
• [file-path]
  ├── Task: Task [N] - [task description]
  ├── Design: 07-design.md § [section]
  └── Requirements: FR-[X], TR-[Y]

───────────────────────────────────────────────────────────────
⚠️ POTENTIAL DRIFT ([count])
───────────────────────────────────────────────────────────────

[For each drift warning:]
• [file-path]
  ├── Issue: [description of drift]
  ├── Expected: [what design/requirements say]
  ├── Actual: [what code does]
  └── Recommendation: [how to fix]

───────────────────────────────────────────────────────────────
❌ VIOLATIONS ([count])
───────────────────────────────────────────────────────────────

[For each violation:]
• [file-path]
  ├── Violation Type: [scope/design/pattern/requirement]
  ├── Details: [specific violation]
  ├── Reference: [document and section violated]
  └── Action Required: [specific fix needed]

───────────────────────────────────────────────────────────────
📋 UNMAPPED CHANGES ([count])
───────────────────────────────────────────────────────────────

[Changes not linked to any task - potential scope creep:]
• [file-path] - [brief description of change]
  └── Suggestion: [Add to task X / Create new task / Remove]

───────────────────────────────────────────────────────────────
💡 RECOMMENDATIONS
───────────────────────────────────────────────────────────────

Priority Actions:
1. [Most critical action needed]
2. [Second priority action]
3. [Third priority action]

Optional Improvements:
• [Nice-to-have improvement 1]
• [Nice-to-have improvement 2]

═══════════════════════════════════════════════════════════════
```
</report-generation>

---

### Phase 5: User Action

<user-action>
**Use AskUserQuestion tool:**

```json
{
  "questions": [
    {
      "question": "Based on the alignment analysis, what would you like to do?",
      "header": "Action",
      "multiSelect": false,
      "options": [
        {
          "label": "Accept - Changes align",
          "description": "Alignment is acceptable. Continue with current implementation. Use when score >80% and no critical violations."
        },
        {
          "label": "Fix drift - Revise code",
          "description": "Make code changes to fix drift/violations. I'll help update code to match design and requirements."
        },
        {
          "label": "Update requirements - Intentional change",
          "description": "Changes are intentional improvements. Update requirements/design docs to reflect new direction."
        },
        {
          "label": "Get detailed analysis",
          "description": "Show more details about specific files, violations, or recommendations before deciding."
        }
      ]
    }
  ]
}
```

**Process user selection:**

**If "Accept - Changes align":**
- Log acceptance in metadata
- Show: "✅ Alignment accepted. Continue with /requirements-specs-execute"
- Exit

**If "Fix drift - Revise code":**
- Ask: "Which drift/violation would you like to fix first?"
- Show list of issues with file paths
- Help user make corrections
- Re-run alignment check after fixes
- Loop until user accepts

**If "Update requirements - Intentional change":**
- Ask: "Which documents need updating?"
- Options: Design (07), Tasks (08), Requirements (06), All
- Help update selected documents
- Re-run alignment check
- Confirm alignment improved

**If "Get detailed analysis":**
- Ask: "What would you like more details on?"
- Options: Specific file, Violation category, Task mapping, Pattern analysis
- Provide detailed breakdown
- Return to action selection
</user-action>

---

## Alignment Score Interpretation

<score-interpretation>
| Score Range | Status | Meaning | Recommended Action |
|-------------|--------|---------|-------------------|
| 90-100% | ✅ Excellent | Changes fully align with requirements | Accept and continue |
| 80-89% | ✅ Good | Minor deviations, acceptable | Review warnings, accept or fix |
| 70-79% | ⚠️ Moderate | Some drift detected | Review and fix key issues |
| 60-69% | ⚠️ Concerning | Significant drift | Stop and realign before continuing |
| <60% | ❌ Critical | Major misalignment | Serious review needed |

**Score Adjustments:**
- Critical violations (security, data integrity): -20% each
- Unmapped large changes (>100 lines): -5% each
- Missing requirement coverage: -10% per missing FR
</score-interpretation>

---

## Meta-Cognitive Verification

<meta-verification>
**Before presenting report, verify:**

```
<verification>
ANALYSIS QUALITY CHECK:

1. Change Detection:
   - [ ] All git changes captured?
   - [ ] File categorization accurate?
   - [ ] Line counts correct?

2. Context Loading:
   - [ ] All requirement files read?
   - [ ] Key decisions extracted correctly?
   - [ ] Design components identified?

3. Alignment Analysis:
   - [ ] Every change mapped to task or flagged?
   - [ ] Design compliance checked for each file?
   - [ ] Pattern violations identified?
   - [ ] Scope drift detected?

4. Report Quality:
   - [ ] Score calculation accurate?
   - [ ] All categories covered?
   - [ ] Recommendations actionable?
   - [ ] No false positives/negatives?

QUALITY SCORE: [X/12 checks passed]

If <10/12: Re-analyze before presenting
If ≥10/12: Present report to user
</verification>
```
</meta-verification>

---

## Common Drift Patterns

<drift-patterns>
**Scope Drift (Feature Creep):**
- Adding features not in requirements
- Creating components not in design
- Expanding beyond user's stated scope

**Design Drift:**
- Different component structure than 07-design.md
- API contracts don't match specification
- Data models have extra/missing fields

**Pattern Drift:**
- Not following codebase conventions from 03-context-findings
- Inconsistent naming compared to existing code
- Different error handling approach

**Requirement Gaps:**
- FRs not addressed in code
- Acceptance criteria not met
- Technical requirements ignored
</drift-patterns>

---

## Integration with Other Commands

<integration>
**Before Task Execution:**
```bash
/requirements-revise        # Check current state
/requirements-specs-execute # Execute next task
```

**After Multiple Sessions:**
```bash
/requirements-revise        # Verify accumulated changes
```

**Before Ending Requirement:**
```bash
/requirements-revise        # Final alignment check
/requirements-end           # Archive with confidence
```

**Continuous Alignment:**
Run `/requirements-revise` periodically during long implementations to catch drift early.
</integration>

---

## Example Session

<example>
```
User: /requirements-revise

Claude: 📊 Analyzing current changes against requirements...

Loading requirement: 2025-11-20-1430-payment-integration
Reading git changes: 12 files modified, 847 lines added, 123 removed

═══════════════════════════════════════════════════════════════
📊 REQUIREMENTS ALIGNMENT REPORT
═══════════════════════════════════════════════════════════════

ALIGNMENT SCORE: 78%

Score Breakdown:
├── Task Coverage:      85% (10/12 changes mapped)
├── Design Compliance:  75% (3 deviations found)
├── Pattern Alignment:  90% (consistent with codebase)
├── Scope Integrity:    70% (1 scope warning)
└── Requirement Coverage: 80% (4/5 FRs addressed)

⚠️ POTENTIAL DRIFT (2)

• src/services/PaymentService.ts
  ├── Issue: Extra method `validateCurrency()` not in design
  ├── Expected: 07-design.md shows 4 methods
  ├── Actual: 5 methods implemented
  └── Recommendation: Add to design or remove if unnecessary

• src/components/PaymentForm.tsx
  ├── Issue: Mobile responsiveness added (Q2=NO)
  ├── Expected: Desktop-only per discovery answers
  ├── Actual: Contains responsive breakpoints
  └── Recommendation: Confirm with user if scope changed

💡 RECOMMENDATIONS

1. Review PaymentService extra method - intentional enhancement?
2. Clarify mobile support decision with stakeholder
3. Add unit tests for PaymentValidator (FR-3 coverage gap)

[AskUserQuestion: What would you like to do?]

User selects: "Fix drift - Revise code"

Claude: Which issue would you like to address first?
1. PaymentService extra method
2. Mobile responsiveness scope question

User: 2

Claude: The mobile responsiveness appears to be scope drift.
Your discovery answer Q2 was "No - Desktop only".

Options:
A) Remove responsive code (align with original scope)
B) Update requirements (mobile support is now needed)

User: B - we decided to add mobile later

Claude: I'll update the requirements documents:
- 02-discovery-answers.md: Q2 → "Yes (changed)"
- 07-design.md: Add responsive design section
- 08-tasks.md: Add mobile styling tasks

[Updates files]

Re-running alignment check...

ALIGNMENT SCORE: 91% ✅

The mobile changes now align with updated requirements.
```
</example>

---

## Related Commands

- `/requirements-status` - View current requirement status
- `/requirements-specs-execute` - Execute implementation tasks
- `/requirements-current` - View requirement details
- `/requirements-end` - Archive completed requirement

---

## Notes

- This command is **read-only by default** - only analyzes, doesn't change code
- Changes are only made when user explicitly chooses "Fix drift" or "Update requirements"
- Best used as a checkpoint during long implementations
- Helps maintain traceability throughout the development lifecycle
- Supports the "verification gate" principle from the workflow
