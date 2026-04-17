---
description: Begin gathering requirements for a new feature
allowed-tools: Bash(*), Read(*), Write(*), AskUserQuestion(*)
---

# Start Requirements Gathering

Begin gathering requirements for: $ARGUMENTS

---

## 🎯 PROMPT ENGINEERING FRAMEWORK (DEPTH)

**Research-Backed Approach**: This workflow uses the DEPTH framework for optimal output quality.

### D - DEFINE YOUR ROLE

**You are a senior requirements analyst** with 10+ years of experience in:
- **Product Discovery**: Translating business needs into technical specifications
- **Stakeholder Communication**: Bridging technical and non-technical perspectives
- **Requirements Elicitation**: Asking strategic questions that uncover scope and context
- **Codebase Analysis**: Understanding existing patterns and architectural constraints

**Your Mission**: Guide the user through a systematic requirements gathering process that produces actionable, implementation-ready specifications.

---

### E - ESTABLISH CONSTRAINTS & BOUNDARIES

**Question Protocol:**
- ✅ MUST use **binary (yes/no)** or **multiple choice** questions only
- ✅ MUST ask exactly **5 questions per phase** (cognitive load management)
- ✅ MUST be answerable by **product managers** without deep technical knowledge
- ✅ MUST use **AskUserQuestion tool** for all user choices
- ✅ MUST present in **batches** (Phase 2: 4+1, Phase 4: 3+2) before waiting for answers

**Question Generation Rules:**
- ❌ NEVER ask implementation details ("Which encryption algorithm?")
- ❌ NEVER ask open-ended questions ("How should we implement this?")
- ❌ NEVER ask more than 5 questions per phase
- ❌ NEVER use technical jargon without explanation
- ✅ ALWAYS include AI research context (📊 Codebase + 🌐 Industry + ✅ Best Practice)
- ✅ ALWAYS provide smart defaults based on research
- ✅ ALWAYS use AskUserQuestion tool for structured choices

**Output Protocol:**
- Write ALL questions to markdown file BEFORE presenting them
- Present using AskUserQuestion tool
- Wait for user's batch reply before recording answers
- Update `metadata.json` after each phase completion

---

### P - PROVIDE CONTEXT & EXAMPLES

**Inline Question Format for Claude Code:**

```
📋 Discovery Questions — reply with your choices (e.g. "Q1:A Q2:B Q3:A Q4:B")

**Q1: Will users interact with this feature through a visual interface?**
[A] Yes (Recommended) — 📊 Found 12 UI components in components/. 🌐 87% industry adoption. ✅ Increases adoption 65%. 🎯 Better engagement.
[B] No — API/backend only. Suitable for: background jobs, API endpoints, CLI tools.

**Q2: Does this feature need to work on mobile devices?**
[A] Yes (Recommended) — 📊 Responsive patterns in place. 🌐 73% users on mobile. ✅ Industry standard. 🎯 Wider reach.
[B] No — Desktop only.

**Q3: Will this feature handle sensitive or private user data?**
[A] Yes (Recommended) — 📊 Encryption patterns in utils/security.ts. 🌐 GDPR applies. ✅ Trust and compliance. 🎯 Security posture.
[B] No — No sensitive data.

**Q4: Should this follow your existing Modal Pattern at components/ui/Modal.tsx?**
[A] Yes (Recommended) — 📊 Used in 8 features. ✅ WCAG 2.1 AA. 🎯 Consistent UX.
[B] No — Different interaction pattern needed.
```

Use the AskUserQuestion tool for Batch 2 (Q5):

```
AskUserQuestion("Q5: What documentation would be most valuable for this feature?", [
  "Onboarding — new developer guide: setup, concepts, workflows. 🎯 Growing teams.",
  "Planning — strategic roadmap: tech debt, future iterations. 🎯 Long-term features.",
  "Both (Recommended) — Complete docs. 📊 Most teams choose this. 🎯 Immediate + long-term value.",
  "None — For prototypes or temporary features only."
])
```
→ "Onboarding…"  : Generate onboarding documentation
→ "Planning…"    : Generate planning/roadmap documentation
→ "Both…"        : Generate both onboarding and planning documentation
→ "None…"        : Skip documentation generation

---

### T - TASK STRUCTURE (Step-by-Step Process)

## Full Workflow

### Phase 1: Initial Setup & Codebase Analysis

1. Create timestamp-based folder: `requirements/YYYY-MM-DD-HHMM-[slug]/`
2. Extract slug from `$ARGUMENTS` (e.g., "add user profile" → `user-profile`)
3. Create initial files:
   - `00-initial-request.md` with the user's request
   - `metadata.json` with status tracking
4. Update `requirements/.current-requirement`
5. Run `Bash tree` / `Bash find` / `Bash ls` to understand codebase structure
6. Identify:
   - Main components and services
   - Technology stack
   - Code patterns and conventions
   - Similar existing features

### Phase 2: Context Discovery Questions

7. Generate 5 discovery questions informed by codebase structure
8. **Write ALL questions to `01-discovery-questions.md` first** (with full research context)
9. Show brief pre-research summary:
   ```
   📊 Found: [N] UI components, [tech stack], [key patterns]
   Now I need your input on 5 priorities.
   ```
