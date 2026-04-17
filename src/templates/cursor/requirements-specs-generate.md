---
description: Generate design document and implementation tasks
allowed-tools: Bash(*), Read(*), Write(*), AskQuestion(*)
---

# Requirements Specs Generate

Generate executable specification files (`07-design.md`, `08-tasks.md`) from completed requirements.

---

## 🎯 CONTEXT ENGINEERING ARCHITECTURE

**Research-Backed Design**: "Design-First, Task-Subagent" pattern for optimal context quality.

### The Problem: Context Rot

When design generation and task generation happen in the same session:
- Design validation loop accumulates revision history (3-5 rounds)
- By task generation time, 60-70% of context is "noise" (revision artifacts)
- Task quality degrades due to "context rot" (NoLiMa benchmark, 2025)

### The Solution: Session Isolation

```
MAIN SESSION
├── Phase A: Load requirements (00-06)
├── Phase B: Generate 07-design.md
├── Phase C: Design validation loop (interactive, may iterate)
└── Phase D: Checkpoint → user chooses inline or fresh session

FRESH SESSION (recommended)
└── Generate 08-tasks.md from ONLY: design + requirements + patterns
    (NO conversation history, NO revision artifacts)
```

---

## Usage

```
/requirements-specs-generate
/requirements-specs-generate requirements/2025-11-08-1921-feature-name
```

## Prerequisites

- Must have a completed requirements gathering session
- Files `00-06` must exist in the requirement folder
- `06-requirements-spec.md` must be complete
- Files `07-08` must NOT already exist (or user confirms overwrite)

---

## Phase A: Session Setup

1. Read `requirements/.current-requirement` OR use explicit path argument
2. Read `metadata.json` → determine state:

   | State | Phase | Action |
   |-------|-------|--------|
   | Requirements complete | `requirements_complete` | Full flow (B→C→D) |
   | Design approved, tasks pending | `design_approved` | Skip to task generation |
   | Specs complete | `specs_complete` | Show error: "use /requirements-specs-execute" |

3. Load source files: `06-requirements-spec.md`, `03-context-findings.md`, `05-detail-answers.md`

If **design_approved** state detected:
```
═══════════════════════════════════════════════════════════════════
RESUMING FROM APPROVED DESIGN
═══════════════════════════════════════════════════════════════════

✅ 07-design.md already approved (skipping design phase)
📋 Generating 08-tasks.md with FRESH context

This session has 100% clean context for optimal task quality.
═══════════════════════════════════════════════════════════════════
```
→ Skip to Phase D.1

---

## Phase B: Design Generation

4. Generate `07-design.md` with structure:
   ```markdown
   # Design Document: [Feature Name]
   ## Overview
   ## Architecture
   ### High-Level Flow (Mermaid diagram)
   ### Integration Points
   ## Components and Interfaces
   ## Data Models
   ## Error Handling
   ## Testing Strategy
   ## Algorithm Details
   ```
5. Write file immediately (checkpoint)
6. Update `metadata.json`: `designGenerated: true`

---

## Phase C: Design Validation Loop (Interactive — MANDATORY)

7. Display design overview (section headers + key decisions)
8. Present approval question as **inline lettered options**:

Use the AskQuestion tool:
```
AskQuestion({
  questions: [{
    id: "design_approval",
    prompt: "📐 Design Generated — Please review and approve:",
    options: [
      { id: "a", label: "Yes — Approve design, proceed to task generation" },
      { id: "b", label: "Minor tweaks — small changes needed (I'll ask what)" },
      { id: "c", label: "Major revision — significant redesign needed" },
      { id: "d", label: "More detail — expand specific sections" }
    ]
  }]
})
```
→ `"a"` : Update `metadata.json`: `designApproved: true`, proceed to Phase D
→ `"b"` : Ask "What minor tweaks would you like?" → update design → loop back
→ `"c"` : Ask "What's wrong with the approach?" → redesign → loop back
→ `"d"` : Present section expansion choices (see below)

