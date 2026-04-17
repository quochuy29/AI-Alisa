# Requirements Specs Generate

Generate executable specification files (07-design.md, 08-tasks.md) from completed requirements gathering output.

---

## 🎯 CONTEXT ENGINEERING ARCHITECTURE

**Research-Backed Design**: This command implements the "Design-First, Task-Subagent" pattern based on 2025 context engineering research.

### The Problem: Context Rot

When design generation and task generation happen in the same session:
- Design validation loop accumulates revision history (potentially 3-5 rounds)
- By task generation time, 60-70% of context is "noise" (revision artifacts)
- Task quality degrades due to "context rot" (NoLiMa benchmark, Chroma research 2025)
- LLMs produce "summary of summaries" when context is polluted

### The Solution: Subagent Isolation

```
┌─────────────────────────────────────────────────────────────────────────┐
│  MAIN SESSION                                                           │
│  ├── Phase A: Load requirements (00-06)                                 │
│  ├── Phase B: Generate 07-design.md (creative synthesis)                │
│  ├── Phase C: Design validation loop (interactive, may iterate)         │
│  └── Phase D: Save approved design → CHECKPOINT                         │
│                                                                          │
│  ═══════════════════ CONTEXT BOUNDARY ═══════════════════               │
│                                                                          │
│  FRESH SUBAGENT (Isolated Context)                                      │
│  ├── Receives ONLY: 07-design.md, 06-requirements-spec.md,              │
│  │                  03-context-findings.md                               │
│  ├── NO conversation history                                             │
│  ├── NO design revision artifacts                                        │
│  └── Generates 08-tasks.md with FULL attention budget                   │
│                                                                          │
│  MAIN SESSION (Finalization)                                            │
│  └── Receive tasks → Write file → Update metadata → Show summary        │
└─────────────────────────────────────────────────────────────────────────┘
```

**Why This Works** (Anthropic, Google ADK guidance):
- "Context is a critical but finite resource" - Anthropic
- "Separate storage from presentation" - Google ADK
- Files serve as clean handoff artifacts between phases
- Different cognitive tasks (synthesis vs decomposition) benefit from isolation

---

## Description

This command completes the requirements gathering workflow by adding design and task specifications to the existing 7-file output. The generated files are developer-ready and implementation-focused.

**RECOMMENDED USAGE**: Run this in a **fresh session** after requirements gathering is complete. This provides:
- Better focus on technical architecture
- More accurate task breakdown
- Cleaner design documentation
- Reduced context overhead from the requirements phase

## Usage

**In a fresh session (Recommended):**
```bash
/requirements-specs-generate
```
The command will automatically find the most recent completed requirement or ask which one to use.

**In the same session as requirements gathering:**
```bash
/requirements-specs-generate
```
Will use the current active requirement, but this is not recommended due to context overhead.

**Specify a specific requirement:**
```bash
/requirements-specs-generate requirements/2025-11-08-1921-vnpay-module-analysis
```

## Prerequisites

- Must have a completed requirements gathering session
- Files 00-06 must exist in the requirement folder
- 06-requirements-spec.md must be complete with all sections
- Files 07-08 must NOT already exist (or user confirms overwrite)

---

## What This Command Does

### Phase A: Session Setup (Main Session)

1. **Locates Requirement Session**:
   - Checks for .current-requirement file OR
   - Accepts explicit path to requirement folder
   - Works in fresh session by finding the most recent completed requirement

2. **Detects Current State** (check metadata.json):

   **State A: Requirements Complete (`phase: "requirements_complete"`)**
   - Files 00-06 exist, no design yet
   - Proceed to Phase B (Generate Design)

   **State B: Design Approved, Tasks Pending (`phase: "design_approved"`)**
   - Files 00-07 exist, design approved, user deferred task generation
   - Skip to Phase D.1 (Generate Tasks in Fresh Session)
   - Display:
     ```
     ═══════════════════════════════════════════════════════════════════
     ║  RESUMING FROM APPROVED DESIGN                                  ║
     ║                                                                 ║
     ║  ✅ 07-design.md already approved (skipping design phase)       ║
     ║  📋 Generating 08-tasks.md with FRESH context                   ║
     ║                                                                 ║
     ║  This session has 100% clean context for optimal task quality.  ║
     ═══════════════════════════════════════════════════════════════════
     ```

   **State C: Specs Complete (`phase: "specs_complete"`)**
   - Files 00-08 exist, everything generated
   - Show error: "Specs already generated. Use /requirements-specs-execute"

3. **Validates Completeness**: Ensures required files exist based on state

4. **Loads Source Files**: Reads only necessary files into working context

### Phase B: Design Generation (Main Session)

4. **Generates 07-design.md**:
   - Creates technical architecture document
   - Writes to file IMMEDIATELY (checkpoint)
   - Updates metadata: `designGenerated: true`

### Phase C: Design Validation Loop (Main Session - Interactive)

