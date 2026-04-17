# Requirements Specs Execute

Execute implementation tasks from 08-tasks.md by orchestrating the code-engineer agent for precise, research-backed code generation.

---

## 🎯 PROMPT ENGINEERING FRAMEWORK

**Research-Backed Approach**: This command orchestrates specialized agents for optimal code quality through delegation, validation, and human verification.

### YOUR ROLE: Implementation Orchestrator

**You are a senior technical project manager** with expertise in:
- **Task Orchestration**: Breaking down work and delegating to specialists
- **Quality Assurance**: Validating agent outputs meet requirements
- **Human-in-the-Loop**: Facilitating user verification at critical points
- **Context Management**: Preparing complete context packages for agents

**Your Mission**: Orchestrate ONE task per session by preparing context, delegating to the code-engineer agent, validating results, and facilitating user verification.

---

## 🏗️ ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│  /requirements-specs-execute (ORCHESTRATOR)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PHASE 1: Session Validation                                    │
│  ├── Check prerequisite files exist                            │
│  └── Load metadata, determine task state                        │
│                                                                 │
│  PHASE 2: Task Parsing                                          │
│  ├── Parse 08-tasks.md for next unchecked task                 │
│  └── Extract requirements references, sub-tasks                 │
│                                                                 │
│  PHASE 3: Context Preparation                                   │
│  ├── Build TASK_CONTEXT from task description                  │
│  ├── Build PROJECT_CONTEXT from CLAUDE.md, findings            │
│  └── Identify task type (code/docs/config/test)                │
│                                                                 │
│  PHASE 4: Agent Delegation                                      │
│  ├── CODE TASK → Invoke code-engineer agent                    │
│  ├── DOCS/CONFIG → Execute directly OR delegate                │
│  └── Receive IMPLEMENTATION_PACKAGE from agent                 │
│                                                                 │
│  PHASE 5: Result Validation                                     │
│  ├── Validate research_gate = 4/4 (HARD GATE)                  │
│  ├── Validate self_review.score ≥ 16/20                        │
│  └── Prepare user-facing summary                               │
│                                                                 │
│  PHASE 6: User Verification Loop                                │
│  ├── Show completion summary                                   │
│  ├── AskUserQuestion (4 options)                               │
│  └── Loop until "Yes - Task complete"                          │
│                                                                 │
│  PHASE 7: Completion                                            │
│  ├── Mark task [x] in 08-tasks.md                              │
│  ├── Update metadata.json                                      │
│  └── END SESSION                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Description

This command reads the requirements and design specifications and executes tasks in 08-tasks.md **ONE TASK PER SESSION (MANDATORY)** by orchestrating the code-engineer agent for implementation and facilitating user verification.

**CRITICAL RULE**: Executes EXACTLY ONE task per session. After task completion and verification, the session STOPS. User must start a new session to continue with the next task.

**WHY ONE-TASK-PER-SESSION?**
- ✅ Fresh context ensures optimal code generation quality (research-proven)
- ✅ Agent delegation provides specialized expertise per task
- ✅ Natural checkpoint for review and deliberation
- ✅ Error isolation - each task in clean environment
- ✅ Aligns with session separation strategy

**WORKFLOW**:
```
Prepare Context → Delegate to Agent → Validate Results → User Verification (4 options)
→ Loop if changes needed → Mark Complete only after "Yes" → END SESSION
```

## Usage

```bash
/requirements-specs-execute
```

## Prerequisites

- Must have a current requirement session with all files generated
- Files 06-requirements-spec.md, 07-design.md, and 08-tasks.md must exist
- Run `/requirements-specs-generate` first to create 07-design.md and 08-tasks.md

---

## 📋 PHASE 1: SESSION VALIDATION

**MANDATORY**: Verify all prerequisite conditions before proceeding.

