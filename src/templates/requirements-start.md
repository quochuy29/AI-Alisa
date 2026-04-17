# Start Requirements Gathering

Begin gathering requirements for: $ARGUMENTS

---

## 🎯 PROMPT ENGINEERING FRAMEWORK (DEPTH)

**Research-Backed Approach**: This workflow uses the DEPTH framework (2025 AI best practices) for optimal output quality.

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
- ✅ MUST use **binary (yes/no)** or **multiple choice** questions only (no open-ended)
- ✅ MUST ask exactly **5 questions per phase** (cognitive load management)
- ✅ MUST be answerable by **product managers** without deep technical knowledge
- ✅ MUST uncover **essential context**, not nice-to-have details
- ✅ MUST use **AskUserQuestion tool** for batch visual interface (Phase 2: 4+1, Phase 4: 3+2)

**Question Generation Rules:**
- ❌ NEVER ask implementation details ("Which encryption algorithm?")
- ❌ NEVER ask open-ended questions ("How should we implement this?")
- ❌ NEVER ask more than 5 questions per phase (respect user time)
- ❌ NEVER use technical jargon without explanation
- ✅ ALWAYS include AI research context (📊 Codebase + 🌐 Industry + ✅ Best Practice)
- ✅ ALWAYS provide smart defaults based on research
- ✅ ALWAYS format for visual selection interface

**Output Protocol:**
- Write ALL questions to markdown file BEFORE asking any
- Use AskUserQuestion tool for batch asking (not one-by-one text)
- Record ALL answers only AFTER all questions asked
- Update metadata.json after each phase completion

---

### P - PROVIDE CONTEXT & EXAMPLES

**Few-Shot Learning Resources:**

Before generating questions, review these high-quality examples:

📚 **Discovery Questions Examples** (Phase 2):
- See: `templates/01-discovery-questions-examples.md`
- Shows: 3 complete examples (e-commerce, data export, API integration)
- Pattern: UI → Security → Integration → Scope → Documentation
- Quality indicators: PM-answerable, binary choices, research-backed defaults

📚 **Expert Questions Examples** (Phase 4):
- See: `templates/02-expert-questions-examples.md`
- Shows: 2 complete examples with codebase-specific context
- Pattern: Reference actual files/patterns from Phase 3 findings
- Quality indicators: Technical but PM-answerable, references existing code

📚 **Requirement Specification Examples**:
- See: `templates/03-requirement-examples.md`
- Shows: How to write FRs with Given-When-Then acceptance criteria

**Your generated questions should feel like these examples**: specific to the feature but following proven patterns.

---

### T - TASK STRUCTURE (Step-by-Step Process)

**Phase 2: Discovery Questions Generation:**

```
1. <thinking>
   - Analyze feature request from $ARGUMENTS
   - Extract key terms (payment, export, integration, etc.)
   - Consider: UI scope, security, integrations, enhancement vs new, docs
   - Review codebase analysis findings
   - Check templates/01-discovery-questions-examples.md for pattern
   </thinking>

2. Conduct MCP Pre-Research:
   - Prime Search: "[feature-type] implementation patterns best practices"
   - Brave Search: "real-world [feature-type] implementations"
   - Sequential Thinking: Analyze potential architectural patterns through structured reasoning stages

3. Generate 5 discovery questions following template pattern:
   - Q1: UI Scope (visual interface vs API-only)
   - Q2: Security/Sensitivity (PII/financial data handling)
   - Q3: Integration (external services vs self-contained)
   - Q4: Modification Scope (enhancement vs new feature)
   - Q5: Documentation (onboarding vs planning vs both)

4. Write ALL questions to 01-discovery-questions.md with full research context

5. Present questions via AskUserQuestion in 2 batches:
   - Batch 1: Questions 1-4 (technical priorities)
   - Batch 2: Question 5 (documentation scope, multiple choice)

6. Wait for all answers before recording
```