9. Handle responses:
   - `[A]` → Update `metadata.json`: `designApproved: true, designApprovedAt: ISO-8601`, proceed to Phase D
   - `[B]` → Ask: "What minor tweaks would you like?" → update design → loop back to step 8
   - `[C]` → Ask: "What's wrong with the approach? What should it include instead?" → redesign → loop back
   - `[D]` → Use the AskQuestion tool:
     ```
     AskQuestion({
       questions: [{
         id: "expand_sections",
         prompt: "Which sections need more detail?",
         allow_multiple: true,
         options: [
           { id: "a", label: "Component architecture — responsibilities, interactions" },
           { id: "b", label: "Data models — schemas, relationships, validation" },
           { id: "c", label: "API contracts — endpoints, request/response formats" },
           { id: "d", label: "Implementation approach — step-by-step, technical decisions" }
         ]
       }]
     })
     ```
     → Expand selected sections → loop back to step 8

10. **This loop is MANDATORY** — CANNOT proceed without `[A]` approval

---

## Phase D: Task Generation Strategy

11. After approval, ask:

Use the AskQuestion tool:
```
AskQuestion({
  questions: [{
    id: "task_strategy",
    prompt: "✅ Design approved and saved. Current context has design revision history. Choose how to generate implementation tasks:",
    options: [
      { id: "a", label: "Generate now (Recommended) — fresh subagent, isolated context, ~40% quality improvement" },
      { id: "b", label: "Generate later — start a NEW Cursor session, run /requirements-specs-generate" }
    ]
  }]
})
```
→ `"a"` : proceed to Phase D.1
→ `"b"` : proceed to Phase D.2 (checkpoint)

---

## Phase D.1: Task Generation (If [A] chosen)

Show context isolation notice:
```
═══════════════════════════════════════════════════════════════════
CONTEXT ISOLATION — GENERATING WITH FRESH CONTEXT
═══════════════════════════════════════════════════════════════════

Using ONLY clean inputs:
✓ 07-design.md (approved)
✓ 06-requirements-spec.md
✓ 03-context-findings.md

Ignoring: conversation history, design revision artifacts
═══════════════════════════════════════════════════════════════════
```

Delegate to `agents/task-orchestrator.md`:
```yaml
TASK_ORCHESTRATOR_REQUEST:
  design_path: "[session]/07-design.md"
  requirements_path: "[session]/06-requirements-spec.md"
  context_findings_path: "[session]/03-context-findings.md"
  output_path: "[session]/08-tasks.md"
```
The orchestrator will select the appropriate strategy (Sequential / Hierarchical / Adaptive),
apply tier annotations (`_Agent Level: Junior/Mid/Senior_`) to each task, and write `08-tasks.md`.

**Task Sizing Rules (for orchestrator reference):**

| Component Size | Decomposition |
|----------------|---------------|
| ≤350 lines | ONE cohesive task |
| 350–700 lines | TWO related tasks (Core + Logic) |
| >700 lines | FIVE vertical slices |

**Vertical Slices (for >700 line components):**
1. **Data Foundation** — models, schemas, migrations, repositories
2. **Business Logic** — services, algorithms, workflows, validations
3. **API/Integration Layer** — endpoints, auth, external services
4. **User Interface** — components, forms, state binding (if applicable)
5. **Quality & Polish** — tests, documentation

**Task Template:**
```markdown
- [ ] **Task [N]: [Action Verb] [Component] [Outcome]**
  **Type**: Feature | Infrastructure | Integration | UI | Testing | Documentation
  **Size**: S (50-150 lines) | M (150-300 lines) | L (300-500 lines)
  **Dependencies**: Task [X], Task [Y] (or "None")

  **Sub-tasks** (specific file changes):
  - Create `path/to/file.ext` (~X lines)
  - Implement `methodName()` with [purpose] (~Y lines)
  - Add validation: [specific rules] (~Z lines)

  **Acceptance Criteria**:
  - [ ] [Specific, testable criterion from requirements]
  - [ ] Tests pass with >80% coverage

  **Verification Method**:
  - Run: `[test command]`
  - Check: [what to verify]
  - Confirm: [expected result]

  _Requirements: FR-X.Y, TR-Z_
  _Design: 07-design.md § [Section Name]_
  _Estimated: ~XXX lines_
```