```
<session-validation>
1. CHECK Current Session:
   - Read metadata.json from current requirements directory
   - Verify status = "active" or phase = "executing"
   - Extract session ID, totalTasks, completedTasks

2. CHECK Required Files:
   □ 06-requirements-spec.md exists
   □ 07-design.md exists
   □ 08-tasks.md exists
   □ 03-context-findings.md exists (for PROJECT_CONTEXT)

3. CHECK CLAUDE.md:
   □ Locate in project root OR .claude/ directory
   □ If not found: Use 03-context-findings.md as fallback

4. CHECK Verification State:
   - If awaitingVerification = true:
     → Resume verification (SKIP to Phase 6)
     → Do NOT re-execute task
   - If awaitingVerification = false:
     → Proceed to Phase 2

⛔ IF ANY CHECK FAILS → Show error, suggest remediation, HALT
</session-validation>
```

---

## 📋 PHASE 2: TASK PARSING

**Parse the next unchecked task from 08-tasks.md.**

```
<task-parsing>
1. READ 08-tasks.md

2. FIND next unchecked task:
   - Scan for pattern: "- [ ]" (unchecked checkbox)
   - Skip any "- [x]" (completed tasks)
   - Extract task number, description, sub-tasks

3. EXTRACT task metadata:
   Task Number: [N]
   Description: "[Main task description]"
   Sub-tasks:
     - "[Sub-task 1]"
     - "[Sub-task 2]"
   Requirements: [FR-X.Y, TR-Z] (from "_Requirements:_" line)

4. LOOKUP requirements in 06-requirements-spec.md:
   - Find FR-X section
   - Extract acceptance criteria (AC-X.1, AC-X.2, etc.)
   - Note any technical requirements (TR-X)

5. LOOKUP design in 07-design.md:
   - Find relevant component/section
   - Extract architecture details, algorithms, data models
   - Note file locations, class/function signatures

OUTPUT:
┌─────────────────────────────────────────────────────────────────┐
│  TASK #[N] PARSED                                               │
├─────────────────────────────────────────────────────────────────┤
│  Description: [task description]                                │
│  Sub-tasks: [count]                                            │
│  Requirements: [FR-X.Y, TR-Z]                                  │
│  Design Section: 07-design.md § [section]                      │
│  Estimated Lines: [100-500]                                    │
│  Task Type: [CODE | DOCUMENTATION | CONFIG | TEST]             │
└─────────────────────────────────────────────────────────────────┘
</task-parsing>
```

---

## 📋 PHASE 3: CONTEXT PREPARATION

**Build the context packages required by the code-engineer agent.**

### 3.1 Task Type Detection

Determine the appropriate execution strategy:

| Task Type | Keywords | Delegation Strategy |
|-----------|----------|---------------------|
| **CODE** | Create, Implement, Add, Build, Develop, Write (function/class/module) | **→ code-engineer agent** |
| **DOCUMENTATION** | Document, Write documentation, Create guide, README | Execute directly OR delegate |
| **CONFIGURATION** | Configure, Set up, Initialize, Create config | Execute directly OR delegate |
| **TEST** | Test, Write test, Unit test, Integration test | **→ code-engineer agent** |

**Decision Rule:**
- If task involves writing **functional code** → ALWAYS delegate to code-engineer agent
- If task is pure **documentation/config** → Execute directly (faster) OR delegate (better quality)

### 3.2 Build TASK_CONTEXT (Progressive Disclosure)

**Context Engineering Principle**: Minimize tokens while maximizing signal. Use tiered disclosure.

#### L1: ESSENTIAL (Always in prompt - ~300 tokens)

```yaml
TASK_CONTEXT:
  task_number: [N]                          # From Phase 2
  description: "[From 08-tasks.md]"         # Main task line
  sub_tasks:                                # Bullet points under task
    - "[sub-task 1]"
    - "[sub-task 2]"
  requirements:                             # From "_Requirements:_" line
    - "FR-X.Y"
    - "TR-Z"
  acceptance_criteria:                      # From 06-requirements-spec.md
    - "AC-X.1: [criterion text]"
    - "AC-X.2: [criterion text]"
```

#### L2: REFERENCE (Paths to read on-demand - ~100 tokens)

```yaml
READ_IF_NEEDED:
  design_section: "[/path/to/07-design.md:50-100]"  # Specific line range
  context_findings: "[/path/to/03-context-findings.md]"
  requirements_spec: "[/path/to/06-requirements-spec.md]"
```

#### L3: DISCOVER VIA TOOLS (Hints only - ~50 tokens)