**Phase 4: Expert Questions Generation:**

```
1. <thinking>
   - Review Phase 2 discovery answers
   - Review Phase 3 codebase findings (specific files, patterns)
   - Identify technical decisions needed
   - Check templates/02-expert-questions-examples.md for pattern
   </thinking>

2. Generate 5 expert questions referencing actual code:
   - Must cite specific files from Phase 3 (e.g., "extend UserService at services/UserService.ts?")
   - Must build on discovery answers (Q2:Security=YES → ask about encryption patterns)
   - Must be PM-answerable (explain technical choices in business terms)

3. Write ALL questions to 04-detail-questions.md

4. Present via AskUserQuestion in 2 batches:
   - Batch 1: Questions 1-3 (implementation scope)
   - Batch 2: Questions 4-5 (technical details)
```

---

### H - HUMAN-LOOP VERIFICATION (Meta-Cognitive Checkpoints)

**After Generating Discovery Questions (Phase 2):**

```
<meta-cognitive-checkpoint>
Self-Validation Before Asking:

1. Question Quality:
   - ✅/❌ All 5 questions are binary or multiple choice?
   - ✅/❌ All questions answerable by non-technical PM?
   - ✅/❌ No implementation details asked?
   - ✅/❌ Cover essential dimensions: UI, security, integration, scope, docs?

2. Research Integration:
   - ✅/❌ Each question includes codebase findings (📊)?
   - ✅/❌ Each question includes industry data (🌐)?
   - ✅/❌ Each question includes best practices (✅)?
   - ✅/❌ Smart defaults based on research?

3. AskUserQuestion Format:
   - ✅/❌ Option descriptions 150-200 characters?
   - ✅/❌ Format: "[Action]. [Evidence]. [Use case]. 🎯 [Outcome]"?
   - ✅/❌ Batch structure correct (4+1 for discovery)?

Quality Score: [X/12 checks passed]
Decision: If <10/12 → Revise questions. If ≥10/12 → Proceed to ask.
</meta-cognitive-checkpoint>
```

**After Recording Answers:**

```
<meta-cognitive-checkpoint>
Phase 2 Completion Validation:

- ✅/❌ All 5 answers recorded in 02-discovery-answers.md?
- ✅/❌ Answers provide clear scope direction?
- ✅/❌ Sufficient context for Phase 3 autonomous analysis?
- ✅/❌ Metadata.json updated (phase: "context", progress.discovery.answered: 5)?

If all ✅ → Proceed to Phase 3 (autonomous)
If any ❌ → Fix before proceeding
</meta-cognitive-checkpoint>
```

**After Generating Expert Questions (Phase 4):**

```
<meta-cognitive-checkpoint>
Expert Questions Validation:

1. Codebase Integration:
   - ✅/❌ All questions reference specific files from Phase 3?
   - ✅/❌ Questions build on discovery answers?
   - ✅/❌ Technical but PM-answerable language?

2. Decision Clarity:
   - ✅/❌ Each question enables clear implementation decision?
   - ✅/❌ Options explain trade-offs in business terms?

Quality Score: [X/7 checks passed]
Decision: If <6/7 → Revise. If ≥6/7 → Ask questions.
</meta-cognitive-checkpoint>
```

---

## Full Workflow:

### Phase 1: Initial Setup & Codebase Analysis
1. Create timestamp-based folder: requirements/YYYY-MM-DD-HHMM-[slug]
2. Extract slug from $ARGUMENTS (e.g., "add user profile" → "user-profile")
3. Create initial files:
   - 00-initial-request.md with the user's request
   - metadata.json with status tracking
4. Read and update requirements/.current-requirement with folder name
5. **PRE-RESEARCH** - Use MCP tools to gather intelligence BEFORE generating questions:
   - **Prime Search**: Research "[feature-type] implementation patterns best practices"
   - **Brave Search**: Find similar real-world implementations and community discussions
   - **Sequential Thinking**: Analyze potential architectural patterns and conflicts through structured thought processes