5. **CRITICAL: Design Validation Loop** (MANDATORY):
   - Display the generated 07-design.md content (overview or full)
   - **Use AskUserQuestion tool** with enhanced validation options:
     - Question: "Is the design specification ok to proceed with task generation?"
     - 4 options:
       1. **"Yes - Approve"**: Design looks good, proceed to generate 08-tasks.md
       2. **"Minor tweaks needed"**: Small changes required (e.g., naming, details)
       3. **"Major revision needed"**: Significant changes required (e.g., wrong approach, missing components)
       4. **"Need more details"**: Design too high-level, expand specific sections
   - **If "Yes - Approve"**:
     - Update metadata: `designApproved: true`, `designApprovedAt: timestamp`
     - Proceed to Phase D
   - **If any other option**:
     - Ask follow-up questions (text-based) to understand changes needed
     - Update 07-design.md based on feedback
     - Show updated design
     - **Use AskUserQuestion again** with same 4 options
     - **REPEAT until user selects "Yes - Approve"**
   - **This loop is MANDATORY** - Cannot skip or proceed without approval

### Phase D: Task Generation Strategy Choice

6. **CRITICAL: Ask User for Task Generation Preference**:

   After design approval, present the user with a choice for how to generate tasks:

   ```
   ═══════════════════════════════════════════════════════════════════
   ║  DESIGN APPROVED - CHECKPOINT SAVED                             ║
   ║                                                                 ║
   ║  07-design.md has been approved and saved.                      ║
   ║  Current context contains design generation & validation noise. ║
   ║                                                                 ║
   ║  Choose how to proceed with task generation:                    ║
   ═══════════════════════════════════════════════════════════════════
   ```

   **Use AskUserQuestion tool for task generation preference**:
   ```json
   {
     "questions": [
       {
         "question": "How would you like to generate the implementation tasks (08-tasks.md)?",
         "header": "Task Gen",
         "multiSelect": false,
         "options": [
           {
             "label": "Generate now with subagent (Recommended)",
             "description": "Spawn a fresh subagent with isolated context. Best quality: subagent receives only clean inputs (design, requirements, patterns). No conversation noise. ~40% quality improvement."
           },
           {
             "label": "Generate later in fresh session",
             "description": "Save checkpoint and stop here. Run /requirements-specs-generate again in a NEW session for manually controlled context. Best for: reviewing design offline, complex features needing more thought."
           }
         ]
       }
     ]
   }
   ```

   **Handle Response**:

   **If "Generate now with subagent"** → Proceed to Phase D.1 (Subagent Spawn)
   **If "Generate later in fresh session"** → Proceed to Phase D.2 (Checkpoint & Stop)

---

### Phase D.1: Task Orchestrator Agent Invocation (If User Chose "Generate now")

   ```
   ═══════════════════════════════════════════════════════════════════
   ║  CONTEXT ISOLATION - INVOKING TASK ORCHESTRATOR AGENT           ║
   ║                                                                 ║
   ║  Current context pollution:                                     ║
   ║  - Design generation reasoning (noise) ✗                        ║
   ║  - Validation conversation history (noise) ✗                    ║
   ║  - Design revision artifacts (noise) ✗                          ║
   ║                                                                 ║
   ║  Task Orchestrator receives ONLY clean inputs + expert persona. ║
   ═══════════════════════════════════════════════════════════════════
   ```

   **Invoke the Task Orchestrator Agent**:

   The Task Orchestrator is a specialized agent defined in `.claude/agents/task-orchestrator.md` with:
   - Expert persona (Staff Software Architect with 15+ years experience)
   - Context7 integration for up-to-date library patterns
   - Codebase-aware instructions referencing existing patterns
   - Self-validation quality gate (80% threshold)

   **Invocation Command:**
   ```
   Use the task-orchestrator agent to generate 08-tasks.md from the approved design.

   Context files for this requirement session:
   - Design: [path]/07-design.md
   - Requirements: [path]/06-requirements-spec.md
   - Codebase Patterns: [path]/03-context-findings.md
   ```

   **Alternative: Use Task tool for subagent isolation**:
   ```
   Task(
     subagent_type: "general-purpose",
     description: "Generate implementation tasks",
     prompt: [Include full TASK_ORCHESTRATOR_PROMPT from .claude/agents/task-orchestrator.md]
   )
   ```

   The Task Orchestrator receives ONLY:
   - The approved 07-design.md content
   - The 06-requirements-spec.md content
   - The 03-context-findings.md content (codebase patterns)
   - Project CLAUDE.md (conventions)
   - Task Orchestrator persona and workflow instructions

   The agent does NOT receive:
   - Conversation history from design validation
   - Design revision artifacts
   - Any other session context

   **Quality Guarantees from Task Orchestrator:**
   - Every task includes exact file paths (not placeholders)
   - Every task has Context7-backed library patterns
   - Every task references existing codebase files
   - Every task has runnable verification command
   - Every task maps to FR-X.Y or TR-X requirements
   - Self-validated score ≥80% before output

   **After Task Orchestrator completes** → Proceed to Phase E (Finalization)