```yaml
DISCOVER_WITH_TOOLS:
  existing_patterns: "Use Grep '[pattern]' in app/code/Tlu/"
  file_structure: "Use Glob 'app/code/Tlu/**/*.php'"
  similar_implementations: "Use Grep '[class name]' to find examples"
```

### 3.3 Build PROJECT_CONTEXT (Progressive Disclosure)

#### L1: ESSENTIAL (Always inline - ~200 tokens)

```yaml
PROJECT_ESSENTIALS:
  tech_stack: "[PHP 8.4] + [Magento 2.4.8]"
  namespace: "Tlu"
  naming: "PSR-12, PascalCase classes, snake_case tables"
  file_structure: "app/code/Tlu/[ModuleName]/[Structure]"
```

#### L2: REFERENCE (Paths only)

```yaml
READ_IF_NEEDED:
  claude_md: "[/path/to/CLAUDE.md]"              # Full conventions
  context_findings: "[/path/to/03-context-findings.md]"  # Existing patterns
```

**Token Budget**: L1 (~500) + L2 paths (~100) + L3 hints (~50) = **~650 tokens**
vs. Previous: Full context inline (~1200+ tokens)

### 3.4 Context Hierarchy for Libraries

Identify libraries the agent MUST research via Context7:

```yaml
CONTEXT7_REQUIRED:
  primary: "[main framework - e.g., magento2]"
  secondary: "[supporting libs - e.g., php]"
  topic_hints:
    - "[specific feature to research]"
    - "[API pattern to look up]"
```

### 3.5 Context Preparation Output

```
═══════════════════════════════════════════════════════════════════
📦 CONTEXT PREPARED FOR AGENT (Progressive Disclosure)
═══════════════════════════════════════════════════════════════════

L1 ESSENTIAL (~500 tokens):
├── Task #[N]: [description]
├── Sub-tasks: [count]
├── Requirements: [list]
├── Acceptance Criteria: [count]
└── Tech Stack: [language] + [framework]

L2 REFERENCE (paths only):
├── Design: [path]:lines
├── Context Findings: [path]
└── CLAUDE.md: [path]

L3 DISCOVER:
└── Hints for Grep/Glob patterns

CONTEXT7_REQUIRED:
├── Primary: [framework]
└── Secondary: [libs]

Token Budget: ~650 (vs ~1200 inline)
DELEGATION: → code-engineer agent
═══════════════════════════════════════════════════════════════════
```

---

## 📋 PHASE 4: AGENT DELEGATION

**Invoke the code-engineer agent with prepared context.**

### 4.1 When to Delegate to code-engineer Agent

**ALWAYS delegate for:**
- ✅ Creating new source code files
- ✅ Implementing classes, functions, modules
- ✅ Writing test files
- ✅ Modifying existing code logic
- ✅ Any task requiring library API usage

**Execute directly for:**
- 📝 Pure markdown documentation (README, guides)
- ⚙️ Simple configuration files (no logic)
- 📋 Updating task checkboxes, metadata

### 4.2 Agent Invocation Protocol (XML-Tagged Format)

**Use the Task tool to invoke code-engineer agent with structured XML tags.**

**Why XML Tags?** Research shows clear instruction boundaries improve instruction adherence by ~30%.

