# Requirements Gathering Reminder

Quick correction when deviating from requirements gathering rules.

**Aliases:** `/requirements-remind`, `/remind`, `/r`

---

## 🔔 CRITICAL RULES (CHECK EVERY 3 QUESTIONS)

<critical-checklist>
1. ❌ **NEVER ask open-ended questions** → Use yes/no with AskUserQuestion tool
2. ❌ **NEVER ask text-based one-by-one** → Use AskUserQuestion batches
3. ❌ **NEVER record answers before ALL questions asked** → Write ALL → Ask ALL → Record AFTER
4. ❌ **NEVER skip design validation** (Phase 6) → MANDATORY AskUserQuestion 4-option loop
5. ❌ **NEVER skip root cause analysis** (Phase 8 bugs) → Phase 2 is 100% autonomous
6. ❌ **NEVER start coding** during requirements gathering → Questions only
7. ✅ **ALWAYS use AskUserQuestion** visual interface → Batch mode (4+1 or 3+2)
8. ✅ **ALWAYS provide smart defaults** → Based on codebase + MCP research
9. ✅ **EXACTLY 5 questions per phase** → Not 4, not 6, EXACTLY 5
10. ✅ **ALWAYS separate sessions** → Stop after Phase 5, recommend fresh session for Phase 6
</critical-checklist>

---

## Quick Status Check

**Active Requirement:** [name from .current-requirement]
**Current Phase:** [phase from metadata.json]
**Progress:** [answeredQuestions]/[totalQuestions]

---

## PHASE-SPECIFIC RULES

### Phase 2 - Context Discovery (5 Questions)

<phase2-rules>
**Role:** Product manager interviewer (NO code knowledge required)
**Questions:** Binary yes/no about problem space, user workflows, constraints
**Pattern:** Write ALL 5 → Ask via AskUserQuestion in batches (4+1) → Record AFTER
**Option Format:** "[Action]. 📊 Codebase + 🌐 Industry + ✅ Best Practice. [Use case]. 🎯 [Outcome]."
**Smart Defaults:** Based on MCP pre-research + codebase scan
**Output:** 01-discovery-questions.md (with full research) + 02-discovery-answers.md
</phase2-rules>

**Example Question Pattern:**
```json
{
  "question": "Will users interact through a visual interface?",
  "header": "Visual UI",
  "multiSelect": false,
  "options": [
    {"label": "Yes (Recommended)", "description": "Add UI. 📊 12 UI components. 🌐 87% adoption. ✅ 65% better UX. 🎯 Increases adoption."},
    {"label": "No", "description": "API/backend only. For: jobs, APIs, CLI. ⚠️ Technical users only."}
  ]
}
```

---

### Phase 3 - Targeted Context (Autonomous - NO User Interaction)

<phase3-rules>
**Role:** Code archaeologist
**Tasks:** Search code, analyze patterns, read similar features, document findings
**Tools:** Grep, Read, Glob, MCP research
**Output:** 03-context-findings.md with file paths, patterns, integration points
**Duration:** ~5-10 minutes autonomous work
**User Involvement:** ZERO (completely autonomous)
</phase3-rules>

---

### Phase 4 - Expert Requirements (5 Questions)

<phase4-rules>
**Role:** Senior developer asking PM (PM must understand without code knowledge)
**Questions:** Binary yes/no, reference specific files from Phase 3, clarify system behavior
**Pattern:** Write ALL 5 → Ask via AskUserQuestion batches (3+2) → Record AFTER
**Option Format:** Same as Phase 2, but include actual file paths + codebase patterns
**Smart Defaults:** Based on Phase 3 findings + similar feature patterns
**Output:** 04-detail-questions.md + 05-detail-answers.md
</phase4-rules>

---

### Phase 5 - Requirements Documentation (Autonomous)

<phase5-rules>
**Generate:** 06-requirements-spec.md with complete structure
**Include:** Problem statement, FRs (Given-When-Then), TRs (with file paths), Acceptance Criteria
**Assumptions:** Mark any defaults used with "ASSUMED:" prefix
**Metadata:** Update status="requirements_complete", phase="requirements_complete"
**STOP HERE:** Recommend fresh session for Phase 6 (better results)
</phase5-rules>