---

### Phase D.2: Checkpoint & Stop (If User Chose "Generate later")

   **Update metadata.json**:
   ```json
   {
     "phase": "design_approved",
     "specs": {
       "designGenerated": true,
       "designApproved": true,
       "designApprovedAt": "ISO-8601-timestamp",
       "designRevisions": 2,
       "tasksGenerated": false,
       "taskGenerationPending": true
     }
   }
   ```

   **Display checkpoint summary**:
   ```
   ═══════════════════════════════════════════════════════════════════
   ║  CHECKPOINT SAVED - DESIGN PHASE COMPLETE                       ║
   ═══════════════════════════════════════════════════════════════════

   ✅ Design approved and saved:
      → 07-design.md (approved after X revisions)

   ⏸️  Task generation DEFERRED per your request.

   📋 To generate tasks in a fresh session:
      1. Start a NEW Claude session (clean context)
      2. Run: /requirements-specs-generate
      3. Command will detect approved design and generate tasks only

   💡 Why fresh session?
      - 100% clean context (no design revision noise)
      - Full attention budget for task decomposition
      - Optimal task instruction quality

   Session: requirements/YYYY-MM-DD-HHMM-[feature-slug]/
   Status: design_approved (tasks pending)
   ═══════════════════════════════════════════════════════════════════
   ```

   **STOP HERE** - Do not generate tasks. Session ends.

### Phase E: Finalization (Main Session)

7. **Receive and Save Tasks**:
   - Receive 08-tasks.md content from subagent
   - Write to file
   - Parse total task count

8. **Updates metadata.json**:
   ```json
   {
     "phase": "specs_complete",
     "specs": {
       "designGenerated": true,
       "designApproved": true,
       "designApprovedAt": "ISO-8601-timestamp",
       "tasksGenerated": true,
       "taskGenerationMethod": "subagent-isolated",
       "totalTasks": 35,
       "completedTasks": 0
     }
   }
   ```

9. **Shows Summary**: Displays what was generated and next steps

---

## 🤖 TASK ORCHESTRATOR AGENT REFERENCE

**IMPORTANT**: The Task Orchestrator agent is now defined in `.claude/agents/task-orchestrator.md`.

The agent provides:
- **Expert Persona**: "Marcus Chen" - Staff Software Architect with 15+ years experience
- **Context7 Integration**: Mandatory library documentation lookup before task generation
- **Codebase Awareness**: References existing patterns from 03-context-findings.md
- **Self-Validation**: 8-dimension quality gate with 80% threshold
- **Execution-Ready Output**: Exact file paths, method signatures, verification commands

**To invoke directly**: `Use the task-orchestrator agent to generate 08-tasks.md from the approved design.`

---

## 📋 FALLBACK: Inline Task Generation Prompt

If the Task Orchestrator agent is unavailable or you need to use the Task tool with a general-purpose subagent, use this prompt:

```markdown
You are a task decomposition specialist. Generate 08-tasks.md from the approved design specification.

## YOUR MISSION

Transform the approved design into implementation tasks that are:
- **Modular**: High cohesion within tasks, low coupling between tasks
- **Right-sized**: 100-500 lines of code changes per task (sweet spot: 200-350)
- **Vertical slices**: Each task delivers complete, working functionality
- **Verifiable**: Clear acceptance criteria and verification methods

## INPUT FILES

You have been provided with THREE files. Read and analyze them carefully:

### 1. 07-design.md (AUTHORITATIVE - Approved Design)
This is the approved technical design. Your tasks MUST implement this design exactly.
- Architecture and component structure
- Data models and schemas
- API contracts and interfaces
- Algorithm specifications
- Error handling strategies

### 2. 06-requirements-spec.md (Requirements & Acceptance Criteria)
Contains the functional and technical requirements your tasks must satisfy:
- FR-X: Functional Requirements with acceptance criteria (AC-X.Y)
- TR-X: Technical Requirements with measurable criteria
- User stories and success metrics

### 3. 03-context-findings.md (Codebase Patterns)
Contains existing codebase patterns and conventions to follow:
- File structure conventions
- Naming patterns
- Existing similar features
- Integration points

## TASK SIZING ALGORITHM

### Step 1: Estimate Component Size
For each component in 07-design.md:
- Data model: 50-150 lines
- API endpoint: 80-150 lines
- Business algorithm: 100-200 lines
- UI component: 150-250 lines
- External integration: 200-300 lines

### Step 2: Apply Decomposition Rules

**If component ≤350 lines**: ONE cohesive task
```
Example: "Create User Profile API with model, endpoints, and tests"
```

**If component 350-700 lines**: TWO related tasks
```
Task 1 (Core): Data models, basic structure (~50%)
Task 2 (Logic): Business rules, API endpoints (~50%)
```

**If component >700 lines**: FIVE vertical slices
```
Slice 1: Data Foundation (20-25%)
  - Data models and schemas
  - Database migrations
  - Repository/DAO pattern
  - Basic CRUD operations