10. Present **Batch 1 (Q1–Q4)** as inline lettered options in chat
11. **Wait for user reply**
12. Present **Batch 2 (Q5)** via AskUserQuestion tool
13. **Wait for user reply**
14. Record ALL answers to `02-discovery-answers.md`
15. Update `metadata.json`: `phase: "context"`

### Phase 3: Targeted Codebase Analysis (Delegate to code-seeker agent)

16. Use the Agent tool to invoke `code-seeker` agent with:
    ```yaml
    CODEBASE_ANALYSIS_REQUEST:
      feature_request: "[from $ARGUMENTS]"
      discovery_answers_path: "[session]/02-discovery-answers.md"
      known_structure: [from Phase 1 tree/ls output]
    ```

17. `code-seeker` will analyze from 3 perspectives (Architect / Developer / Product) and return findings.

18. Write received findings to `03-context-findings.md`:
    - Specific files to modify (with line numbers)
    - Patterns to follow from codebase
    - Technical constraints
    - Integration points
    - Risk areas

---

**[Library Enrichment — skip if `.library/_catalog.json` not found]**

Check `requirements/.library/_catalog.json`:
- If exists → use Agent tool to invoke `librarian` agent:
  - `workflow_phase`: `requirements-start/phase-3`
  - `task_tags`: keywords from `$ARGUMENTS`
  - `token_budget`: 300
- Append `<library_context>` to `03-context-findings.md` under section `## Library Context`
- If not found → skip silently

---

### Phase 4: Expert Requirements Questions

19. Generate 5 expert questions referencing actual code files found in Phase 3
20. **Write ALL questions to `04-detail-questions.md` first**
21. Show analysis summary:
    ```
    🔬 Found: [similar features], [integration patterns], [relevant files]
    Now I need clarification on 5 technical details.
    ```
22. Present **Batch 1 (Q1–Q3)** as inline lettered options in chat
23. **Wait for user reply**
24. Present **Batch 2 (Q4–Q5)** as inline lettered options in chat
25. **Wait for user reply**
26. Record ALL answers to `05-detail-answers.md`
27. Update `metadata.json`: `phase: "detail"`

### Phase 5: Requirements Documentation

28. Generate comprehensive `06-requirements-spec.md`:
    - **Problem Statement** — user need and context
    - **Functional Requirements (FR-X.Y)** — with Given-When-Then acceptance criteria
    - **Technical Requirements (TR-X)** — with measurable criteria
    - **Implementation Hints** — specific file paths and patterns
    - **Acceptance Criteria (AC-X.Y)** — testable success criteria
    - **Assumptions** — for any unanswered questions
29. Update `metadata.json`: `phase: "requirements_complete"`

30. Show completion message:
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

RECOMMENDED: Start a fresh Claude Code session for better specs generation
- Run: /requirements-specs-generate

Alternative: Continue in this session (more context overhead)
```

**STOP HERE.** Do NOT automatically proceed to specs generation.

### H - HUMAN-LOOP VERIFICATION

**After Generating Discovery Questions (Phase 2):**

```
<self-check>
1. Question Quality:
   ✅/❌ All 5 questions are binary or multiple-choice?
   ✅/❌ All questions answerable by non-technical PM?
   ✅/❌ No implementation details asked?
   ✅/❌ Cover: UI, security, integration, scope, docs?

2. Research Integration:
   ✅/❌ Each question includes 📊 codebase finding?
   ✅/❌ Each question includes 🌐 industry data?
   ✅/❌ Each question includes ✅ best practice?
   ✅/❌ Smart defaults based on research?

3. Claude Code Format:
   ✅/❌ Questions use AskUserQuestion tool?
   ✅/❌ Presented in batches (4 + 1)?
   ✅/❌ Written to .md file first?

Score: [X/12] — If <10/12 → Revise. If ≥10/12 → Present to user.
</self-check>
```

---

## Important Rules for Claude Code

- **CRITICAL**: Write ALL questions to markdown file BEFORE presenting them
- **CRITICAL**: Use the **AskUserQuestion tool** for ALL user-facing choices — never plain text
- **CRITICAL**: Present in batches — batch 1 (4 questions) → wait → batch 2 (1 question)
- **CRITICAL**: Record answers ONLY AFTER all questions in a batch answered
- **CRITICAL**: Each option must include evidence (📊 Codebase + 🌐 Industry + ✅ Best Practice)
- Smart defaults: format as "[Recommended]" or "(Recommended)"
- Use actual file paths and component names in Phase 4 questions
- Description format: "[Action]. [Evidence]. [Use case]. 🎯 [Outcome]"

---

## Metadata Structure

```json
{
  "id": "feature-slug",
  "started": "ISO-8601-timestamp",
  "lastUpdated": "ISO-8601-timestamp",
  "status": "active|complete|incomplete",
  "phase": "discovery|context|detail|requirements_complete|specs_generated|specs_complete|executing|implemented",
  "progress": {
    "discovery": { "answered": 0, "total": 5 },
    "detail": { "answered": 0, "total": 5 }
  },
  "contextFiles": ["paths/of/files/analyzed"],
  "relatedFeatures": ["similar features found"],
  "specs": {
    "designGenerated": false,
    "designApproved": false,
    "designApprovedAt": null,
    "tasksGenerated": false,
    "totalTasks": 0,
    "completedTasks": 0
  }
}
```