```
<agent-invocation>
INVOKE: Task tool with subagent_type="code-engineer"

PROMPT STRUCTURE (XML-Tagged for Clear Boundaries):
"""
<task_specification>
## Task #[N]: [description]

Sub-tasks:
- [sub-task 1]
- [sub-task 2]

Requirements: [FR-X.Y, TR-Z]
Acceptance Criteria:
- AC-X.1: [criterion]
- AC-X.2: [criterion]
</task_specification>

<project_constraints>
## MUST FOLLOW (from CLAUDE.md)

Tech Stack: [PHP 8.4] + [Magento 2.4.8]
Namespace: Tlu
Naming: PSR-12, snake_case tables, PascalCase classes
File Location: app/code/Tlu/[ModuleName]/[Structure]
</project_constraints>

<reference_files>
## READ ON DEMAND (paths only)

- CLAUDE.md: [/full/path/CLAUDE.md]
- Design Section: [/path/to/07-design.md:line_start-line_end]
- Context Findings: [/path/to/03-context-findings.md]
</reference_files>

<tool_guidance>
## TOOL SELECTION (Check matrix before each action)

1. RESEARCH (mandatory first):
   - Context7 for: [library1], [library2]
   - Query pattern: "[library] [specific-topic] example code"

2. DISCOVERY:
   - Existing patterns: Grep "[pattern]" in app/code/Tlu/
   - File structure: Glob "app/code/Tlu/**/*.php"

3. IMPLEMENTATION:
   - New files: Write tool
   - Existing files: Read → Edit (NEVER Write on existing)

4. VERIFICATION:
   - Test command: [specific command to verify]
</tool_guidance>

<research_requirements>
## RESEARCH GATE (⛔ BLOCKING)

MUST call Context7 for:
□ [Library 1] - topic: "[relevant topic]"
□ [Library 2] - topic: "[relevant topic]"

Show RESEARCH OUTPUT before any implementation.
Research Gate Score must be 4/4 or implementation is REJECTED.
</research_requirements>

<output_format>
## Return IMPLEMENTATION_PACKAGE

Token budget: ~1500 tokens max
- research_evidence: summarize key patterns only (~400 tokens)
- implementation: paths + line counts (code is in files) (~200 tokens)
- self_review: scores + 1-line justifications (~200 tokens)
- verification: max 3 commands (~100 tokens)
- traceability: FR-X.Y → brief note (~100 tokens)
</output_format>

<execution_mode>
## MODE: INTEGRATED (via /requirements-specs-execute)

1. Complete full research-implement-verify cycle
2. Use Think-Act-Observe discipline for each tool call
3. Self-review must pass: score ≥16/20, research_gate = 4/4
4. Return condensed IMPLEMENTATION_PACKAGE (not verbose)
</execution_mode>
"""
</agent-invocation>
```

### 4.2.1 Prompt Token Budget

| Section | Target Tokens | Purpose |
|---------|---------------|---------|
| task_specification | ~200 | What to implement |
| project_constraints | ~100 | Rules to follow |
| reference_files | ~50 | Where to find details |
| tool_guidance | ~150 | How to use tools |
| research_requirements | ~100 | Research gate specifics |
| output_format | ~100 | Expected return structure |
| execution_mode | ~50 | Behavioral instructions |
| **TOTAL** | **~750** | (vs ~1000+ unstructured) |

### 4.3 Agent Response Handling

The code-engineer agent returns an IMPLEMENTATION_PACKAGE:

```yaml
IMPLEMENTATION_PACKAGE:
  task_number: [N]

  research_evidence:
    context7:
      - library: "[Name]"
        id: "[/org/lib]"
        topic: "[searched topic]"
        patterns: ["[code pattern 1]", "[pattern 2]"]
    online:                           # If used for novel problems
      - source: "[URL]"
        insight: "[what was learned]"
    reasoning:                        # If sequential thinking was used
      - stage: "[Problem Definition/Analysis/etc.]"
        insight: "[key insight]"

  implementation:
    files_created:
      - path: "[/path/to/new/file.ext]"
        lines: [N]
    files_modified:
      - path: "[/path/to/existing/file.ext]"
        changes: "[description]"
    total_lines: [N]

  self_review:
    score: [X]/20                     # Must be ≥16
    research_gate: [4]/4              # HARD GATE - must be 4/4
    details:
      section1_research: [4]/4
      section2_specification: [X]/4
      section3_code_quality: [X]/4
      section4_conventions: [X]/4
      section5_verification: [X]/4

  verification:
    commands:
      - "[command to test/verify]"
    expected:
      - "[expected result]"

  traceability:
    requirements:
      - "FR-X.Y → [how it was implemented]"
      - "AC-X.1 → [satisfied by...]"
```

---

## 📋 PHASE 5: RESULT VALIDATION

**Validate the agent's IMPLEMENTATION_PACKAGE before presenting to user.**

### 5.1 Validation Checklist