Slice 2: Core Business Logic (30-35%)
  - Business rules and validations
  - Service layer implementation
  - Core workflows and state management

Slice 3: API/Integration Layer (20-25%)
  - REST/GraphQL endpoints
  - Request/response validation
  - Authentication/authorization
  - External service integrations

Slice 4: User Interface (20-25%, if applicable)
  - UI components and forms
  - State management
  - User interactions

Slice 5: Quality & Polish (15-20%)
  - Unit tests
  - Integration tests
  - Documentation
```

## TASK STRUCTURE TEMPLATE

For EACH task, use this EXACT structure:

```markdown
- [ ] **Task [N]: [Action Verb] [Component Name] [Expected Outcome]**
  **Type**: Feature | Infrastructure | Integration | UI | Testing | Documentation
  **Size**: S (50-150 lines) | M (150-300 lines) | L (300-500 lines)
  **Dependencies**: Task [X], Task [Y] (or "None")

  **Sub-tasks** (specific file changes):
  - Create file: `path/to/file.ext` (~X lines)
  - Implement method: `methodName()` with [purpose] (~Y lines)
  - Add validation: [specific rules] (~Z lines)
  - Handle errors: [specific scenarios]

  **Acceptance Criteria** (must be verifiable):
  - [ ] [Specific, testable criterion from requirements]
  - [ ] [Another criterion]
  - [ ] Tests pass with >80% coverage

  **Verification Method** (how to confirm completion):
  - Run: `[test command]`
  - Check: [what to verify]
  - Confirm: [expected result]

  _Requirements: FR-X.Y, TR-Z_
  _Design: 07-design.md § [Section Name]_
  _Estimated: XXX lines of code_
```

## ORGANIZATION: LOGICAL PHASES

Group tasks into phases:

**Phase 1: Foundation & Data Layer**
- Database schemas, models, migrations, repositories

**Phase 2: Business Logic & Services**
- Service layer, algorithms, workflows, state management

**Phase 3: API & Integration Layer**
- API endpoints, external integrations, authentication

**Phase 4: User Interface** (if applicable)
- UI components, forms, pages, state binding

**Phase 5: Testing & Documentation**
- Unit tests, integration tests, documentation

## VALIDATION CHECKLIST (Complete Before Output)

Before generating output, verify ALL checks pass:

- [ ] **Size Check**: 85%+ of tasks are 100-500 lines
- [ ] **Vertical Slice Check**: Each task delivers complete functionality
- [ ] **Coverage Check**: All FRs and TRs from requirements are covered
- [ ] **Dependency Check**: Dependencies are minimized and acyclic
- [ ] **Verifiability Check**: Each task has specific acceptance criteria
- [ ] **Traceability Check**: Each task references FR-X/TR-X from requirements

If ANY check fails, revise tasks before outputting.

## OUTPUT FORMAT

Generate the complete 08-tasks.md file with:

1. Header with feature name and generation timestamp
2. Summary statistics (total tasks, by phase, by size)
3. Tasks organized by phase
4. Each task using the exact template above
5. Requirements traceability matrix at the end

Begin generating 08-tasks.md now.
```

---

## Transformation Logic

### Existing Requirements Files (Already Generated)

The following files already serve as comprehensive requirements documentation:
- **00-initial-request.md** - Original user request and context
- **01-discovery-questions.md** - Context discovery questions with AI research
- **02-discovery-answers.md** - User's scope and priority answers
- **03-context-findings.md** - Technical analysis and codebase insights
- **04-detail-questions.md** - Expert-level technical questions
- **05-detail-answers.md** - Implementation decisions and choices
- **06-requirements-spec.md** - Complete formal requirements specification

These files together provide the user stories, acceptance criteria, and requirements context.

### 07-design.md Generation
**Source**: `06-requirements-spec.md` sections 4-5 + `03-context-findings.md`

**Transforms**:
- Technical Requirements → Components and Interfaces
- Implementation Hints → Architecture section
- File structures → Component documentation
- Data models → Data Models section
- Algorithms/pseudocode → Algorithm Details

**Format**:
```markdown
# Design Document: [Feature Name]
## Overview
## Architecture
### High-Level Flow (mermaid diagram)
### Integration Points
## Components and Interfaces
## Data Models
## Error Handling
## Testing Strategy
## Algorithm Details
```

**CRITICAL - Validation Process**:
After generating 07-design.md, the command MUST:

1. **Write 07-design.md to file**

2. **Update metadata.json**:
   ```json
   {
     "phase": "specs_generated",
     "specs": {
       "designGenerated": true,
       "designApproved": false
     }
   }
   ```

3. **Display the design** (show key sections or full content overview)