---

### Phase 6 - Specs Generation (Fresh Session Recommended)

<phase6-rules>
**Command:** `/requirements-specs-generate` (in NEW session preferred)
**Generate:** 07-design.md (technical architecture)
**MANDATORY VALIDATION:** AskUserQuestion with exactly 4 options:
  1. "Yes - Approve" → Proceed to 08-tasks.md
  2. "Minor tweaks needed" → Ask follow-up, update, LOOP back
  3. "Major revision needed" → Redesign, LOOP back
  4. "Need more details" → multiSelect sections, expand, LOOP back
**LOOP UNTIL:** User selects "Yes - Approve" (CANNOT skip)
**Output:** 07-design.md (after approval), then 08-tasks.md
**Metadata:** designGenerated=true, designApproved=true, tasksGenerated=true
</phase6-rules>

**Validation Loop** (CANNOT skip):
```
Generate 07-design.md → Show design → AskUserQuestion (4 options)
  → If NOT "Yes - Approve": Process feedback → Update design → REPEAT
  → If "Yes - Approve": Generate 08-tasks.md → Done
```

---

### Phase 7 - Implementation Execution

<phase7-rules>
**Command:** `/requirements-specs-execute`
**Execute:** Tasks from 08-tasks.md sequentially (one at a time)
**Verification:** After each task completion, update metadata progress
**Metadata:** completedTasks++ after each task, phase="executing" or "implemented" when done
**Output:** Actual code changes + updated metadata.json
</phase7-rules>

---

### Phase 8 - Bug Fixing (Optional - When Issues Found)

<phase8-rules>
**Command:** `/requirements-bug-fix [bug-description]`
**CRITICAL:** Two-Step Method (2025 research-backed): Analyze First, Fix Later
**Phases:** Bug Intake (5Q) → Root Cause (100% autonomous) → Fix Validation (3Q) → Implement → Verify
**Phase 2 MUST:** Complete root cause analysis with NO user interaction
**Output:** 09-bug-tracker.md + metadata bugs array
**Traceability:** ALWAYS maintain bug → task → design → requirement
</phase8-rules>

**Bug Fix Workflow** (STRICT):
```
Intake (5Q via AskUserQuestion batches 3+2)
  ↓
Root Cause Analysis (AUTONOMOUS - NO questions)
  ↓
Fix Validation (3Q via AskUserQuestion)
  ↓ (LOOP if not approved)
Implement (autonomous)
  ↓
Verify (AskUserQuestion 4 options)
  ↓ (LOOP if not fixed)
Done → Back to Phase 7
```

---

## SESSION SEPARATION STRATEGY

<session-workflow>
**SESSION 1: Requirements Gathering**
/requirements-start → Phases 1-5 → 06-requirements-spec.md → **STOP**
Recommend: "Start fresh session for better design results"

**SESSION 2: Design & Implementation** (Fresh - Recommended)
/requirements-specs-generate → 07-design.md → **VALIDATION LOOP** → 08-tasks.md → /requirements-specs-execute

**SESSION 3: Bug Fixes** (Optional - If Issues Found)
/requirements-bug-fix → 5-phase bug fix workflow → Back to SESSION 2
</session-workflow>

**Why Separate?**
- ✅ Reduced context overhead (Requirements phase builds significant history)
- ✅ Better focus (Design session focuses on architecture only)
- ✅ Cleaner output (Fresh context = clearer technical docs)
- ✅ Token efficiency (Avoids context limits during implementation)

---

## PROMPT ENGINEERING FRAMEWORK

<depth-framework>
**D** - Define: Clear role per phase (PM interviewer, Code archaeologist, Senior dev, Bug specialist)
**E** - Establish: Constraints set explicitly (EXACTLY 5 questions, MANDATORY validation, 100% autonomous Phase 3)
**P** - Provide: Few-shot examples (3-5 in templates: 01/02/03 examples.md)
**T** - Task: Structured instructions with numbered steps (phase-steps in XML)
**H** - Human-loop: Meta-cognitive checkpoints (12-16 point checklists per phase)
</depth-framework>