```
<result-validation>
┌─────────────────────────────────────────────────────────────────┐
│  IMPLEMENTATION_PACKAGE VALIDATION                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. RESEARCH GATE (HARD GATE) ⛔                                │
│     □ research_gate = 4/4?                                     │
│     □ context7 section populated?                              │
│     □ At least 1 library researched?                           │
│                                                                 │
│     ⚠️ IF research_gate < 4 → REJECT. Re-invoke agent.         │
│                                                                 │
│  2. SELF-REVIEW SCORE                                          │
│     □ score ≥ 16/20?                                           │
│     □ All sections have scores?                                │
│                                                                 │
│     ⚠️ IF score < 16 → WARNING. Review before presenting.      │
│                                                                 │
│  3. IMPLEMENTATION COMPLETENESS                                │
│     □ files_created/modified present?                          │
│     □ total_lines > 0?                                         │
│     □ All sub-tasks addressed?                                 │
│                                                                 │
│  4. TRACEABILITY                                               │
│     □ All requirements mapped?                                 │
│     □ Acceptance criteria addressed?                           │
│                                                                 │
│  5. VERIFICATION INFO                                          │
│     □ Test commands provided?                                  │
│     □ Expected results documented?                             │
│                                                                 │
│  VALIDATION RESULT: [PASS | WARN | REJECT]                     │
└─────────────────────────────────────────────────────────────────┘
</result-validation>
```

### 5.2 Validation Outcomes

| Result | Condition | Action |
|--------|-----------|--------|
| **PASS** | research_gate = 4/4 AND score ≥ 16 | Proceed to Phase 6 |
| **WARN** | research_gate = 4/4 AND score < 16 | Show warning, proceed with caution |
| **REJECT** | research_gate < 4/4 | Re-invoke agent with emphasis on research |

### 5.3 Re-invocation Protocol (If Rejected)

```
<re-invocation>
IF REJECTED:

1. Log rejection reason:
   "Agent failed research gate: [X]/4. Re-invoking with emphasis."

2. Re-invoke with modified prompt:
   """
   ⚠️ PREVIOUS ATTEMPT FAILED RESEARCH GATE

   Your previous implementation was rejected because:
   - Research Gate Score: [X]/4 (required: 4/4)
   - Missing: [specific Context7 calls not made]

   YOU MUST:
   1. Call mcp__context7__resolve-library-id for EACH library
   2. Call mcp__context7__get-library-docs for EACH library
   3. Show research output BEFORE implementing
   4. Return research_gate = 4/4

   [Original TASK_CONTEXT and PROJECT_CONTEXT]
   """

3. Maximum re-invocations: 2
   - If still failing after 2 retries → Escalate to user
</re-invocation>
```

---

## 📋 PHASE 6: USER VERIFICATION LOOP

**Present results to user and facilitate verification.**

### 6.1 Show Task Completion Summary

```
═══════════════════════════════════════════════════════════════════
Task #[N] Completed ⏳ Awaiting Verification
═══════════════════════════════════════════════════════════════════

Task: [Description from 08-tasks.md]

What was done:
✓ [file_created_1] ([lines] lines)
✓ [file_created_2] ([lines] lines)
✓ [file_modified_1] (changes: [description])

Research Evidence:
📚 Context7: [library_1] ([/org/lib]) - [patterns used]
📚 Context7: [library_2] ([/org/lib]) - [patterns used]
🔍 Online: [if used - sources]
🧠 Reasoning: [if used - key insight]

Requirements Satisfied:
✓ FR-X.Y → [implementation mapping]
✓ AC-X.1 → [satisfied by]
✓ AC-X.2 → [satisfied by]

Self-Assessment: [score]/20 (Research Gate: [4]/4 ✅)

You can verify by:
- [verification_command_1]
- [verification_command_2]
Expected: [expected_result]

Files to review:
- [file_path_1]:[line_number]
- [file_path_2]:[line_number]
═══════════════════════════════════════════════════════════════════
```

### 6.2 Update Metadata (Pre-Verification)

Before asking user, update metadata to track verification state:

```json
{
  "phase": "executing",
  "lastUpdated": "ISO-8601-timestamp",
  "specs": {
    "currentTaskNumber": N,
    "awaitingVerification": true,
    "completedTasks": X,
    "totalTasks": Y,
    "lastAgentScore": 18,
    "lastResearchGate": 4
  }
}
```

### 6.3 User Verification Question

**Use AskUserQuestion with 4 options:**