4. **Use AskUserQuestion tool for validation**:
   ```json
   {
     "questions": [
       {
         "question": "Is the design specification ok to proceed with task generation?",
         "header": "Design OK?",
         "multiSelect": false,
         "options": [
           {
             "label": "Yes - Approve",
             "description": "Design looks good. Proceed to generate implementation tasks (08-tasks.md) using fresh subagent for optimal quality."
           },
           {
             "label": "Minor tweaks needed",
             "description": "Small changes required. I'll ask what to adjust, update the design, and show you again. Common: component naming, architecture details, implementation approach."
           },
           {
             "label": "Major revision needed",
             "description": "Significant changes required. I'll ask for detailed feedback, redesign, and show updated version. Use if: wrong approach, missing components, architecture doesn't fit."
           },
           {
             "label": "Need more details",
             "description": "Design is too high-level. I'll expand specific sections you specify: component details, data models, API contracts, or implementation steps."
           }
         ]
       }
     ]
   }
   ```

5. **Wait for user response** - CANNOT proceed without response

6. **Handle Response**:

   **If "Yes - Approve"**:
   - Update metadata.json:
     ```json
     {
       "specs": {
         "designApproved": true,
         "designApprovedAt": "ISO-8601-timestamp"
       }
     }
     ```
   - **SPAWN FRESH SUBAGENT** for task generation (see Phase D above)

   **If "Minor tweaks needed"**:
   - Ask: "What minor tweaks would you like? (component names, architecture details, implementation approach, etc.)"
   - Wait for text response
   - Update 07-design.md based on feedback
   - Show updated sections
   - **Use AskUserQuestion again** (return to step 4)

   **If "Major revision needed"**:
   - Ask detailed follow-up: "What's wrong with the current approach? What should the design include instead?"
   - Wait for detailed text response
   - Significantly regenerate 07-design.md
   - Show new design
   - **Use AskUserQuestion again** (return to step 4)

   **If "Need more details"**:
   - Use AskUserQuestion with multiSelect:
     ```json
     {
       "questions": [
         {
           "question": "Which sections need more detail?",
           "header": "Expand",
           "multiSelect": true,
           "options": [
             {"label": "Component architecture", "description": "Expand component descriptions, responsibilities, interactions"},
             {"label": "Data models", "description": "Add detailed schemas, relationships, validation rules"},
             {"label": "API contracts", "description": "Show endpoints, request/response formats, authentication"},
             {"label": "Implementation approach", "description": "Add step-by-step guidance, technical decisions"}
           ]
         }
       ]
     }
     ```
   - Expand selected sections
   - Show updated design
   - **Use AskUserQuestion again** (return to step 4)

7. **Loop continues** until user selects "Yes - Approve"

**This validation is MANDATORY and CANNOT be skipped.**

---

### 08-tasks.md Generation - SUBAGENT ISOLATED

**CRITICAL CHANGE**: Task generation now happens in a FRESH SUBAGENT, not in the main session.

**Why Subagent Isolation?**
- Design validation may iterate 3-5 times, accumulating context noise
- Task decomposition is analytical work requiring focused attention
- Research shows 50%+ quality degradation with polluted context (NoLiMa 2025)
- Subagent receives only clean, necessary inputs

**Source Files for Subagent**:
- `07-design.md` - Approved design (AUTHORITATIVE)
- `06-requirements-spec.md` - Requirements and acceptance criteria
- `03-context-findings.md` - Codebase patterns and conventions

**Subagent Does NOT Receive**:
- Conversation history
- Design revision artifacts
- Validation loop context
- Any other session state

**Optimization Goal**: Generate tasks that are modular, right-sized (100-500 lines), user-confirmable, and deliver complete functionality.

#### Task Sizing Guidelines

**Estimation by Component Type:**
- Each data model: 50-150 lines (simple to complex)
- Each API endpoint: 80-150 lines (basic to with validation)
- Each business algorithm: 100-200 lines (simple to complex)
- Each UI component: 150-250 lines (basic to interactive)
- Each external integration: 200-300 lines (simple to complex with error handling)

#### Task Decomposition Strategy

**Decision Tree:**

1. **If component ≤350 lines**: Create ONE cohesive task
   - Example: "Create User Profile API with model, endpoints, and tests"
   - Keeps related code together for easy review

2. **If component 350-700 lines**: Split into TWO related tasks
   - Task 1 (Core): Data models, basic structure, migrations (~50%)
   - Task 2 (Logic): Business rules, API endpoints, integration (~50%)
   - Maintains logical flow while keeping review manageable

3. **If component >700 lines**: Apply VERTICAL SLICING (5 slices)
   - Each slice delivers working functionality across all layers
   - See vertical slicing pattern in subagent prompt

#### Task Quality Examples

**GOOD Task** (Vertical Slice):
```
Task 3: Create User Authentication API with JWT
- Create User model with password hashing
- Add POST /auth/login endpoint with validation
- Implement JWT token generation
- Add authentication middleware
- Write integration tests for auth flow
Size: M (280 lines) | Delivers: Working authentication
```

