/**
 * Cursor Slash Commands Template Generator
 * Generates Cursor slash commands in `.cursor/commands/` format
 *
 * Key differences from Claude Code / GitHub Copilot:
 * - No `vscode/askQuestions` → replaced with inline numbered-option questions
 * - No `.github/agents/` → orchestration via `.cursor/rules/` conventions
 * - `allowed-tools` uses Cursor tool names: Bash(*), Read(*), Write(*)
 * - Questions rendered as structured inline text; user replies with [A]/[B]/[C]
 */

export interface CursorCommandData {
  /** Human-readable description shown in the command palette */
  description: string;
  /** Comma-separated Cursor allowed-tools string */
  allowedTools: string;
  /** Argument hint shown in the composer input */
  argumentHint?: string;
  /** Markdown body of the command */
  content: string;
}

/**
 * Generate all Cursor slash command definitions.
 * Content is kept at the same depth as the Copilot templates but adapted for
 * Cursor's interaction model (inline [A]/[B]/[C] choices instead of tool-driven UI).
 */
export function generateCursorSlashCommands(): Record<string, CursorCommandData> {
  return {
    // ───────────────────────────────────────────────────────────────────────
    'requirements-start': {
      description: 'Begin gathering requirements for a new feature',
      allowedTools: 'Bash(*), Read(*), Write(*)',
      argumentHint: 'feature description, e.g. add user profile page',
      content: `# Start Requirements Gathering

Begin gathering requirements for: $ARGUMENTS

---

## 🎯 YOUR ROLE

You are a **senior requirements analyst** guiding the user through a systematic
requirements-gathering process that produces actionable, implementation-ready specifications.

**Framework**: DEPTH (Define role → Establish constraints → Provide context → Task structure → Human-loop)

---

## ⚠️ INTERACTION RULES FOR CURSOR

Because Cursor does not have a structured question-picker UI, present choices as
**lettered inline options**. Example:

\`\`\`
**Q1: Will users interact through a visual interface?**
[A] Yes (Recommended) — builds on existing UI components
[B] No — API/backend only

Reply with [A] or [B] ▶
\`\`\`

- Ask questions in **batches of 3-5** before waiting for answers.
- **Write all questions to a markdown file FIRST**, then present them.
- Wait for the user's batch reply before recording answers.

---

## Full Workflow

### Phase 1: Initial Setup

1. Create timestamp folder: \`requirements/YYYY-MM-DD-HHMM-[slug]/\`
2. Extract slug from \`$ARGUMENTS\`
3. Create \`00-initial-request.md\` and \`metadata.json\`
4. Update \`requirements/.current-requirement\`
5. Run codebase overview (\`tree\` / \`find\` commands)
6. Identify tech stack, main components, conventions

### Phase 2: Discovery Questions (Batch Inline)

7. Read codebase overview results
8. Write 5 discovery questions to \`01-discovery-questions.md\` (all at once)
9. Show brief research context ("I found X patterns, Y services, Z conventions…")
10. Present **Batch 1 (Q1–Q4)** as lettered inline options, then **Batch 2 (Q5)** with 3-4 choices
11. Wait for user reply

Each question must include:
- 📊 Codebase finding
- 🌐 Industry benchmark
- ✅ Best-practice recommendation

### Phase 3: Codebase Analysis (Autonomous)

12. Use \`Read\`, \`Bash\` to deep-dive into relevant files based on discovery answers
13. Document findings in \`03-context-findings.md\`:
    - Files to modify
    - Patterns to follow
    - Technical constraints

### Phase 4: Expert Questions (Batch Inline)

14. Write 5 expert questions to \`04-detail-questions.md\` (reference actual file paths)
15. Present **Batch 1 (Q1–Q3)** then **Batch 2 (Q4–Q5)** as lettered inline options
16. Wait for user reply
17. Record answers in \`05-detail-answers.md\`

### Phase 5: Requirements Documentation

18. Generate \`06-requirements-spec.md\` with:
    - Problem statement
    - Functional requirements (FR-X.Y) with Given-When-Then acceptance criteria
    - Technical requirements (TR-X)
    - Implementation hints with actual file paths
    - Assumptions

19. Update \`metadata.json\`: \`phase: "requirements_complete"\`

20. Show completion message:
\`\`\`
✅ Requirements Gathering Complete!

📋 Generated Files:
- 00-initial-request.md
- 01-discovery-questions.md
- 02-discovery-answers.md
- 03-context-findings.md
- 04-detail-questions.md
- 05-detail-answers.md
- 06-requirements-spec.md ✨ COMPLETE

🎯 Next Step: /requirements-specs-generate
\`\`\`

---

## Question Format (Cursor Inline Style)

\`\`\`
📋 Discovery Questions — please reply with your choices (e.g. "Q1:A Q2:B Q3:A Q4:B")

**Q1: Will users interact with this feature through a visual interface?**
[A] Yes (Recommended) — 📊 12 UI components already in components/. 🌐 87% industry adoption. 🎯 Better engagement.
[B] No — API/backend only. Suitable for background jobs, CLI tools.

**Q2: Does this feature need to work on mobile devices?**
[A] Yes (Recommended) — 📊 Responsive design in place. 🌐 73% users on mobile. 🎯 Wider reach.
[B] No — Desktop only.

**Q3: Will this feature handle sensitive or private user data?**
[A] Yes (Recommended) — 📊 Encryption patterns in utils/security.ts. ✅ GDPR compliance. 🎯 Trust.
[B] No — No sensitive data.

**Q4: Should this follow your existing Modal Pattern at components/ui/Modal.tsx?**
[A] Yes (Recommended) — 📊 Used in 8 features. ✅ WCAG 2.1 AA. 🎯 Consistent UX.
[B] No — Different interaction pattern needed.
\`\`\`

---

## Metadata Structure

\`\`\`json
{
  "id": "feature-slug",
  "started": "ISO-8601",
  "lastUpdated": "ISO-8601",
  "status": "active",
  "phase": "discovery|context|detail|requirements_complete",
  "progress": {
    "discovery": { "answered": 0, "total": 5 },
    "detail": { "answered": 0, "total": 5 }
  },
  "specs": {
    "designGenerated": false,
    "designApproved": false,
    "tasksGenerated": false,
    "totalTasks": 0,
    "completedTasks": 0
  }
}
\`\`\`
`,
    },

    // ───────────────────────────────────────────────────────────────────────
    'requirements-status': {
      description: 'Check current requirement progress and continue from checkpoint',
      allowedTools: 'Read(*), Bash(*)',
      content: `# Check Requirements Status

Show current requirement-gathering progress and continue from the last checkpoint.

---

## Instructions

1. Read \`requirements/.current-requirement\` → get active session path
2. Read \`[session]/metadata.json\` → load phase, status, progress
3. Scan task completion from \`08-tasks.md\` if it exists
4. Display formatted status dashboard
5. Suggest the next action based on current phase

---

## Status Dashboard Format

\`\`\`
═══════════════════════════════════════════════════════
📋 Requirements Status — [Feature Name]
═══════════════════════════════════════════════════════

Session : requirements/[session-folder]/
Phase   : [phase]
Status  : [active | complete | bug_fixing | change_review]

Progress:
  Discovery  [████████░░] 4/5 answered
  Detail     [██████████] 5/5 answered
  Tasks      [████░░░░░░] 4/10 complete

Active bug    : [bug-001 | none]
Active change : [change-001 | none]
Last updated  : [ISO timestamp]
═══════════════════════════════════════════════════════
\`\`\`

---

## Phase-Specific Next Actions

| Phase | Suggested Next Command |
|-------|------------------------|
| \`discovery\` | Answer pending discovery questions |
| \`context\` | Autonomous codebase analysis running |
| \`detail\` | Answer pending expert questions |
| \`requirements_complete\` | \`/requirements-specs-generate\` |
| \`specs_complete\` / \`design_approved\` | \`/requirements-specs-execute\` |
| \`executing\` | \`/requirements-specs-execute\` (next task) |
| \`bug_fixing\` | \`/requirements-bug-fix\` |
| \`change_review\` | \`/requirements-spec-enhance\` |
| \`implemented\` | \`/requirements-code-review\` or \`/requirements-end\` |
`,
    },

    // ───────────────────────────────────────────────────────────────────────
    'requirements-list': {
      description: 'List all requirement sessions with status indicators',
      allowedTools: 'Read(*), Bash(*)',
      content: `# List All Requirements

List all requirement sessions with status indicators.

---

## Instructions

1. Run \`ls requirements/\` (or \`find requirements/ -maxdepth 1 -type d\`) to get all session folders
2. For each folder matching the timestamp pattern (\`YYYY-MM-DD-HHMM-*\`):
   - Read \`metadata.json\` to get phase, status, task progress
3. Display sorted by last-updated (newest first)
4. Mark the current active session (from \`.current-requirement\`)

---

## Display Format

\`\`\`
📚 All Requirement Sessions
══════════════════════════════════════════════════════

● ACTIVE   2025-11-10-1430-user-auth
           Phase: executing | Tasks: 7/15 done | Updated: 2h ago

○ COMPLETE 2025-11-08-0900-payment-gateway
           Phase: implemented | Tasks: 22/22 done | Updated: 2d ago

○ PENDING  2025-11-07-1600-export-reports
           Phase: requirements_complete | Updated: 3d ago

──────────────────────────────────────────────────────
Total: 3 sessions (1 active, 1 complete, 1 pending)
\`\`\`

---

## Status Indicators

- **● ACTIVE** — currently being worked on (\`.current-requirement\` pointer)
- **○ COMPLETE** — all tasks done or archived
- **○ PENDING** — requirements captured, awaiting design/execution
- **⚠ BLOCKED** — active bug or change request
`,
    },

    // ───────────────────────────────────────────────────────────────────────
    'requirements-current': {
      description: 'View current requirement session details',
      allowedTools: 'Read(*)',
      content: `# View Current Requirement

View the full details of the active requirement session.

---

## Instructions

1. Read \`requirements/.current-requirement\` → get session path
2. Read \`metadata.json\` for phase, progress, task counts
3. For each file that exists in the session directory, show a summary:
   - 00 → initial request snippet
   - 06 → requirements spec overview
   - 07 → design overview (if exists)
   - 08 → task list with completion status (if exists)
   - 09 → active bugs (if exists)
   - 10 → change log entries (if exists)
4. Show file listing with sizes

---

## Output Format

\`\`\`
╔═══════════════════════════════════════════════════════╗
║  Current Requirement: [Feature Name]                  ║
╠═══════════════════════════════════════════════════════╣
║  Phase: [phase]   Status: [status]                    ║
║  Session: requirements/[folder]/                      ║
╚═══════════════════════════════════════════════════════╝

📄 Files
  ✅ 00-initial-request.md       (initial request)
  ✅ 01-discovery-questions.md   (5 questions)
  ✅ 02-discovery-answers.md     (5 answers)
  ✅ 03-context-findings.md      (codebase analysis)
  ✅ 04-detail-questions.md      (5 expert questions)
  ✅ 05-detail-answers.md        (5 answers)
  ✅ 06-requirements-spec.md     (8 FRs, 5 TRs)
  ✅ 07-design.md                (approved)
  ✅ 08-tasks.md                 [7/15 done]
  ⬜ 09-bug-tracker.md           (no bugs)
  ⬜ 10-change-log.md            (no changes)

📊 Task Progress: [████░░░░░░] 7/15 (46%)
  Phase 1 Foundation  [████████░░] 4/5
  Phase 2 Services    [████░░░░░░] 2/5
  Phase 3 API         [██░░░░░░░░] 1/5
\`\`\`
`,
    },

    // ───────────────────────────────────────────────────────────────────────
    'requirements-remind': {
      description: 'Show phase-specific rules and workflow reminders',
      allowedTools: 'Read(*)',
      content: `# Phase Rules & Reminders

Show phase-specific rules and reminders for the Requirements workflow.

---

## Universal Rules (All Phases)

1. **Always** read \`requirements/.current-requirement\` before acting
2. **Always** use \`metadata.json\` for phase and progress tracking
3. **Never** assume session state — verify from files
4. **Maintain traceability**: every code change links to a task → design → requirement
5. **One task per session** for specs-execute (fresh context per task)

---

## Phase-Specific Rules

### 🔍 Discovery Phase
- Ask exactly **5 questions** per batch (cognitive load management)
- Use **binary or multiple-choice** only (no open-ended)
- Write ALL questions to markdown **before** presenting them
- Present as **inline lettered options** \`[A]/[B]/[C]\`
- Record answers only **after** all questions answered

### 🔬 Context Phase (Autonomous)
- NO user interaction — complete analysis silently
- Search codebase with \`Bash\`, \`Read\` tools
- Document EVERY finding in \`03-context-findings.md\`
- Include: file paths, class names, patterns, constraints

### 💡 Detail Phase
- Reference actual file paths from Phase 3
- Questions must be answerable by a non-technical PM
- Build on discovery answers (if security=YES → ask encryption pattern)

### 📋 Requirements Phase
- Use Given-When-Then for acceptance criteria
- Every FR must have at least 1 AC
- Include assumptions for any unanswered questions

### 📐 Specs Generate Phase
- **MUST** get design approval before generating tasks
- Use inline \`[A] Yes / [B] Minor tweaks / [C] Major revision / [D] More detail\`
- Loop until explicit approval
- Task generation prefers fresh Cursor session for context isolation

### ⚙️ Specs Execute Phase
- **ONE task per Cursor session** (fresh context = better quality)
- Follow task dependencies from \`08-tasks.md\`
- Mark \`[x]\` in tasks file only after user confirms
- Log all changes in \`10-change-log.md\`

### 🐛 Bug Fix Phase
- **NEVER** jump straight to fixing — analyze first
- Two-step: Root Cause Analysis → Fix Strategy → Implementation
- Track every bug in \`09-bug-tracker.md\`
`,
    },

    // ───────────────────────────────────────────────────────────────────────
    'requirements-end': {
      description: 'Complete and archive current requirement session',
      allowedTools: 'Bash(*), Read(*), Write(*)',
      content: `# End Requirements Session

Complete and archive the current requirement session.

---

## Pre-flight Checks

1. Read \`requirements/.current-requirement\`
2. Read \`metadata.json\`:
   - If any open bug (\`activeBug\` non-null) → warn user:
     \`\`\`
     ⚠️ There is an unresolved bug: [bug-id]
     
     [A] Resolve the bug first — run /requirements-bug-fix
     [B] Archive anyway (mark incomplete)
     [C] Cancel — keep working
     
     Reply with [A], [B], or [C] ▶
     \`\`\`
   - If active change request → same warning pattern
   - If \`phase\` is not \`implemented\` → warn tasks are incomplete

---

## Archive Procedure

1. Update \`metadata.json\`:
   \`\`\`json
   { "status": "complete", "completedAt": "ISO-8601" }
   \`\`\`
2. Move session folder to \`requirements/archive/[session-name]/\`
3. Clear \`requirements/.current-requirement\`

---

## Completion Summary

\`\`\`
╔══════════════════════════════════════════════════════╗
║  Session Archived: [Feature Name]                    ║
╠══════════════════════════════════════════════════════╣
║  Duration  : [start → end]                           ║
║  Tasks     : [X] / [Y] completed                     ║
║  Bugs fixed: [N]                                     ║
║  Changes   : [N]                                     ║
╚══════════════════════════════════════════════════════╝

Files archived to: requirements/archive/[session]/
Active session cleared.

🎯 Next: Run /requirements-start to begin a new feature.
\`\`\`
`,
    },

    // ───────────────────────────────────────────────────────────────────────
    'requirements-specs-generate': {
      description: 'Generate design document and implementation tasks',
      allowedTools: 'Bash(*), Read(*), Write(*)',
      content: `# Generate Design and Tasks

Generate technical design (\`07-design.md\`) and implementation task breakdown (\`08-tasks.md\`).

---

## Architecture: Context Isolation Pattern

Design generation and task generation are separated to prevent "context rot":

\`\`\`
MAIN SESSION
├── Phase A: Load requirements files (00-06)
├── Phase B: Generate 07-design.md
├── Phase C: Design validation loop (interactive, may iterate)
└── Phase D: Checkpoint → spawn fresh session for tasks

FRESH SESSION (recommended) OR INLINE
└── Generate 08-tasks.md from ONLY: design + requirements + patterns
\`\`\`

---

## Phase A: Session Setup

1. Read \`requirements/.current-requirement\` OR accept explicit path argument
2. Read \`metadata.json\` → determine state:
   - \`requirements_complete\` → full flow (B→C→D)
   - \`design_approved\` → skip to task generation only
   - \`specs_complete\` → show error ("use /requirements-specs-execute")
3. Load \`06-requirements-spec.md\` and \`03-context-findings.md\`

---

## Phase B: Design Generation

4. Generate \`07-design.md\` with:
   - Architecture overview (include Mermaid diagram if applicable)
   - Component specifications
   - Data models
   - API contracts
   - Error handling strategy
   - Testing strategy
5. Write file immediately
6. Update metadata: \`designGenerated: true\`

---

## Phase C: Design Validation Loop (Interactive)

7. Show design overview
8. Present approval question as **inline lettered options**:

\`\`\`
📐 Design ready. Please review and reply:

[A] Yes — Approve design, proceed to tasks
[B] Minor tweaks — small changes needed (I'll ask what)
[C] Major revision — significant redesign needed
[D] More detail — expand specific sections

Reply with [A], [B], [C], or [D] ▶
\`\`\`

9. Handle responses:
   - \`[A]\` → update metadata \`designApproved: true\`, proceed to Phase D
   - \`[B]\` → ask "What tweaks?", update design, loop back to step 8
   - \`[C]\` → ask "What's wrong? What should it include?", redesign, loop back
   - \`[D]\` → ask "Which sections?", expand, loop back

10. **This loop is MANDATORY** — cannot skip

---

## Phase D: Task Generation Strategy

11. After approval, ask:

\`\`\`
✅ Design approved and saved.

[A] Generate tasks now (recommended) — inline with fresh subagent context
[B] Generate later — start a NEW Cursor session and run /requirements-specs-generate again

Reply with [A] or [B] ▶
\`\`\`

**If [A]**: Generate \`08-tasks.md\` using ONLY clean inputs:
- \`07-design.md\` (approved)
- \`06-requirements-spec.md\`
- \`03-context-findings.md\`

**If [B]**: Save checkpoint (\`phase: "design_approved"\`), stop session

---

## Task Structure Template

Each task in \`08-tasks.md\` must follow:

\`\`\`markdown
- [ ] **Task [N]: [Action Verb] [Component] [Outcome]**
  **Type**: Feature | Infrastructure | Integration | UI | Testing | Docs
  **Size**: S (50-150 lines) | M (150-300 lines) | L (300-500 lines)
  **Dependencies**: Task [X] (or "None")

  **Sub-tasks**:
  - Create \`path/to/file.ext\` (~X lines)
  - Implement \`methodName()\` with [purpose] (~Y lines)

  **Acceptance Criteria**:
  - [ ] [Specific, testable criterion]
  - [ ] Tests pass with >80% coverage

  **Verification**:
  - Run: \`[test command]\`
  - Confirm: [expected result]

  _Requirements: FR-X.Y, TR-Z_
  _Design: 07-design.md § [Section]_
  _Estimated: ~XXX lines_
\`\`\`

**Task Sizing Rules**:
- Component ≤350 lines → ONE task
- 350-700 lines → TWO related tasks (Core + Logic)
- >700 lines → FIVE vertical slices (Foundation / Business Logic / API / UI / Quality)

---

## Finalization

- Update metadata: \`phase: "specs_complete"\`, \`totalTasks: N\`
- Show summary with task count by phase
- Suggest: \`/requirements-specs-execute\`
`,
    },

    // ───────────────────────────────────────────────────────────────────────
    'requirements-specs-execute': {
      description: 'Execute implementation tasks from task breakdown (one task per session)',
      allowedTools: 'Bash(*), Read(*), Write(*)',
      content: `# Execute Implementation Tasks

Execute ONE task from \`08-tasks.md\` per Cursor session.

**Why one task per session?** Fresh context per task = better code quality, easier review, cleaner error isolation.

---

## Phase 1: Session Validation

1. Read \`requirements/.current-requirement\`
2. Read \`metadata.json\` — verify \`phase ∈ {specs_complete, design_approved, executing}\`
3. Check required files: \`06-requirements-spec.md\`, \`07-design.md\`, \`08-tasks.md\`
4. If \`awaitingVerification: true\` → skip to Phase 6 (resume verification)

---

## Phase 2: Task Parsing

5. Read \`08-tasks.md\` — find next \`- [ ]\` task (skip \`- [x]\`)
6. Extract: task number, description, sub-tasks, requirements references (FR-X.Y, TR-Z)
7. Lookup acceptance criteria from \`06-requirements-spec.md\`
8. Lookup design details from \`07-design.md\`

Show parsed task:
\`\`\`
══════════════════════════════════════
📋 Next Task: #[N] — [Description]
──────────────────────────────────────
Sub-tasks : [count]
Type      : CODE | DOCS | CONFIG | TEST
Size      : S | M | L (~XXX lines)
Requires  : FR-X.Y, TR-Z
══════════════════════════════════════
\`\`\`

---

## Phase 3: Research (MANDATORY)

9. For code tasks, research relevant libraries and patterns:
   - Use \`Bash\` to run project-specific checks
   - \`Read\` existing similar implementations in codebase
   - Identify conventions from \`CLAUDE.md\` / \`CURSOR.md\` / \`03-context-findings.md\`
10. Show research summary before implementing

---

## Phase 4: Implementation (Autonomous)

11. Implement the approved strategy:
    - For **new files**: use \`Write\`
    - For **existing files**: \`Read\` first, then targeted edits
    - Follow ALL conventions from \`CLAUDE.md\`/\`CURSOR.md\`
    - Minimal, focused changes only
12. Run verification commands if applicable (\`Bash\`)
13. Update \`10-change-log.md\` with changes made
14. Update metadata: \`awaitingVerification: true\`

---

## Phase 5: Completion Summary + Verification

15. Show what was done:
\`\`\`
══════════════════════════════════════════════════════
Task #[N] Complete ⏳ Awaiting Your Verification
══════════════════════════════════════════════════════

What was done:
✓ Created [file] ([N] lines)
✓ Modified [file] ([description])

Requirements satisfied:
✓ FR-X.Y → [implementation note]
✓ AC-X.1 → [satisfied by]

Verify with:
  [test command or manual steps]
══════════════════════════════════════════════════════
\`\`\`

16. Ask for verification:
\`\`\`
**Is Task #[N] correctly implemented?**

[A] Yes — mark complete and end session
[B] Changes needed — I'll describe what to fix
[C] Not working — there's a bug
[D] Incomplete — missing functionality

Reply with [A], [B], [C], or [D] ▶
\`\`\`

---

## Phase 6: Process User Verification

**[A]** → Mark \`[x]\` in \`08-tasks.md\`, update metadata (\`completedTasks += 1, awaitingVerification: false\`), end session

**[B]** → Ask "What needs changing?", apply changes, return to Phase 5

**[C]** → Ask "What's not working?", debug and fix, return to Phase 5

**[D]** → Ask "What's missing?", add functionality, return to Phase 5

After 3+ revisions: offer to skip, pause, or redesign approach.

---

## Session End

\`\`\`
══════════════════════════════════════════════════════
✅ Task #[N] Marked Complete

Progress: [X+1]/[Y] tasks ([percentage]%)

Next: Start a NEW Cursor session → /requirements-specs-execute
══════════════════════════════════════════════════════
\`\`\`

**Do NOT continue to the next task in this session.**
`,
    },

    // ───────────────────────────────────────────────────────────────────────
    'requirements-spec-enhance': {
      description: 'Handle mid-execution scope changes and modifications',
      allowedTools: 'Bash(*), Read(*), Write(*)',
      argumentHint: 'change request description',
      content: `# Handle Scope Changes

Handle mid-execution changes and modifications: \`$ARGUMENTS\`

---

## Change Types

| Type | Description |
|------|-------------|
| \`new_feature\` | Add new functionality |
| \`modify_existing\` | Change existing feature |
| \`remove_feature\` | Remove functionality |
| \`expand_scope\` | Increase project scope |
| \`performance\` | Optimization without behavior change |

---

## Phase 1: Change Intake

1. Read \`metadata.json\` → get current phase, active change
2. Get change description from \`$ARGUMENTS\` or ask:
   \`\`\`
   Describe the scope change you need:
   \`\`\`
3. Classify change type (from table above)
4. Create entry in \`10-change-log.md\`
5. Update metadata: \`phase: "change_review"\`

---

## Phase 2: Impact Analysis (Autonomous)

6. Analyze impact on each layer:
   - **Requirements** (06-requirements-spec.md) — which FRs/TRs are affected?
   - **Design** (07-design.md) — which components change?
   - **Tasks** (08-tasks.md) — which tasks need add/modify/remove?
7. Estimate effort (S/M/L: 1-3 / 3-8 / 8+ hours)
8. Identify risks

---

## Phase 3: Impact Presentation + Approval

9. Present analysis:
\`\`\`
═══════════════════════════════════════════════════════
Change Request Analysis
═══════════════════════════════════════════════════════

Type     : [change type]
Impact   : [High | Medium | Low]
Effort   : [S | M | L]

Requirements affected : [FRs/TRs list]
Design sections       : [components list]
Tasks impact          : +[N] new, [N] modified, [N] removed

Risk: [description]
═══════════════════════════════════════════════════════
\`\`\`

10. Ask for approval:
\`\`\`
[A] Approve — apply changes to specs and tasks
[B] Modify — adjust the proposed change
[C] Cancel — discard change request

Reply with [A], [B], or [C] ▶
\`\`\`

---

## Phase 4: Apply Changes (After Approval)

11. Update \`06-requirements-spec.md\` (add/modify FRs)
12. Update \`07-design.md\` (revise components/data models)
13. Update \`08-tasks.md\` (add, modify, or strike-through tasks)
14. Append to \`11-change-backlog.md\` if task deferral needed
15. Update \`10-change-log.md\` with approved changes
16. Update metadata: restore previous phase (\`executing\` or \`specs_complete\`)

---

## Completion

\`\`\`
✅ Change Applied

Updated files:
- 06-requirements-spec.md ([N] requirements updated)
- 07-design.md ([N] sections revised)
- 08-tasks.md ([N] tasks added/modified)

Next: /requirements-specs-execute
\`\`\`
`,
    },

    // ───────────────────────────────────────────────────────────────────────
    'requirements-bug-fix': {
      description: 'Fix implementation issues with two-step method',
      allowedTools: 'Bash(*), Read(*), Write(*)',
      argumentHint: 'bug description or issue id',
      content: `# Requirements Bug Fix

Fix implementation issues discovered after task execution.

**Usage**: \`/requirements-bug-fix [bug description]\`

**CRITICAL RULE**: ❌ NEVER jump straight to fixing. ✅ ALWAYS analyze first.

---

## 🎯 Five-Phase Workflow

### Phase 1: Bug Intake (Interactive)

1. Read \`requirements/.current-requirement\` and \`metadata.json\`
2. Verify phase ∈ \`{"executing", "implemented"}\`
3. Get bug description from \`$ARGUMENTS\` or ask user
4. Present intake questions (present as **Batch 1** then **Batch 2**):

\`\`\`
🐛 Bug Intake — please reply with your answers (e.g. "Q1:A Q2:B Q3:C Q4:name Q5:description")

**Q1: What type of issue is this?**
[A] Bug — Existing code behaves unexpectedly
[B] Missing feature — Expected functionality not implemented
[C] Performance — Works but slow/inefficient
[D] Security — Potential vulnerability

**Q2: How reliably does this reproduce?**
[A] Always (100%)
[B] Sometimes (50-80%)
[C] Rarely (<20%)
[D] Unknown

**Q3: What is the severity?**
[A] Critical — Blocks users, data loss, security breach
[B] High — Major feature broken for most users
[C] Medium — Partially broken, workaround exists
[D] Low — Minor, cosmetic, edge case
\`\`\`

\`\`\`
**Q4: Which component is affected?**
(Reply with component name from 08-tasks.md completed tasks)

**Q5: Diagnostic info?**
(Paste error messages, stack traces, or behavior description)
\`\`\`

5. Create/update \`09-bug-tracker.md\`
6. Update metadata: \`phase: "bug_fixing"\`, add bug entry \`status: "analyzing"\`

---

### Phase 2: Root Cause Analysis (100% Autonomous — NO user interaction)

7. Semantic search for affected components (\`Read\`, \`Bash grep\`)
8. Review implementation code in affected files
9. Trace back: which task created the bug? which design section? which requirement?
10. Run reproduction attempt if possible (\`Bash\`)
11. Structured analysis:
    - Hypothesis → Evidence → Validation
    - Classify: \`implementation_error | design_gap | requirement_gap\`
12. Search for similar patterns in codebase
13. Document in \`09-bug-tracker.md\`

---

### Phase 3: Fix Strategy Validation (Interactive)

14. Present analysis summary:
\`\`\`
═══════════════════════════════════════════════════════
Bug Analysis — Bug #[ID]
═══════════════════════════════════════════════════════

Root Cause     : [Technical explanation]
Classification : [Implementation Error | Design Gap | Requirement Gap]
Affected Files : [paths:lines]
Proposed Fix   : [Strategy + risk assessment]
Traceability   : [Requirement → Design → Task]
═══════════════════════════════════════════════════════
\`\`\`

15. Validation questions:
\`\`\`
**Please validate the analysis above:**

[A] Root cause is correct — proceed with fix
[B] Partially correct — I'll clarify what's wrong
[C] Wrong — I'll explain the real issue

**Fix strategy:**
[A] Acceptable — apply the proposed fix
[B] Modify — I have a better approach
[C] Too risky — may break other things

**Check for similar issues elsewhere?**
[A] Yes (Recommended)
[B] No — fix only this instance

Reply with three letters, e.g. "A A A" ▶
\`\`\`

16. Wait for user response — **cannot proceed without it**

---

### Phase 4: Fix Implementation (Autonomous)

17. Apply minimal, targeted code fixes per approved strategy
18. Add comments: \`// Bug #[ID]: [reason]\`
19. Update related files (tests, config, docs) if needed
20. Update \`09-bug-tracker.md\` with changes made
21. Update metadata: \`status: "fixing"\` → \`"fixed"\`

---

### Phase 5: Fix Verification (Interactive)

22. Show summary:
\`\`\`
══════════════════════════════════════════════════
Bug Fix Applied — Bug #[ID] ⏳ Awaiting Verification
══════════════════════════════════════════════════
Changes : [list]
Files   : [paths]
Verify  : [test steps]
══════════════════════════════════════════════════
\`\`\`

23. Ask for verification:
\`\`\`
[A] Fixed — issue resolved, working as expected
[B] Partially — better but issues remain
[C] Not fixed — problem persists
[D] New issue appeared

Reply with [A], [B], [C], or [D] ▶
\`\`\`

24. Process result:
- **[A]** → mark \`verified: true\`, restore previous phase, show "Bug #[ID] resolved ✅"
- **[B]/[C]** → return to Phase 2 with new info
- **[D]** → create new bug entry, return to Phase 1
`,
    },

    // ───────────────────────────────────────────────────────────────────────
    'requirements-code-review': {
      description: 'Perform technical code review with eight-pillar analysis',
      allowedTools: 'Bash(*), Read(*)',
      content: `# Technical Code Review

Perform a technical code review using the **Eight-Pillar Analysis Framework**.

---

## Eight Quality Pillars

| # | Pillar | What to Check |
|---|--------|---------------|
| 1 | **Correctness** | Does code meet all FRs and acceptance criteria? |
| 2 | **Performance** | Efficient algorithms? No N+1 queries? Caching? |
| 3 | **Security** | Input validation, auth checks, no secret leakage |
| 4 | **Maintainability** | Readable, well-named, low cognitive complexity |
| 5 | **Scalability** | Handles growth? No hard-coded limits? |
| 6 | **Testing** | Unit + integration coverage ≥80%? Edge cases? |
| 7 | **Documentation** | Comments on non-obvious logic? README updated? |
| 8 | **Architecture** | Follows project patterns? No god classes/functions? |

---

## Instructions

1. Read \`requirements/.current-requirement\`
2. Load \`06-requirements-spec.md\`, \`07-design.md\`, \`metadata.json\`
3. Identify all modified files from \`10-change-log.md\` or \`Bash git diff\`
4. For each pillar, analyze code against requirements and design
5. Generate review report

---

## Review Report Format

\`\`\`
╔════════════════════════════════════════════════════╗
║  Code Review — [Feature Name]                      ║
╠════════════════════════════════════════════════════╣
║  Overall: [PASS | PASS WITH NOTES | NEEDS WORK]    ║
╚════════════════════════════════════════════════════╝

Pillar Analysis:
  1. Correctness    [✅ PASS | ⚠️ WARN | ❌ FAIL]
  2. Performance    [✅ PASS | ⚠️ WARN | ❌ FAIL]
  3. Security       [✅ PASS | ⚠️ WARN | ❌ FAIL]
  4. Maintainability [✅ PASS | ⚠️ WARN | ❌ FAIL]
  5. Scalability    [✅ PASS | ⚠️ WARN | ❌ FAIL]
  6. Testing        [✅ PASS | ⚠️ WARN | ❌ FAIL]
  7. Documentation  [✅ PASS | ⚠️ WARN | ❌ FAIL]
  8. Architecture   [✅ PASS | ⚠️ WARN | ❌ FAIL]

Issues Found: [N]
  🔴 Critical : [list]
  🟠 High     : [list]
  🟡 Medium   : [list]
  🟢 Low      : [list]

Recommendations:
  1. [Specific actionable recommendation]
  2. [...]
\`\`\`

---

## Severity Definitions

- 🔴 **Critical** — must fix before merging (security, data loss, broken core feature)
- 🟠 **High** — should fix before merging (performance, major maintainability issue)
- 🟡 **Medium** — fix in follow-up PR (minor maintainability, missing tests)
- 🟢 **Low** — optional improvement (style, documentation)
`,
    },

    // ───────────────────────────────────────────────────────────────────────
    'requirements-library': {
      description: 'Manage project knowledge library — init, view, query, harvest',
      allowedTools: 'Bash(*), Read(*), Write(*), AskQuestion(*)',
      content: `# Requirements Library

Manage the project knowledge library at \`requirements/.library/\`.

---

## Instructions

1. Check \`requirements/.library/_catalog.json\`:
   - Exists → \`libraryState = active\`, load catalog summary
   - Not found → \`libraryState = empty\`

2. Show state and present inline options:

\`\`\`
Library: ✓ Active — [N] books, [M] entries     [if active]
Library: ✗ Not initialized                      [if empty]

[A] Initialize library (new project)
[B] View library catalog
[C] Query library — search for knowledge
[D] Refresh / re-harvest from last session
[E] Reset library — clear all entries

Reply with [A], [B], [C], [D], or [E] ▶
\`\`\`

3. Execute selected action following the full protocol in \`.cursor/commands/requirements-library.md\`
`,
    },

    // ───────────────────────────────────────────────────────────────────────
    'requirements-revise': {
      description: 'Check alignment between implementation and requirements',
      allowedTools: 'Bash(*), Read(*)',
      content: `# Requirements Alignment Check

Check alignment between the current implementation and requirements/design specifications.

---

## Instructions

1. Read \`requirements/.current-requirement\`
2. Load \`06-requirements-spec.md\` and \`07-design.md\`
3. Identify implemented code (\`10-change-log.md\` + \`Bash git diff HEAD\`)
4. For each Functional Requirement (FR-X), verify implementation status
5. For each Technical Requirement (TR-X), verify compliance
6. Detect any drift categories

---

## Alignment Checks

| Check | Question |
|-------|----------|
| **FR Coverage** | Is every FR implemented? |
| **TR Compliance** | Do technical specs match implementation? |
| **AC Satisfaction** | Does code pass all acceptance criteria? |
| **Design Adherence** | Does code follow the approved design? |
| **Scope Creep** | Are there features not in requirements? |
| **Documentation Drift** | Are docs in sync with code? |

---

## Drift Categories

- **Requirements Drift** — implementation diverged from spec
- **Design Drift** — code uses different approach than 07-design.md
- **Documentation Drift** — outdated or missing docs/comments
- **Scope Drift** — unauthorized features added

---

## Alignment Report

\`\`\`
╔════════════════════════════════════════════════════╗
║  Alignment Report — [Feature Name]                 ║
╠════════════════════════════════════════════════════╣
║  Overall Compliance: [X]% ([N]/[M] requirements)  ║
╚════════════════════════════════════════════════════╝

FR Coverage:
  ✅ FR-1.1 [implemented — verified against AC-1.1]
  ✅ FR-1.2 [implemented]
  ⚠️ FR-2.1 [partially implemented — missing AC-2.1 edge case]
  ❌ FR-3.1 [not yet implemented]

TR Compliance:
  ✅ TR-1 Performance ≤200ms — [measured: 145ms]
  ✅ TR-2 JWT auth — [implemented in middleware/auth.ts]

Drift Detected:
  🟠 Design Drift: UserService uses Singleton but design spec says Factory
  🟢 Scope: Extra logging in UserController not in requirements (low risk)

Required Actions:
  1. [Fix FR-2.1 edge case — create bug fix for missing validation]
  2. [Address FR-3.1 — add to task list or mark deferred]
  3. [Align UserService pattern with 07-design.md]
\`\`\`
`,
    },
  };
}