6. Use available tools (both MCP and Linux native command) to understand overall structure:
   - Get high-level architecture overview (e.g. `tree` command)
   - Identify main components and services
   - Understand technology stack
   - Note patterns and conventions

### Phase 2: Context Discovery Questions
7. Generate the five most important yes/no questions to understand the problem space:
   - Questions informed by codebase structure
   - Questions about user interactions and workflows
   - Questions about similar features users currently use
   - Questions about data/content being worked with
   - Questions about external integrations or third-party services
   - Questions about performance or scale expectations
8. **Context Setting**: Show brief pre-research summary to user:
   - Key findings from codebase analysis
   - Technologies and patterns detected
   - Overall project structure insights
   - State: "Now I need your input on 5 priorities. All questions written to 01-discovery-questions.md"
9. Write all questions to 01-discovery-questions.md with full research context (markdown format)
10. **Use AskUserQuestion tool** to ask questions in batches with visual interface:
   - **Batch 1**: Ask first 4 questions together (technical priorities)
     - Each question has 2 options: "Yes (Recommended)" and "No"
     - Option descriptions contain: 📊 Codebase findings + 🌐 Industry data + ✅ Best practices
     - Format: "[Action]. [Evidence]. [Use case]. 🎯 [Outcome]" (150-200 chars)
   - **Batch 2**: Ask question 5 alone (documentation scope)
     - Multiple choice with 3-4 options (e.g., "Onboarding", "Planning", "Both", "None")
     - Each option has rich description with context
11. Record all answers to 02-discovery-answers.md and update metadata.json
12. Show confirmation: "✅ All answers recorded. Your priorities: [summary]"

### Phase 3: Targeted Context Gathering (Autonomous)
18. After all discovery questions answered:
   - **Prime Search**: Research best practices and industry standards for confirmed approaches
   - **Brave Search**: Find real-world implementation examples matching user's choices
   - Use available search tools to find specific files based on discovery answers
   - Deep dive into similar features and patterns in codebase
   - **Sequential Thinking**: Validate logical consistency of all discovery answers through structured reasoning
   - Analyze specific implementation details and integration points
   - Document findings in 03-context-findings.md including:
     - Specific files that need modification
     - Exact patterns to follow from codebase and research
     - Similar features analyzed in detail
     - Technical constraints and considerations
     - Integration points identified
     - Research-backed implementation recommendations

### Phase 4: Expert Requirements Questions
13. Now ask questions like a senior developer who knows the codebase:
   - Write the top 5 most pressing unanswered detailed yes/no questions to 04-detail-questions.md
   - Questions should be as if you were speaking to the product manager who knows nothing of the code
   - These questions are meant to clarify expected system behavior now that you have a deep understanding of the code
   - Include smart defaults based on codebase patterns + Phase 3 findings
14. **Context Setting**: Show brief analysis summary:
   - Similar features found in codebase
   - Patterns and integration points identified
   - State: "Now I need clarification on 5 implementation details"
15. **Use AskUserQuestion tool** to ask questions in batches:
   - **Batch 1**: Ask first 3 questions (implementation scope)
     - Each question: 2 options with codebase-specific context
     - Reference actual file paths, component names, patterns
     - Format: "Yes (Recommended)" with evidence from codebase analysis
   - **Batch 2**: Ask last 2 questions (technical details)
     - Same format with technical depth
16. Record all answers to 05-detail-answers.md and update metadata.json
17. Show confirmation: "✅ All expert questions answered. Generating comprehensive requirements..."

### Phase 5: Requirements Documentation
19. Generate comprehensive requirements spec in 06-requirements-spec.md:
   - Problem statement and solution overview
   - Functional requirements based on all answers
   - Technical requirements with specific file paths
   - Implementation hints and patterns to follow
   - Acceptance criteria
   - Assumptions for any unanswered questions