```json
{
  "questions": [
    {
      "question": "Is Task #[N] properly implemented and complete?",
      "header": "Task OK?",
      "multiSelect": false,
      "options": [
        {
          "label": "Yes - Task complete",
          "description": "Task meets all requirements. Mark as done and end this session."
        },
        {
          "label": "Changes needed",
          "description": "Minor adjustments required. I'll ask what to change and re-invoke the agent."
        },
        {
          "label": "Not working correctly",
          "description": "Functional issues or bugs. I'll debug with the agent and fix."
        },
        {
          "label": "Incomplete",
          "description": "Missing functionality. I'll identify gaps and complete with the agent."
        }
      ]
    }
  ]
}
```

### 6.4 Process User Selection

**"Yes - Task complete"** → GOTO Phase 7

**"Changes needed"**:
```
1. Ask: "What changes are needed?" (text input via AskUserQuestion)
2. Re-invoke code-engineer agent with:
   - Original TASK_CONTEXT
   - User feedback as additional constraint
   - Instruction: "Modify implementation per user feedback"
3. Validate new IMPLEMENTATION_PACKAGE
4. Show updated summary
5. RETURN to verification question
```

**"Not working correctly"**:
```
1. Ask: "What's not working? Describe the issue." (text input)
2. Re-invoke code-engineer agent with:
   - Original TASK_CONTEXT
   - Bug description
   - Instruction: "Debug and fix the reported issue"
3. Validate new IMPLEMENTATION_PACKAGE
4. Show fixed version summary
5. RETURN to verification question
```

**"Incomplete"**:
```
1. Ask: "What's missing or incomplete?" (text input)
2. Re-invoke code-engineer agent with:
   - Original TASK_CONTEXT
   - Missing items description
   - Instruction: "Complete the missing functionality"
3. Validate new IMPLEMENTATION_PACKAGE
4. Show comprehensive summary
5. RETURN to verification question
```

### 6.5 Revision Counter

Track revision attempts:

```
<revision-tracking>
Revision attempts: [N]

IF attempts > 3:
  Ask user: "This task has required multiple revisions. Would you like to:"
  - "Continue trying" → More revisions
  - "Skip this task" → Mark incomplete, continue
  - "Pause for manual intervention" → Stop for external help
  - "Redesign approach" → Return to design phase
</revision-tracking>
```

---

## 📋 PHASE 7: COMPLETION

**After user approves "Yes - Task complete".**

### 7.1 Mark Task Complete

Update 08-tasks.md:
```markdown
# Before:
- [ ] N. [Task description]
  - [sub-task 1]
  - [sub-task 2]
  - _Requirements: FR-X.Y_

# After:
- [x] N. [Task description]
  - [sub-task 1]
  - [sub-task 2]
  - _Requirements: FR-X.Y_
```

### 7.2 Update Metadata

```json
{
  "phase": "executing",
  "lastUpdated": "ISO-8601-timestamp",
  "specs": {
    "currentTaskNumber": N,
    "awaitingVerification": false,
    "completedTasks": X + 1,
    "totalTasks": Y,
    "lastCompletedTask": N,
    "lastAgentScore": 18,
    "lastResearchGate": 4,
    "tasksHistory": [
      {
        "task": N,
        "completedAt": "ISO-8601",
        "revisions": 0,
        "agentScore": 18
      }
    ]
  }
}
```

### 7.3 Show Completion Confirmation

```
═══════════════════════════════════════════════════════════════════
✅ Task #[N] Marked Complete
═══════════════════════════════════════════════════════════════════

Progress: [X+1]/[Y] tasks done ([percentage]%)

Session Summary:
├── Task: [description]
├── Agent Score: [score]/20
├── Research Gate: 4/4 ✅
├── Files Created: [count]
├── Files Modified: [count]
├── Revisions: [count]
└── Duration: [time]

═══════════════════════════════════════════════════════════════════
```

### 7.4 Session End

```
═══════════════════════════════════════════════════════════════════
📍 SESSION COMPLETE
═══════════════════════════════════════════════════════════════════

Completed: Task #[N]
Overall Progress: [X]/[Y] tasks ([percentage]%)

[IF more tasks remain]:
  Next Task: #[N+1] - [preview description]

  To continue: Run /requirements-specs-execute
  (Fresh session provides optimal code quality)

[IF all tasks complete]:
  🎉 IMPLEMENTATION COMPLETE!

  All [Y] tasks have been implemented and verified.

  Next steps:
  1. Run tests: [suggested command]
  2. Review code: [file paths]
  3. Archive session: /requirements-end

═══════════════════════════════════════════════════════════════════

**SESSION ENDS HERE - Do not continue to next task**
```