**Phase Organization:**
```
Phase 1: Foundation & Data Layer     (models, migrations, repositories)
Phase 2: Business Logic & Services   (services, algorithms, workflows)
Phase 3: API & Integration Layer     (endpoints, auth, external services)
Phase 4: User Interface              (components, forms — if applicable)
Phase 5: Testing & Documentation     (tests, docs)
```

**Pre-output Validation Checklist:**
- [ ] 85%+ of tasks are 100–500 lines
- [ ] Each task delivers complete, working functionality (vertical slice)
- [ ] All FRs and TRs are covered
- [ ] Dependencies are minimized and acyclic
- [ ] Each task has specific acceptance criteria
- [ ] Each task references FR-X/TR-X

---

## Phase D.2: Checkpoint (If [B] chosen)

Update `metadata.json`:
```json
{
  "phase": "design_approved",
  "specs": {
    "designGenerated": true,
    "designApproved": true,
    "designApprovedAt": "ISO-8601-timestamp",
    "tasksGenerated": false,
    "taskGenerationPending": true
  }
}
```

Show:
```
═══════════════════════════════════════════════════════════════════
CHECKPOINT SAVED — DESIGN PHASE COMPLETE
═══════════════════════════════════════════════════════════════════

✅ 07-design.md approved and saved.
⏸️  Task generation DEFERRED per your request.

To generate tasks with 100% clean context:
1. Start a NEW Cursor session
2. Run: /requirements-specs-generate
3. Command will detect approved design → generate tasks only

Session: requirements/[folder]/
Status: design_approved (tasks pending)
═══════════════════════════════════════════════════════════════════
```

**STOP HERE.**

---

## Phase E: Finalization

---

**[Memory Bank Write-Back — Cursor — skip if unavailable]**

When `memoryBankMode = true` AND `08-tasks.md` has been successfully generated:

Extract the first task (Task 1) preview from `08-tasks.md`.

Call `mcp_user_memory_bank_write_file` with path `{projectName}/develop/T-001/plan-mode.md`:

```markdown
# Plan Mode — T-001: {first task description}

**Generated**: {timestamp}
**Session**: requirements/{session-folder}/

## Task Overview
{Task 1 description from 08-tasks.md}

## Sub-tasks Preview
{Sub-tasks list from Task 1}

## Design Reference
{Design section reference from Task 1}
```

If write fails: log warning, continue without blocking.

---

Update `metadata.json`:
```json
{
  "phase": "specs_complete",
  "specs": {
    "designGenerated": true,
    "designApproved": true,
    "tasksGenerated": true,
    "totalTasks": 35,
    "completedTasks": 0
  }
}
```

Show:
```
═══════════════════════════════════════════════════════════════════
GENERATION COMPLETE
═══════════════════════════════════════════════════════════════════

Files Generated:
✓ 07-design.md (approved)
✓ 08-tasks.md ([N] tasks)

Task Summary:
- Phase 1: Foundation ([N] tasks)
- Phase 2: Business Logic ([N] tasks)
- Phase 3: API Layer ([N] tasks)
- Phase 4: UI ([N] tasks)
- Phase 5: Testing ([N] tasks)

Traceability: [N] FRs + [N] TRs → [N] tasks

Ready for execution: /requirements-specs-execute
(Start a NEW Cursor session for optimal task execution quality)
═══════════════════════════════════════════════════════════════════
```

---

## Finding Requirements in Fresh Session

When starting fresh, the command will:

1. Check `.current-requirement` → use if exists
2. Scan `requirements/` for sessions with:
   - `phase: "design_approved"` → **PRIORITY** (task generation pending)
   - `phase: "requirements_complete"` → needs full specs
3. If multiple found, list them:
   ```
   Found requirements ready for specs generation:

   🔴 TASKS PENDING (approved design):
   1. 2025-11-08-1921-feature-name (design approved 2h ago)

   🟡 NEEDS FULL SPECS:
   2. 2025-11-07-1430-another-feature (1 day ago)

   Which requirement? (Enter the number or folder name)
   ```

---

## Error Handling

- **No active session** → suggest `/requirements-status`
- **Incomplete requirements** → show missing files, suggest completing
- **Specs already complete** → "Use /requirements-specs-execute"
- **User tries to skip validation** → enforce: "Design approval is required before tasks can be generated"