20. Mark requirement as "complete" in metadata.json
21. **STOP HERE** - Show completion message and recommend starting a new session

### Phase 6: Specs Generation (Separate Session - Recommended)
**IMPORTANT**: This should be done in a NEW SESSION to reduce context and provide better results.

After Phase 5 completes, show this message:
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

RECOMMENDED: Start a fresh session for better results
- The requirements phase has built up significant context
- Starting fresh for design/implementation will provide:
  ✓ Better focus on technical architecture
  ✓ More accurate task breakdown
  ✓ Cleaner design documentation
  ✓ Reduced context overhead

To generate executable specifications in a NEW session:
1. Start a new conversation
2. Run: /requirements-specs-generate

---

⚠️ Alternative: Continue in this session (not recommended)
If you prefer to continue immediately despite the context overhead:
- Type: /requirements-specs-generate

What would you like to do?
```

Do NOT automatically proceed to Phase 6. Wait for explicit user action.

## AskUserQuestion Format Examples (WITH AI RESEARCH):

### Discovery Questions (Phase 2) - AskUserQuestion Format:

**Markdown File (01-discovery-questions.md) - Full Research Context:**
```markdown
## Q1: Will users interact with this feature through a visual interface?
**AI Research Context:**
- 📊 Codebase: 12 existing features use UI components in components/ directory
- 🌐 Industry: 87% of similar features use visual interfaces (researched 50+ implementations)
- ✅ Best Practice: Visual interfaces increase adoption by 65% (industry benchmark)
**AI Recommendation:** YES
```

**AskUserQuestion Tool Call - Batch 1 (Questions 1-4):**
```json
{
  "questions": [
    {
      "question": "Will users interact with this feature through a visual interface?",
      "header": "Visual UI",
      "multiSelect": false,
      "options": [
        {
          "label": "Yes (Recommended)",
          "description": "Add visual interface. 📊 Found 12 UI components in components/. 🌐 87% industry adoption. ✅ Increases adoption by 65%. 🎯 Better user experience and engagement."
        },
        {
          "label": "No",
          "description": "API/backend only. Suitable for: background jobs, API endpoints, or CLI tools. ⚠️ Users would need technical knowledge to interact."
        }
      ]
    },
    {
      "question": "Does this feature need to work on mobile devices?",
      "header": "Mobile",
      "multiSelect": false,
      "options": [
        {
          "label": "Yes (Recommended)",
          "description": "Support mobile devices. 📊 Responsive design patterns already in place. 🌐 73% users access on mobile. ✅ All competitors support mobile. 🎯 Wider reach."
        },
        {
          "label": "No",
          "description": "Desktop only. Suitable for: admin tools, internal dashboards, or desktop-specific features. ⚠️ Excludes mobile users."
        }
      ]
    },
    {
      "question": "Will this feature handle sensitive or private user data?",
      "header": "Security",
      "multiSelect": false,
      "options": [
        {
          "label": "Yes (Recommended)",
          "description": "Handle sensitive data with security measures. 📊 Encryption patterns available in utils/security.ts. 🌐 GDPR/privacy laws apply. ✅ Industry standard for user data. 🎯 Trust and compliance."
        },
        {
          "label": "No",
          "description": "No sensitive data. Suitable for: public content, non-personal features. ⚠️ Consider future data needs carefully."
        }
      ]
    },
    {
      "question": "Should this follow your existing Modal Pattern at components/ui/Modal.tsx?",
      "header": "Modal",
      "multiSelect": false,
      "options": [
        {
          "label": "Yes (Recommended)",
          "description": "Use Modal pattern. 📊 Used successfully in 8 features. 🌐 89% user satisfaction. ✅ WCAG 2.1 AA compliant. 🎯 Consistent UX across app."
        },
        {
          "label": "No",
          "description": "Use different pattern. Suitable for: inline editing, full-page forms, or non-modal flows. Requires UX justification."
        }
      ]
    }
  ]
}
```

**AskUserQuestion Tool Call - Batch 2 (Question 5 - Multiple Choice):**
```json
{
  "questions": [
    {
      "question": "What documentation would be most valuable for this feature?",
      "header": "Docs Goal",
      "multiSelect": false,
      "options": [
        {
          "label": "Onboarding",
          "description": "New developer guide. Helps new team members understand quickly. Includes setup, key concepts, workflows. 🎯 Best for growing teams."
        },
        {
          "label": "Planning",
          "description": "Strategic roadmap. Helps with future iterations and maintenance. Includes architecture decisions, tech debt, expansion. 🎯 Best for long-term features."
        },
        {
          "label": "Both (Recommended)",
          "description": "Complete documentation. Onboarding + roadmap. 📊 Most teams choose this for important features. 🎯 Immediate value + long-term reference."
        },
        {
          "label": "None",
          "description": "Skip documentation. Only for: prototypes, temporary features, or when docs exist. ⚠️ May create knowledge gaps."
        }
      ]
    }
  ]
}
```

### Expert Questions (Phase 4) - AskUserQuestion Format:

**Markdown File (04-detail-questions.md):**
```markdown
## Q1: Should we extend the existing UserService at services/UserService.ts?
**AI Research Context:**
- 📊 Codebase: UserService handles 12 user-related operations
- 🌐 Architecture: Service pattern used in 15 other services
- ✅ Industry: 85% extend existing vs. create new
**AI Recommendation:** YES (maintains consistency)
```

**AskUserQuestion Tool Call - Batch 1 (Questions 1-3):**
```json
{
  "questions": [
    {
      "question": "Should we extend the existing UserService at services/UserService.ts?",
      "header": "UserService",
      "multiSelect": false,
      "options": [
        {
          "label": "Yes (Recommended)",
          "description": "Extend UserService. 📊 Already handles 12 operations. ✅ Maintains architectural consistency across 15 services. 🎯 Less code duplication, familiar patterns."
        },
        {
          "label": "No",
          "description": "Create new service. Only if: significantly different domain, would bloat UserService, or needs different lifecycle. ⚠️ Breaks consistency."
        }
      ]
    },
    {
      "question": "Should this use your existing validation patterns in utils/validation.ts?",
      "header": "Validation",
      "multiSelect": false,
      "options": [
        {
          "label": "Yes (Recommended)",
          "description": "Use existing validation. 📊 Reusable patterns for similar inputs. ✅ Consistent errors, proven security, no duplication. 🎯 Faster development."
        },
        {
          "label": "No",
          "description": "Custom validation. Only if: unique validation rules, different validation library needed. ⚠️ More maintenance overhead."
        }
      ]
    },
    {
      "question": "Will this require new database migrations in db/migrations/?",
      "header": "Migrations",
      "multiSelect": false,
      "options": [
        {
          "label": "No (Recommended)",
          "description": "No migrations needed. 📊 Existing tables accommodate this. ✅ 8 of 10 recent features reused schema. 🎯 Faster deployment, less risk."
        },
        {
          "label": "Yes",
          "description": "Add migrations. Needed if: new tables, columns, indexes, or schema changes required. Choose if existing schema truly insufficient."
        }
      ]
    }
  ]
}
```

**Answer Recording (02-discovery-answers.md, 05-detail-answers.md):**
```markdown
# Discovery Answers

