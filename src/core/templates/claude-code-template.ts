/**
 * Claude Code Slash Commands Template Generator
 * Generates Claude Code slash commands with frontmatter format
 */

interface SlashCommandData {
  description: string;
  allowedTools: string;
  content: string;
}

/**
 * Generate all Claude Code slash commands
 */
export function generateClaudeCodeSlashCommands(): Record<string, SlashCommandData> {
  return {
    'requirements-start': {
      description: 'Bắt đầu thu thập yêu cầu cho feature mới — tạo session, phỏng vấn, phân tích codebase',
      allowedTools: 'Bash(*), Read(*), Write(*), AskUserQuestion(*), Agent(*)',
      content: `# Start Requirements Gathering

Begin gathering requirements for: $ARGUMENTS

---

## Instructions

1. Create a timestamp-based folder in the requirements directory
2. Extract the feature slug from the arguments
3. Create initial files (00-initial-request.md, metadata.json)
4. Read and update requirements/.current-requirement with the folder name
5. Conduct pre-research using available MCP tools
6. Generate 5 discovery questions using the DEPTH framework
7. Use AskUserQuestion tool to batch ask questions
8. Record answers to 02-discovery-answers.md
9. Perform autonomous codebase analysis
10. Generate 5 expert detail questions
11. Use AskUserQuestion tool to batch ask questions
12. Generate comprehensive requirements specification

## Phase States

- discovery: Asking context discovery questions
- context: Autonomous codebase analysis
- detail: Asking expert detail questions
- requirements_complete: Requirements spec generated

## File Structure

requirements/YYYY-MM-DD-HHMM-[feature-slug]/
├── 00-initial-request.md
├── 01-discovery-questions.md
├── 02-discovery-answers.md
├── 03-context-findings.md
├── 04-detail-questions.md
├── 05-detail-answers.md
├── 06-requirements-spec.md
└── metadata.json

## Next Steps

After completing requirements gathering, use /requirements-specs-generate to generate design and tasks.
`
    },
    'requirements-status': {
      description: 'Xem tiến độ session hiện tại và tiếp tục từ checkpoint',
      allowedTools: 'Bash(*), Read(*), Glob(*)',
      content: `# Check Requirements Status

Show current requirement gathering progress and continue from last checkpoint.

---

## Instructions

1. Read requirements/.current-requirement to identify active session
2. Read metadata.json for phase and progress tracking
3. Determine phase-specific continuation
4. Show formatted status
5. Continue from last checkpoint

## Phase States

- discovery: Asking context discovery questions
- context: Autonomous codebase analysis
- detail: Asking expert detail questions
- requirements_complete: Requirements spec generated
- specs_generated: Design generated, awaiting approval
- specs_complete: Design and tasks generated
- executing: Tasks being executed
- implemented: All tasks complete
- bug_fixing: Bug fix in progress
- change_review: Change request in progress

## Next Steps

- /requirements-current: View full session details
- /requirements-list: List all requirements
- /requirements-remind: Show phase-specific rules
`
    },
    'requirements-list': {
      description: 'Liệt kê toàn bộ requirement sessions với trạng thái',
      allowedTools: 'Bash(*), Read(*), Glob(*)',
      content: `# List All Requirements

List all requirement sessions with status indicators.

---

## Instructions

1. List all directories in requirements/ that match timestamp pattern
2. Read metadata.json from each session
3. Display status indicators
4. Show summary for each session

## Status Indicators

- 🟢 Active: Currently being worked on
- 🟡 Complete: All phases finished
- 🟠 In Progress: Some phases incomplete
- 🟣 Archived: Completed and archived
`
    },
    'requirements-current': {
      description: 'Xem chi tiết session requirements đang active',
      allowedTools: 'Bash(*), Read(*), Glob(*)',
      content: `# View Current Requirement

View current requirement session details and file listing.

---

## Instructions

1. Read requirements/.current-requirement to identify active session
2. Read all files in the session directory
3. Display file contents and structure
4. Show metadata information

## Session Files

- 00-initial-request.md
- 01-discovery-questions.md
- 02-discovery-answers.md
- 03-context-findings.md
- 04-detail-questions.md
- 05-detail-answers.md
- 06-requirements-spec.md
- 07-design.md
- 08-tasks.md
- 09-bug-tracker.md
- 10-change-log.md
- 11-change-backlog.md
- metadata.json
`
    },
    'requirements-remind': {
      description: 'Hiển thị rules và reminders theo phase hiện tại',
      allowedTools: 'Read(*)',
      content: `# Show Phase Rules

Show phase-specific rules and reminders for the Requirements workflow.

---

## Phase Rules

### Discovery Phase
- Ask exactly 5 questions (binary or multiple choice)
- Use AskUserQuestion tool for batch asking
- Record answers after all questions asked
- Include research context (codebase + industry + best practices)

### Context Phase
- Perform autonomous codebase analysis
- Use codebase_search for semantic exploration
- Document findings in 03-context-findings.md

### Detail Phase
- Ask exactly 5 expert questions
- Reference specific files from codebase
- Build on discovery answers
- Use AskUserQuestion tool for batch asking

### Requirements Phase
- Generate comprehensive specification
- Include functional and technical requirements
- Add acceptance criteria
- Document assumptions

### Specs Generate Phase
- Generate design document (07-design.md)
- Generate task breakdown (08-tasks.md)
- Wait for user approval before proceeding

### Specs Execute Phase
- Execute tasks from 08-tasks.md
- Update metadata.json after each task
- Log changes in 10-change-log.md
- Track bugs in 09-bug-tracker.md

## Universal Rules

- Always read requirements/.current-requirement first
- Use metadata.json for phase tracking
- Maintain traceability throughout
- Use AskUserQuestion for batch questions
`
    },
    'requirements-end': {
      description: 'Hoàn thành session, harvest knowledge, archive artifacts',
      allowedTools: 'Bash(*), Read(*), Write(*), AskUserQuestion(*), Agent(*)',
      content: `# End Requirements Session

Complete and archive current requirement session.

---

## Instructions

1. Update metadata.json status to 'complete'
2. Archive session by moving to archive directory
3. Clear requirements/.current-requirement
4. Generate summary of completed work

## Archive Location

requirements/archive/[timestamp-feature-slug]/

## Summary

Include:
- Final status
- Total time spent
- Files generated
- Key decisions made
- Outstanding items
`
    },
    'requirements-specs-generate': {
      description: 'Sinh technical design (07-design.md) và task list (08-tasks.md)',
      allowedTools: 'Bash(*), Read(*), Write(*), AskUserQuestion(*), Agent(*)',
      content: `# Generate Design and Tasks

Generate technical design document and implementation task breakdown.

---

## Instructions

1. Read requirements/06-requirements-spec.md
2. Generate technical design document (07-design.md)
3. Show design to user for approval
4. Use AskUserQuestion to confirm design approval
5. Generate task breakdown (08-tasks.md) after approval
6. Update metadata.json phase to 'specs_generated'

## Design Document Structure

- Architecture overview
- Technical decisions
- Component design
- Data flow
- Integration points
- Security considerations

## Task Breakdown Structure

- Task ID
- Description
- Dependencies
- Estimated effort
- Acceptance criteria
- Priority level

## Approval Process

1. Present design document
2. Ask: "Is the design spec ok?"
3. Wait for explicit "yes" response
4. If changes requested, update and ask again
5. Only generate tasks after approval
`
    },
    'requirements-specs-execute': {
      description: 'Thực thi task list, delegate cho engineer agents theo tier',
      allowedTools: 'Bash(*), Read(*), Write(*), Edit(*), Glob(*), Grep(*), AskUserQuestion(*), Agent(*)',
      content: `# Execute Implementation Tasks

Execute implementation tasks from the task breakdown.

---

## Instructions

1. Read requirements/08-tasks.md
2. Execute tasks in order of dependencies
3. Update metadata.json after each task completion
4. Log progress in 10-change-log.md
5. Handle any bugs using /requirements-bug-fix

## Task Execution Rules

- Follow task dependencies
- Update completion status in metadata.json
- Document any changes made
- Test implementations
- Handle edge cases appropriately

## Progress Tracking

Update metadata.json:
- specs.completedTasks: number of completed tasks
- specs.totalTasks: total number of tasks
- phase: 'executing' or 'implemented'
`
    },
    'requirements-spec-enhance': {
      description: 'Xử lý thay đổi mid-execution — phân tích impact và cập nhật specs',
      allowedTools: 'Bash(*), Read(*), Write(*), Edit(*), AskUserQuestion(*)',
      content: `# Handle Changes During Implementation

Handle mid-execution changes and modifications to requirements.

---

## Instructions

1. Read change request from 10-change-log.md or 11-change-backlog
2. Analyze impact on requirements, design, and tasks
3. Update affected files accordingly
4. Document change in 10-change-log.md
5. Update metadata.json phase to 'change_review'

## Change Types

- new_feature: Add new functionality
- modify_existing: Change existing feature
- remove_feature: Remove functionality
- expand_scope: Increase project scope
- fix_bug: Address implementation issues

## Impact Analysis

For each change, analyze:
- Requirements impact
- Design impact
- Task impact (add, modify, remove)
- Risk assessment
- Effort estimation

## Approval Process

1. Present impact analysis
2. Use AskUserQuestion for approval
3. Document decision
4. Update specifications
5. Continue execution
`
    },
    'requirements-bug-fix': {
      description: 'Fix bugs với two-step method: phân tích root cause → approve → fix',
      allowedTools: 'Bash(*), Read(*), Write(*), Edit(*), Grep(*), Glob(*), AskUserQuestion(*)',
      content: `# Fix Implementation Issues

Fix implementation issues using two-step method: root cause analysis and fix verification.

---

## Instructions

1. Read bug report from 09-bug-tracker.md
2. Perform root cause analysis
3. Propose fix strategy
4. Use AskUserQuestion for fix approval
5. Implement fix
6. Verify fix resolves issue
7. Update bug status in 09-bug-tracker.md

## Bug Fix Workflow

### Step 1: Root Cause Analysis
- Analyze symptoms
- Identify affected components
- Trace code execution path
- Determine root cause

### Step 2: Fix Proposal
- Propose solution approach
- Estimate effort
- Identify potential side effects
- Document fix strategy

### Step 3: Fix Approval
- Present analysis and proposed fix
- Use AskUserQuestion for approval
- Wait for explicit confirmation

### Step 4: Implementation
- Apply the approved fix
- Make minimal, targeted changes
- Test the fix thoroughly

### Step 5: Verification
- Verify fix resolves the issue
- Test edge cases
- Document results
- Update bug status to 'verified' or 'reopened'

## Bug States

- analyzing: Root cause analysis in progress
- fix_proposed: Fix proposed, awaiting approval
- fixing: Fix being implemented
- fixed: Fix implemented, awaiting verification
- verified: Fix verified and resolved
- reopened: Fix did not resolve issue, reopened
`
    },
    'requirements-code-review': {
      description: 'Technical code review với 8-pillar framework',
      allowedTools: 'Bash(*), Read(*), Grep(*), Glob(*), AskUserQuestion(*)',
      content: `# Technical Code Review

Perform technical code review with eight-pill analysis framework.

---

## Instructions

1. Read requirements/06-requirements-spec.md
2. Read implementation code
3. Analyze against eight quality pillars
4. Generate review document
5. Provide actionable feedback

## Eight Quality Pillars

1. **Correctness**: Does code meet requirements?
2. **Performance**: Is code efficient and performant?
3. **Security**: Are security best practices followed?
4. **Maintainability**: Is code easy to understand and modify?
5. **Scalability**: Can code handle growth?
6. **Testing**: Is code adequately tested?
7. **Documentation**: Is code well documented?
8. **Architecture**: Does code follow good design patterns?

## Review Process

1. Analyze requirements compliance
2. Check code quality indicators
3. Identify issues and strengths
4. Provide specific, actionable feedback
5. Rate each pillar (pass/fail/needs-work)
6. Generate summary report

## Output

Generate review document with:
- Overall assessment
- Pillar-by-pillar analysis
- Specific issues found
- Recommendations for improvement
- Severity levels (critical/high/medium/low)
`
    },
    'requirements-revise': {
      description: 'Kiểm tra alignment giữa implementation và requirements spec',
      allowedTools: 'Bash(*), Read(*), Grep(*), Glob(*), AskUserQuestion(*)',
      content: `# Check Requirements Alignment

Check alignment between implementation and requirements specifications.

---

## Instructions

1. Read requirements/06-requirements-spec.md
2. Review implementation code
3. Compare with original requirements
4. Identify any drift or deviations
5. Document findings

## Alignment Checks

- Functional Requirements: Are all features implemented?
- Technical Requirements: Are technical specs met?
- Acceptance Criteria: Do tests pass acceptance criteria?
- Missing Features: Are any features omitted?
- Extra Features: Are any unauthorized features added?

## Drift Detection

- Requirements Drift: Changes to original requirements
- Implementation Drift: Deviations from agreed approach
- Documentation Drift: Outdated or missing documentation

## Output

Generate alignment report with:
- Compliance status
- Drift analysis
- Recommendations
- Required actions to align
`
    },
    'requirements-library': {
      description: 'Query hoặc seed project knowledge library',
      allowedTools: 'Bash(*), Read(*), Write(*), AskUserQuestion(*), Agent(*)',
      content: `# Requirements Library

Query hoặc seed project knowledge library.

---

## Instructions

Use this command to:
1. Query library for relevant knowledge sections
2. Seed library with project context from completed sessions
3. Browse available knowledge books and shelves

## Usage

- Query: /requirements-library query [topic]
- Seed: /requirements-library seed [session-folder]
- Browse: /requirements-library browse

## Library Structure

requirements/.library/
├── _catalog.json
├── foundations/
├── conventions/
├── frameworks/
├── patterns/
└── decisions/
`
    }
  };
}