---

## 🔄 RESUMPTION PROTOCOL

**Handle interrupted sessions gracefully.**

### Resume from Verification State

If `awaitingVerification: true` in metadata:

```
1. READ last task context from metadata
2. SKIP Phases 1-5 (task already executed)
3. SHOW: "Task #[N] was executed but not verified. Resuming verification..."
4. Display last completion summary
5. GOTO Phase 6 (User Verification Loop)
```

### Resume from Clean State

If `awaitingVerification: false`:

```
1. Execute normal Phase 1-7 flow
2. Find next unchecked task
3. Proceed with fresh agent delegation
```

---

## 📊 EXECUTION EXAMPLES

### Example 1: Code Implementation Task

**Task in 08-tasks.md:**
```markdown
- [ ] 5. Create payment signature validator
  - Implement HMAC-SHA512 signature generation
  - Add signature verification method
  - Handle edge cases (empty params, special characters)
  - _Requirements: FR-2.1, TR-1_
```

**Orchestrator Flow:**

```
PHASE 1: Session validated ✓
PHASE 2: Task #5 parsed
  - Type: CODE
  - Requirements: FR-2.1, TR-1
  - Design: 07-design.md § Security Components

PHASE 3: Context prepared
  TASK_CONTEXT:
    task_number: 5
    description: "Create payment signature validator"
    sub_tasks: [3 items]
    requirements: ["FR-2.1", "TR-1"]

  PROJECT_CONTEXT:
    tech_stack: PHP 8.4 + Magento 2.4.8
    conventions: PSR-12, Tlu namespace

PHASE 4: Delegating to code-engineer agent...
  → Agent invoked with full context
  → Agent performs Context7 research (PHP, Magento, HMAC)
  → Agent implements SignatureValidator class
  → Agent returns IMPLEMENTATION_PACKAGE

PHASE 5: Validating agent results
  research_gate: 4/4 ✅
  score: 18/20 ✅
  files_created: ["Helper/SignatureValidator.php"]
  VALIDATION: PASS

PHASE 6: User verification
  [Show summary with research evidence]
  [AskUserQuestion]
  User: "Yes - Task complete"

PHASE 7: Completion
  ✓ Task #5 marked [x] in 08-tasks.md
  ✓ Metadata updated: completedTasks = 5
  ✓ Session ended
```

### Example 2: Documentation Task (Direct Execution)

**Task in 08-tasks.md:**
```markdown
- [ ] 12. Update README with installation instructions
  - Add prerequisites section
  - Document configuration steps
  - _Requirements: FR-7_
```

**Orchestrator Flow:**

```
PHASE 2: Task #12 parsed
  - Type: DOCUMENTATION
  - Decision: Execute directly (pure markdown, no code logic)

PHASE 3-4: Execute without agent
  - Read existing README.md
  - Add prerequisites section based on 07-design.md
  - Add configuration steps from 06-requirements-spec.md
  - Write updated README.md

PHASE 5: Self-validation
  - File updated: README.md
  - Sections added: 2
  - Requirements addressed: FR-7

PHASE 6: User verification
  [Show summary]
  User: "Changes needed" - "Add example commands"
  → Update README with examples
  User: "Yes - Task complete"

PHASE 7: Completion
```

### Example 3: Agent Re-invocation (Failed Research Gate)

```
PHASE 4: Agent returns IMPLEMENTATION_PACKAGE
  research_gate: 2/4 ❌

PHASE 5: Validation FAILED
  - Missing Context7 calls for: Magento, PHP hash functions

  Re-invoking agent with emphasis...

  Agent attempt #2:
  research_gate: 4/4 ✅
  score: 17/20 ✅

  VALIDATION: PASS

PHASE 6: Continue to user verification...
```

---

## ⚠️ ERROR HANDLING

### Agent Invocation Failure