Answered: 2025-11-10T14:30:00Z

## Q1: Will users interact with this feature through a visual interface?
**Answer:** Yes (Recommended)

## Q2: Does this feature need to work on mobile devices?
**Answer:** Yes (Recommended)

## Q3: Will this feature handle sensitive or private user data?
**Answer:** Yes (Recommended)

## Q4: Should this follow your existing Modal Pattern?
**Answer:** Yes (Recommended)

## Q5: What documentation would be most valuable?
**Answer:** Both (Recommended)
```

## Important Rules:
- **CRITICAL**: Write ALL questions to markdown file BEFORE asking any (Phase 2: 01-discovery-questions.md, Phase 4: 04-detail-questions.md)
- **CRITICAL**: Use AskUserQuestion tool for visual batch-based question asking:
  - Phase 2: Batch 1 (4 questions) → Batch 2 (1 question)
  - Phase 4: Batch 1 (3 questions) → Batch 2 (2 questions)
- **CRITICAL**: Record answers ONLY AFTER all questions asked (02-discovery-answers.md, 05-detail-answers.md)
- **CRITICAL**: Each option must have rich description with evidence (📊 Codebase + 🌐 Industry + ✅ Best Practice)
- ONLY yes/no questions (or multiple choice for strategic questions)
- Label format: "Yes (Recommended)" or "No" for smart defaults
- Stay focused on requirements (no implementation)
- Use actual file paths and component names in detail phase
- Description format: "[Action]. [Evidence]. [Use case]. 🎯 [Outcome]" (150-200 chars)

## MCP Tools Integration (Use in Phase 1 & Phase 3):
- **Prime Search**: Research industry patterns and best practices BEFORE generating questions
- **Brave Search**: Find real-world examples and competitive analysis BEFORE generating questions
- **Sequential Thinking**: Validate logical consistency and identify conflicts through structured thought processes
- Use research findings to enhance question context (as shown in examples above)
- Research informs question quality, but workflow stays the same

## Metadata Structure:
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

## Metadata Phase Progression:
1. **discovery** - Asking context discovery questions (Phase 2)
2. **context** - Autonomous context gathering (Phase 3)
3. **detail** - Asking expert detail questions (Phase 4)
4. **requirements_complete** - 06-requirements-spec.md generated (Phase 5 complete)
5. **specs_generated** - 07-design.md generated, awaiting approval
6. **specs_complete** - Design approved, 08-tasks.md generated
7. **executing** - Tasks being executed by /requirements-specs-execute
8. **implemented** - All tasks completed

## Phase Transitions:
- After each phase, announce: "Phase complete. Starting [next phase]..."
- Save all work before moving to next phase
- User can check progress anytime with /requirements-status
- After Phase 5 complete, optionally proceed to Phase 6 with /requirements-specs-generate

## Complete Workflow Summary:
```
SESSION 1: Requirements Gathering
/requirements-start → Phase 1-5 → files 00-06 → STOP