**Key Techniques Applied:**
- **Few-Shot Prompting:** 3-5 examples per phase (40-60% quality boost - DigitalOcean 2025)
- **Chain of Thought:** `<thinking>` tags before generation (explicit reasoning)
- **Structured Output:** XML templates for consistency (Tredence 2025)
- **Meta-Cognitive Validation:** Self-checks at phase transitions (Meta-prompting 2025)
- **AskUserQuestion Integration:** Visual batch interface (60% faster vs text-based)

---

## ASKUSERQUESTION TOOL USAGE

<askuserquestion-pattern>
**ALWAYS use for questions** - NEVER ask via text one-at-a-time

**Batch Patterns:**
- Phase 2: Batch 1 (Q1-Q4 technical priorities), Batch 2 (Q5 documentation)
- Phase 4: Batch 1 (Q1-Q3 implementation scope), Batch 2 (Q4-Q5 technical details)
- Phase 6: Validation with 4 options (Approve/Minor/Major/Details) + follow-up loops
- Phase 8: Intake batch (Q1-Q3 classification), batch (Q4-Q5 context)

**Option Description Format:**
"[Action]. [Evidence: 📊+🌐+✅]. [Use case]. 🎯 [Outcome]." (150-200 chars)

**Benefits:**
- 60% faster (2 interactions vs 5 per phase)
- Less error-prone (keyboard selection vs typing)
- Professional CLI interface
- Rich context inline (research visible in descriptions)
</askuserquestion-pattern>

---

## COMMON CORRECTION SCENARIOS

**Open-ended question detected:**
→ "Let me rephrase as yes/no with AskUserQuestion visual interface..."

**Multiple text questions asked:**
→ "Let me use AskUserQuestion to batch these questions with visual selection..."

**Implementation started during requirements:**
→ "I apologize. Let me continue with requirements gathering (no code yet)..."

**Design validation skipped:**
→ "STOP: Design validation is MANDATORY. Using AskUserQuestion to validate..."

**Bug fix without analysis:**
→ "STOP: Root cause analysis is MANDATORY. Analyzing first (autonomous Phase 2)..."

---

## QUALITY INDICATORS

<quality-checklist>
✅ **Questions:** PM-answerable, binary/multiple choice, research-backed defaults visible
✅ **Requirements:** Testable ACs in Given-When-Then, full traceability maintained
✅ **Design:** Every FR has implementation path, file locations specified exactly
✅ **Tasks:** One-task-per-session execution, CoT reasoning, meta-cognitive validation
✅ **Bug Fixes:** Two-step method always (analyze → approve → fix), full traceability
✅ **Overall:** Fresh context per session, explicit verification checkpoints always
</quality-checklist>

---

## CURRENT STATE

**Last Action:** [Show last question or action]
**User Response:** [pending | answered]
**Next Action:** [Continue with question X of 5 | Generate document Y | Execute task Z]

**Phase-Specific Next Steps:**
- Phase 2: [Question X of 5 via AskUserQuestion batch]
- Phase 3: [Autonomous: analyzing file Y]
- Phase 4: [Question X of 5 via AskUserQuestion batch]
- Phase 5: [Generating 06-requirements-spec.md]
- Phase 6: [Design validation loop - awaiting approval]
- Phase 7: [Executing task X of Y from 08-tasks.md]
- Phase 8: [Bug fix phase: analyzing | validating | implementing | verifying]

---

## METADATA TRACKING

All phases update `metadata.json` with:
- Phase transitions (discovery → context → detail → requirements_complete → specs_generated → specs_complete → executing → implemented → bug_fixing)
- Question progress (answeredQuestions count)
- Specs status (designGenerated, designApproved, tasksGenerated)
- Task progress (completedTasks / totalTasks)
- Bug tracking (bugs array with status, bugStats object)

---

## RELATED COMMANDS

- `/requirements-status` - Continue from last checkpoint
- `/requirements-current` - View full session details
- `/requirements-list` - List all requirements with progress
- `/requirements-end` - Complete session (checks unresolved bugs)
- `/requirements-specs-generate` - Generate design & tasks (Phase 6-7)
- `/requirements-specs-execute` - Execute tasks (Phase 8)
- `/requirements-bug-fix` - Fix implementation issues (optional Phase 9)