**BAD Task** (Horizontal Slice):
```
Task 1: Create all database models
- Create User model
- Create Post model
- Create Comment model
Size: L (450 lines) | Delivers: Just models, no functionality
```

---

## Output Structure

```
requirements/YYYY-MM-DD-HHMM-[feature-slug]/
├── 00-initial-request.md          (existing)
├── 01-discovery-questions.md      (existing)
├── 02-discovery-answers.md        (existing)
├── 03-context-findings.md         (existing)
├── 04-detail-questions.md         (existing)
├── 05-detail-answers.md           (existing)
├── 06-requirements-spec.md        (existing)
├── 07-design.md                   ← Generated (Phase B)
├── 08-tasks.md                    ← Generated (Phase D - Subagent)
└── metadata.json                  (updated)
```

## Finding Requirements in Fresh Session

When starting a fresh session, the command will:

1. **Check for .current-requirement**: If exists, use that requirement

2. **Scan requirements/ folder**: Find requirements ready for specs work
   - `phase: "requirements_complete"` → Needs design + tasks
   - `phase: "design_approved"` → Needs tasks only (PRIORITY - user deferred)

3. **Prioritize design_approved** (tasks pending):
   ```
   ═══════════════════════════════════════════════════════════════════
   ║  FOUND PENDING TASK GENERATION                                  ║
   ═══════════════════════════════════════════════════════════════════

   📋 2025-11-08-1921-vnpay-module-analysis
      Status: design_approved (tasks pending)
      Design approved: 2 hours ago

   This requirement has an approved design waiting for task generation.
   Proceeding with 08-tasks.md generation in fresh context...
   ```

4. **List candidates** if multiple or no pending:
   ```
   Found requirements ready for specs generation:

   🔴 TASKS PENDING (approved design, fresh session requested):
   1. 2025-11-08-1921-vnpay-module-analysis (design approved 2h ago)

   🟡 NEEDS FULL SPECS (requirements complete):
   2. 2025-11-07-1430-user-profile-feature (1 day ago)
   3. 2025-11-06-0900-export-reports (2 days ago)

   Which requirement would you like to work on?
   ```

5. **Auto-select** if only one requirement exists in either state

6. **Validate**: Ensure required files exist based on detected state

---

## Example Complete Flow

### Step 1: Design Generation (Main Session)
```
📐 Generating Design Specification...

Location: requirements/2025-11-08-1921-vnpay-module-analysis/

Loading source files:
✓ 06-requirements-spec.md (8 FRs, 7 TRs, 7 deliverables)
✓ 03-context-findings.md (module architecture, existing patterns)
✓ 05-detail-answers.md (implementation choices)

Generating 07-design.md...
✓ Overview section
✓ Architecture diagrams (4 mermaid diagrams)
✓ Component specifications (7 components)
✓ Data models (3 models)
✓ Algorithm details
✓ Error handling strategies
✓ Testing strategy

Design generated! (07-design.md)
```

### Step 2: Design Validation (Main Session - Interactive)
```
📐 Design Specification Generated (07-design.md)

═══════════════════════════════════════════════
DESIGN OVERVIEW
═══════════════════════════════════════════════

## Architecture
- Component-based documentation system
- 7 deliverable groups (architecture, flows, security, etc.)
- Mermaid.js for diagrams
- Markdown for documentation

## Key Components
1. Architecture Documentation Generator
2. Payment Flow Diagram Builder
3. Security Analysis Module
4. Troubleshooting Guide Generator
5. Maintenance Task Documenter
6. API Reference Builder
7. Visual Diagram Renderer

## Data Models
- Documentation Template
- Section Configuration
- Diagram Definition
[... more details ...]

═══════════════════════════════════════════════
```

**[AskUserQuestion shown with 4 options]**

User selects: "Minor tweaks needed"
Claude: "What minor tweaks would you like?"
User: "Add more detail to the security analysis section"
Claude: [Updates design, shows changes]

**[AskUserQuestion shown again]**

User selects: "Yes - Approve"

### Step 3: Task Generation Choice
```
✅ Design approved!

═══════════════════════════════════════════════════════════════════
DESIGN APPROVED - CHECKPOINT SAVED
═══════════════════════════════════════════════════════════════════

07-design.md has been approved and saved.
Current context contains design generation & validation noise.

Choose how to proceed with task generation:
```

**[AskUserQuestion shown with 2 options]**

---

## Example Flow A: Generate Now with Subagent

User selects: "Generate now with subagent (Recommended)"

### Step 3A: Context Isolation & Subagent Spawn
```
═══════════════════════════════════════════════════════════════════
CONTEXT ISOLATION - SPAWNING FRESH SUBAGENT
═══════════════════════════════════════════════════════════════════

Current context pollution:
- Design generation reasoning (noise) ✗
- 2 rounds of validation conversation (noise) ✗
- Design revision artifacts (noise) ✗

Subagent will receive ONLY clean inputs:
- 07-design.md (approved, 847 lines)
- 06-requirements-spec.md (requirements, 423 lines)
- 03-context-findings.md (patterns, 312 lines)
- Task generation instructions

═══════════════════════════════════════════════════════════════════
```