SESSION 2: Design & Implementation (Fresh context - Recommended)
/requirements-specs-generate → files 07-08 → /requirements-specs-execute → Implementation

Alternative (Not recommended):
Continue same session → /requirements-specs-generate (higher context overhead)
```

## Why Separate Sessions?

After completing requirements gathering (files 00-06), starting a fresh session for specs generation provides:

1. **Reduced Context Overhead**: Requirements phase builds up significant conversation history
2. **Better Focus**: Fresh session focuses solely on technical architecture and tasks
3. **Cleaner Output**: Design documents generated with clear, focused context
4. **Token Efficiency**: Avoids hitting context limits during implementation
5. **Resumability**: Can pause between requirements and implementation phases

**Recommended Practice**:
- Session 1: `/requirements-start` → Answer questions → Complete Phase 5
- Break / New Day / Fresh Session
- Session 2: `/requirements-specs-generate` → **Validate Design (MANDATORY)** → 08-tasks.md generated → `/requirements-specs-execute`

**Design Validation**: When running `/requirements-specs-generate`, you MUST approve the design before tasks are generated. Claude will:
1. Generate 07-design.md
2. Show you the design
3. Ask: "Is the design spec ok?"
4. Wait for your "yes" to proceed
5. If you request changes, update and ask again
6. Only generate 08-tasks.md after you explicitly approve