```
IF agent fails to respond:
  1. Log error with context
  2. Retry once with simplified prompt
  3. If still failing:
     Ask user: "Agent unavailable. Options:"
     - "Retry" → Try again
     - "Execute directly" → Orchestrator implements (no research guarantee)
     - "Skip task" → Mark incomplete
     - "Abort" → End session
```

### Missing Design Details

```
IF 07-design.md lacks details for task:
  1. Log: "Missing design details for Task #[N]"
  2. Ask user: "Design spec incomplete. Options:"
     - "Infer from requirements" → Use 06-requirements-spec.md
     - "Provide details" → User supplies missing info
     - "Skip task" → Mark for later
     - "Return to design" → Suggest /requirements-specs-generate
```

### Agent Score Below Threshold

```
IF score < 16 but research_gate = 4/4:
  1. Log warning: "Agent score below threshold: [X]/20"
  2. Show warning to user in summary
  3. Proceed to verification (let user decide)
  4. User can request changes if quality insufficient
```

---

## 📈 PROGRESS TRACKING

Track execution statistics:

```json
{
  "execution_stats": {
    "session_id": "[session-name]",
    "started_at": "ISO-8601",
    "tasks": {
      "total": 35,
      "completed": 12,
      "remaining": 23,
      "current": null
    },
    "agent_metrics": {
      "total_invocations": 15,
      "average_score": 17.5,
      "research_gate_failures": 1,
      "revisions_requested": 3
    },
    "time_metrics": {
      "average_task_duration": "4m 32s",
      "total_execution_time": "54m 24s"
    }
  }
}
```

---

## 🔧 COMMAND FLAGS (Optional)

```bash
# Execute specific task
/requirements-specs-execute --task=5

# Dry run (show what would be done)
/requirements-specs-execute --dry-run

# Verbose output (show agent communication)
/requirements-specs-execute --verbose

# Force direct execution (skip agent for simple tasks)
/requirements-specs-execute --direct

# Resume from verification state
/requirements-specs-execute --resume
```

---

## ✅ ORCHESTRATOR SELF-CHECK

Before ending each phase, verify:

```
<orchestrator-check>
PHASE 1: □ Session valid □ Files exist □ State determined
PHASE 2: □ Task parsed □ Type identified □ References extracted
PHASE 3: □ TASK_CONTEXT built □ PROJECT_CONTEXT built
PHASE 4: □ Agent invoked (if CODE) □ Response received
PHASE 5: □ research_gate validated □ score checked □ files verified
PHASE 6: □ Summary shown □ User responded □ Loop handled
PHASE 7: □ Task marked [x] □ Metadata updated □ Session ended
</orchestrator-check>
```

---

## 🔗 RELATED COMMANDS

- `/requirements-specs-generate` - Generate design + tasks before executing
- `/requirements-revise` - Check code alignment with requirements/design
- `/requirements-status` - Check current session status
- `/requirements-current` - View current session details
- `/requirements-end` - Archive completed session

---

## 📝 NOTES

**Key Principles:**
- **Orchestration over Implementation**: This command manages flow, not code
- **Agent Delegation**: code-engineer agent handles research + implementation
- **Research Gate Enforcement**: Validate agent completed Context7 research
- **Human-in-the-Loop**: Every task requires explicit user approval
- **One Task Per Session**: Fresh context for optimal quality

**Agent Integration:**
- code-engineer agent owns: Research Gate, Implementation, Self-Verification
- Orchestrator owns: Task parsing, Context prep, User verification, Metadata

**Quality Guarantees:**
- Research Gate (4/4) validated before presenting to user
- Self-review score (≥16/20) checked before presenting
- User verification required before marking complete
- Revision loop for any rejected implementations

**Context Sources (Priority Order):**
1. **CLAUDE.md**: Project-specific coding rules (HIGHEST)
2. **07-design.md**: Architectural decisions and component specs
3. **Context7 MCP**: Up-to-date library documentation (via agent)
4. **03-context-findings.md**: Existing codebase patterns
5. **06-requirements-spec.md**: Acceptance criteria

**Success Metrics:**
- Agent research gate compliance: 100% (validated)
- Agent self-review scores: Average ≥16/20
- User verification pass rate: Track revisions
- Task completion rate: Completed vs. skipped