### Step 4: Task Generation (Subagent - Isolated)
```
🤖 Task Generation Subagent Started

Reading input files...
✓ 07-design.md (approved design)
✓ 06-requirements-spec.md (8 FRs, 7 TRs)
✓ 03-context-findings.md (codebase patterns)

Analyzing component complexity...
✓ Component 1: ~280 lines → 1 task
✓ Component 2: ~520 lines → 2 tasks
✓ Component 3: ~180 lines → 1 task
✓ Component 4: ~340 lines → 1 task
✓ Component 5: ~890 lines → 5 tasks (vertical slicing)
✓ Component 6: ~150 lines → 1 task
✓ Component 7: ~420 lines → 2 tasks

Organizing into phases...
✓ Phase 1: Foundation (8 tasks)
✓ Phase 2: Business Logic (12 tasks)
✓ Phase 3: API Layer (7 tasks)
✓ Phase 4: Documentation (5 tasks)
✓ Phase 5: Testing (3 tasks)

Validating task quality...
✓ Size check: 94% tasks in 100-500 line range
✓ Vertical slice check: All tasks deliver complete functionality
✓ Coverage check: All 8 FRs and 7 TRs covered
✓ Traceability: All tasks reference requirements

Generating 08-tasks.md...
```

### Step 5: Finalization (Main Session)
```
✅ Task generation complete!

Received from subagent:
✓ 08-tasks.md (35 tasks across 5 phases)

Writing to file...
✓ 08-tasks.md saved

Updating metadata...
✓ phase: "specs_complete"
✓ tasksGenerated: true
✓ taskGenerationMethod: "subagent-isolated"
✓ totalTasks: 35

═══════════════════════════════════════════════
GENERATION COMPLETE
═══════════════════════════════════════════════

Files Generated:
✓ 07-design.md (approved after 2 revisions)
✓ 08-tasks.md (35 tasks, generated with isolated context)

Task Summary:
- Phase 1: Foundation & Data Layer (8 tasks)
- Phase 2: Business Logic & Services (12 tasks)
- Phase 3: API & Integration Layer (7 tasks)
- Phase 4: Documentation (5 tasks)
- Phase 5: Testing (3 tasks)

Traceability:
- 8 Functional Requirements → covered in design → 35 tasks
- 7 Technical Requirements → 7 Component Specs → mapped to tasks

Quality Metrics:
- Task sizing: 94% in optimal range (100-500 lines)
- Context isolation: Task generation used fresh subagent
- Estimated improvement: ~40% higher task instruction quality

Ready for execution: /requirements-specs-execute
```

---

## Example Flow B: Generate Later in Fresh Session

User selects: "Generate later in fresh session"

### Step 3B: Checkpoint & Stop (Session 1)
```
═══════════════════════════════════════════════════════════════════
CHECKPOINT SAVED - DESIGN PHASE COMPLETE
═══════════════════════════════════════════════════════════════════

✅ Design approved and saved:
   → 07-design.md (approved after 2 revisions)

⏸️  Task generation DEFERRED per your request.

📋 To generate tasks in a fresh session:
   1. Start a NEW Claude session (clean context)
   2. Run: /requirements-specs-generate
   3. Command will detect approved design and generate tasks only

💡 Why fresh session?
   - 100% clean context (no design revision noise)
   - Full attention budget for task decomposition
   - Optimal task instruction quality

Session: requirements/2025-11-08-1921-vnpay-module-analysis/
Status: design_approved (tasks pending)
═══════════════════════════════════════════════════════════════════
```

**[Session 1 ends here - user starts new session later]**

---

### Step 4B: Fresh Session Task Generation (Session 2)

User starts new Claude session and runs: `/requirements-specs-generate`

```
═══════════════════════════════════════════════════════════════════
FOUND PENDING TASK GENERATION
═══════════════════════════════════════════════════════════════════

📋 2025-11-08-1921-vnpay-module-analysis
   Status: design_approved (tasks pending)
   Design approved: 2 hours ago

This requirement has an approved design waiting for task generation.

═══════════════════════════════════════════════════════════════════
RESUMING FROM APPROVED DESIGN
═══════════════════════════════════════════════════════════════════

✅ 07-design.md already approved (skipping design phase)
📋 Generating 08-tasks.md with FRESH context

This session has 100% clean context for optimal task quality.
═══════════════════════════════════════════════════════════════════

Loading files for task generation:
✓ 07-design.md (approved design)
✓ 06-requirements-spec.md (requirements)
✓ 03-context-findings.md (codebase patterns)

Generating 08-tasks.md...
```

### Step 5B: Finalization (Session 2)
```
✅ Task generation complete!

✓ 08-tasks.md (35 tasks across 5 phases)

Updating metadata...
✓ phase: "specs_complete"
✓ tasksGenerated: true
✓ taskGenerationMethod: "fresh-session"
✓ totalTasks: 35

═══════════════════════════════════════════════════════════════════
GENERATION COMPLETE
═══════════════════════════════════════════════════════════════════

Files Generated:
✓ 07-design.md (approved in previous session)
✓ 08-tasks.md (35 tasks, generated with 100% fresh context)

Quality Metrics:
- Task sizing: 94% in optimal range (100-500 lines)
- Context: 100% clean (manual fresh session)
- Zero noise from design validation

Ready for execution: /requirements-specs-execute
```

---

## Design Validation Rules

**STRICT ENFORCEMENT:**

1. **Show Full or Summary Design**: Display enough of 07-design.md for user to evaluate
   - Show all section headers
   - Show key architectural decisions
   - Show component list
   - Show data models overview
   - Option to show full file if user requests

2. **Use AskUserQuestion Tool**: Present 4 structured options via visual interface

3. **Handle Design Validation Selection**:
   - **"Yes - Approve"** → Update metadata, proceed to task generation choice
   - **"Minor tweaks needed"** → Ask follow-up (text), update design, use AskUserQuestion again
   - **"Major revision needed"** → Ask detailed follow-up, redesign, use AskUserQuestion again
   - **"Need more details"** → Use multiSelect AskUserQuestion for sections, expand, use AskUserQuestion again

4. **Handle Task Generation Choice** (after design approval):
   - **"Generate now with subagent"** → Spawn fresh subagent, generate tasks
   - **"Generate later in fresh session"** → Save checkpoint, stop session

5. **Update Loop**:
   - Parse user's requested changes from follow-up text
   - Update 07-design.md
   - Save updated file
   - Show updated sections
   - **Use AskUserQuestion again** with same 4 options
   - **NO LIMIT on iterations** - keep looping until "Yes - Approve"

6. **Cannot Bypass**:
   - NEVER generate 08-tasks.md before design approval
   - NEVER assume approval
   - ALWAYS wait for explicit "Yes - Approve" selection
   - ALWAYS ask task generation preference after approval
   - If user tries to skip, remind them of validation requirement

---

## Error Handling

- **No Active Session**: Shows error and suggests `/requirements-status`
- **Incomplete Requirements**: Shows what's missing and suggests completing gathering
- **Missing Files**: Shows which required files are missing
- **Parse Errors**: Shows which section failed to parse and why
- **User Tries to Skip Validation**: Firmly require design approval before proceeding
- **Subagent Failure**: Retry once, then fall back to main session generation with warning

---

## Metadata Schema

```json
{
  "id": "feature-slug",
  "started": "ISO-8601-timestamp",
  "lastUpdated": "ISO-8601-timestamp",
  "status": "active|complete|incomplete",
  "phase": "requirements_complete|specs_generated|design_approved|specs_complete",
  "specs": {
    "designGenerated": true,
    "designApproved": true,
    "designApprovedAt": "ISO-8601-timestamp",
    "designRevisions": 2,
    "tasksGenerated": true,
    "taskGenerationMethod": "subagent-isolated|fresh-session",
    "taskGenerationPending": false,
    "totalTasks": 35,
    "completedTasks": 0,
    "tasksByPhase": {
      "foundation": 8,
      "businessLogic": 12,
      "apiLayer": 7,
      "documentation": 5,
      "testing": 3
    }
  }
}
```

**Phase States:**
- `requirements_complete` - Files 00-06 complete, ready for design generation
- `specs_generated` - Design generated but NOT yet approved (in validation loop)
- `design_approved` - Design approved, tasks pending (user chose to defer)
- `specs_complete` - Both 07-design.md and 08-tasks.md generated

**Task Generation Methods:**
- `subagent-isolated` - Generated via fresh subagent in same session
- `fresh-session` - Generated in manually started fresh session (user deferred)

---

## Notes

- This command has **TWO REQUIRED interaction points**:
  1. Design validation (4 options until approval)
  2. Task generation choice (subagent now OR fresh session later)
- **07-design.md validation is MANDATORY** - cannot be skipped
- User must explicitly approve design before proceeding
- Design can be revised unlimited times until user is satisfied
- **Task generation offers TWO paths** for context isolation:
  - **Subagent (Recommended)**: Fresh context in same session (~40% quality improvement)
  - **Fresh Session**: Manual control, 100% clean context, allows design review time
- Output specs are executable by `/requirements-specs-execute`
- Maintains full traceability from implementation back to user goals
- Uses MCP tools for intelligent content generation

**Context Engineering Principles Applied:**
- Files serve as clean checkpoints between phases
- Two isolation strategies: subagent boundary OR session boundary
- Design (creative synthesis) and Tasks (analytical decomposition) are separated
- User choice respects different workflow preferences
- Quality over quantity in context management

---

## Related Commands

- `/requirements-status` - Check current requirement status
- `/requirements-specs-execute` - Execute the generated specs
- `/requirements-current` - View current requirement details
