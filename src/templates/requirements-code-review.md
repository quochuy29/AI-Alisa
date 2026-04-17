# Code Review - Technical Quality Analysis

Perform comprehensive technical code review focusing on quality, security, performance, and production readiness.

---

## Purpose

This command provides **universal, tech-agnostic code quality analysis**. It dynamically discovers project-specific rules, coding standards, and best practices rather than relying on hardcoded knowledge.

**Key Differentiation from `/requirements-revise`:**

| Aspect | `/requirements-revise` | `/requirements-code-review` |
|--------|------------------------|----------------------------|
| **Focus** | Alignment with design/requirements | Technical code quality |
| **Question** | "Does code match specs?" | "Is code well-written?" |
| **Checks** | FR-X satisfaction, scope drift | Project standards + industry best practices |
| **Output** | Drift detection report | Quality grade + findings |
| **Dependency** | Requires requirements files (06-08) | Works independently |

**Core Principle:** Command contains PROCESS, not KNOWLEDGE. Rules are discovered, not hardcoded.

---

## Usage

```bash
# Review all uncommitted changes
/requirements-code-review

# Review specific files or directory
/requirements-code-review [path]

# Review with specific focus areas
/requirements-code-review --focus security,performance

# Review specific commit range
/requirements-code-review --range HEAD~5..HEAD

# Review in specific depth mode
/requirements-code-review --depth thorough

# Force re-discovery of project rules (ignore cache)
/requirements-code-review --refresh

# Show cached context without running review
/requirements-code-review --show-cache

# Clear cached context
/requirements-code-review --clear-cache
```

### Cache Behavior

| Flag | Behavior |
|------|----------|
| (none) | Use cached context if valid (<7 days), else discover |
| `--refresh` | Force full re-discovery, update cache |
| `--show-cache` | Display cached rules and exit |
| `--clear-cache` | Delete cache file and exit |

**Cache Location:**
- Standalone: `.claude/code-review-context.json`
- In workflow: `requirements/[session]/code-review-cache.json`

---

## Your Role: Senior Code Reviewer

**You are a Staff Engineer** performing systematic code review through:
- **Dynamic Discovery**: Find project-specific rules, don't assume them
- **Research-Backed Analysis**: Use MCP tools to understand framework best practices
- **Context-Aware Evaluation**: Apply standards relevant to THIS project
- **Delegated Fixes**: Hand off fixes to specialized agents for quality

**Your Philosophy**:
- "Every project has its own standards - discover them first"
- "Best practices evolve - research current recommendations"
- "Fixes deserve the same rigor as original implementation"
- "Process over hardcoded knowledge"

---

## Review Depth Modes

<depth-modes>
| Mode | Time | Coverage | Use When |
|------|------|----------|----------|
| **QUICK** | ~5 min | Critical issues only, minimal research | Pre-commit sanity check |
| **STANDARD** | ~15 min | All 8 pillars, moderate research | Normal code review |
| **THOROUGH** | ~30+ min | Deep analysis, extensive MCP research | Pre-release, security-critical |

**Default**: STANDARD (can be overridden with `--depth`)
</depth-modes>

---

## Workflow

### Phase 1: Change Detection

<change-detection>
**Gather code changes based on scope:**

```bash
# Default: All uncommitted changes
git diff HEAD --stat
git diff HEAD

# If path specified: Filter to path
git diff HEAD -- [path]

# If range specified: Use commit range
git diff [range] --stat
git diff [range]
```

**Extract metrics:**
- Total files changed
- Lines added/removed/modified
- File types/extensions
- Directories affected

**Categorize changed files:**

| Category | Detection | Review Priority |
|----------|-----------|-----------------|
| Source Code | Common code extensions | All 8 pillars |
| Configuration | .json, .yaml, .xml, .env, etc. | Security, compatibility |
| Database | .sql, migrations folders | Security, performance |
| Tests | test/spec in path or filename | Testing pillar |
| Infrastructure | Dockerfile, k8s, terraform | Security, compatibility |
| Documentation | .md, .txt, .rst | Skip (unless requested) |
</change-detection>

---

### Phase 2: Project Context Discovery ⭐

<project-context-discovery>
**This phase is CRITICAL. Do not analyze code until project context is understood.**

#### Step 2.1: Detect Tech Stack

**Scan for package/dependency files:**

```bash
# Use Glob to find package files
Glob: package.json, composer.json, requirements.txt, pyproject.toml,
      go.mod, Cargo.toml, Gemfile, pom.xml, build.gradle, *.csproj
```

**Extract from found files:**
- Primary language(s)
- Frameworks in use
- Key dependencies
- Version constraints

#### Step 2.2: Scan for Coding Standards Files

**Look for project-specific rules:**

```bash
# Linting/Formatting (Glob patterns)
.eslintrc*, eslint.config.*, .prettierrc*, prettier.config.*
.stylelintrc*, .markdownlint*
phpcs.xml*, phpstan.neon*, .php-cs-fixer*
.pylintrc, .flake8, pyproject.toml (tool sections), setup.cfg
.rubocop.yml, .standardrb
.golangci.yml, .golangci.yaml
rustfmt.toml, .rustfmt.toml, clippy.toml
.clang-format, .clang-tidy
.editorconfig
tslint.json (legacy), biome.json

# Security scanning
.snyk, .trivyignore, .gitleaks.toml
sonar-project.properties, .sonarcloud.properties

# Testing
jest.config.*, vitest.config.*, .nycrc*, codecov.yml
phpunit.xml*, pytest.ini, .coveragerc
```

**For each found file:**
- Read and extract key rules
- Note severity configurations
- Identify custom rules vs defaults

#### Step 2.3: Check CLAUDE.md

**If project has CLAUDE.md, extract:**
- Tech stack specifications
- Coding conventions section
- Security requirements
- Testing standards
- File structure patterns
- Naming conventions

#### Step 2.4: Check Cached Context (Smart Discovery)

**Check for existing cached context to avoid redundant discovery:**

```
<cache-check>
LOCATION: .claude/code-review-context.json (project root)
         OR requirements/[session]/metadata.json (if in workflow)

IF cache exists AND --refresh NOT specified:
  1. Read cached context
  2. Check cache freshness:
     - cache.timestamp < 7 days old? → Use cache
     - package files modified since cache? → Invalidate
     - CLAUDE.md modified since cache? → Invalidate

  3. IF cache valid:
     → Show: "📦 Using cached project context (cached [date])"
     → Show: "   Use --refresh to force re-discovery"
     → SKIP Steps 2.1-2.3, proceed with cached rules

  4. IF cache invalid OR --refresh:
     → Proceed with full discovery (Steps 2.1-2.3)
     → Will persist new context in Step 2.7

CACHE STRUCTURE:
{
  "version": "1.0",
  "timestamp": "ISO-8601",
  "projectRoot": "/path/to/project",
  "techStack": {
    "language": "TypeScript",
    "framework": "React 18",
    "packageManager": "npm",
    "keyDependencies": ["axios", "prisma", "zod"]
  },
  "codingStandards": {
    "sources": [".eslintrc.json", "CLAUDE.md", "tsconfig.json"],
    "rules": [
      {"rule": "no-unused-vars", "severity": "error", "source": ".eslintrc.json"},
      {"rule": "camelCase functions", "severity": "convention", "source": "CLAUDE.md"}
    ]
  },
  "qualityTools": {
    "linter": {"tool": "eslint", "config": ".eslintrc.json"},
    "formatter": {"tool": "prettier", "config": ".prettierrc"},
    "typeChecker": {"tool": "typescript", "config": "tsconfig.json"},
    "securityScanner": {"tool": "npm audit", "available": true}
  },
  "context7Research": {
    "frameworks": [
      {"name": "React", "id": "/facebook/react", "keyInsights": ["hooks preferred", "no direct DOM"]}
    ],
    "cachedAt": "ISO-8601"
  },
  "customRules": []
}
</cache-check>
```

**If requirements/[session]/metadata.json exists (workflow mode):**
- Look for `projectRules` field
- Look for `codingStandards` field
- Look for `techStack` field
- Extract any custom review criteria
- Merge with cached context (workflow rules take precedence)

#### Step 2.5: MCP Research (Dynamic Best Practices)

**Context7 - Framework-specific standards:**

```
For each detected framework:
1. mcp__context7__resolve-library-id("[framework]")
2. mcp__context7__get-library-docs(
     libraryId,
     query: "[framework] best practices coding standards security"
   )
```

**Extract from Context7:**
- Recommended patterns
- Anti-patterns to avoid
- Security considerations
- Performance guidelines

**Brave Search - Current security landscape (THOROUGH mode):**

```
mcp__brave-search__brave_web_search(
  query: "[tech-stack] security vulnerabilities best practices 2024 2025",
  count: 5
)
```

**Extract from Brave:**
- Recent CVEs for dependencies
- Current security recommendations
- Industry-standard practices

#### Step 2.6: User Confirmation

**Present discovered context and ask for confirmation:**

```json
{
  "questions": [
    {
      "question": "I've discovered the following project context. Is this correct, and are there additional rules I should know about?",
      "header": "Context",
      "multiSelect": false,
      "options": [
        {
          "label": "Yes, proceed with review",
          "description": "Discovered context is accurate. Proceed with code review using these standards."
        },
        {
          "label": "Add custom rules",
          "description": "I have additional coding standards or rules not captured. Let me specify them."
        },
        {
          "label": "Adjust focus areas",
          "description": "Change the priority of review pillars (e.g., focus more on security, less on style)."
        },
        {
          "label": "Skip confirmation",
          "description": "Trust discovered context. Don't ask me again for this session."
        }
      ]
    }
  ]
}
```

**If "Add custom rules":**
- Ask user to describe additional rules
- Incorporate into review criteria

**If "Adjust focus areas":**
- Present 8 pillars
- Ask which to prioritize/skip

**CONTEXT DISCOVERY OUTPUT (MANDATORY):**

```
═══════════════════════════════════════════════════════════════════
📋 PROJECT CONTEXT DISCOVERED
═══════════════════════════════════════════════════════════════════

TECH STACK:
├── Language: [detected]
├── Framework: [detected]
├── Key Dependencies: [list]
└── Version: [if detectable]

CODING STANDARDS FOUND:
├── [file]: [summary of rules]
├── [file]: [summary of rules]
└── CLAUDE.md: [conventions extracted]

MCP RESEARCH:
├── Context7 ([framework]):
│   ├── Best Practice: [key point]
│   ├── Anti-Pattern: [to avoid]
│   └── Security: [consideration]
└── Brave (if THOROUGH):
    └── [relevant findings]

REVIEW RULES APPLIED:
├── [Rule 1 - source]
├── [Rule 2 - source]
└── [Rule N - source]

═══════════════════════════════════════════════════════════════════
```

**⛔ Cannot proceed to Phase 3 without completing context discovery.**

#### Step 2.7: Persist Context to Cache ⭐

**After successful context discovery, save for future reviews:**

```
<persist-context>
IF discovery was performed (not loaded from cache):

  1. BUILD cache object from discovered data:
     - techStack: from Step 2.1
     - codingStandards: from Step 2.2
     - qualityTools: from Step 2.2 (linters, formatters found)
     - context7Research: summarized from Step 2.5
     - customRules: from user input (Step 2.6)

  2. DETERMINE cache location:
     - IF in requirements workflow → requirements/[session]/code-review-cache.json
     - ELSE → .claude/code-review-context.json (project root)

  3. WRITE cache file:
     ```json
     {
       "version": "1.0",
       "timestamp": "[current ISO-8601]",
       "projectRoot": "[cwd]",
       "techStack": { ... },
       "codingStandards": { ... },
       "qualityTools": { ... },
       "context7Research": { ... },
       "customRules": [ ... ],
       "reviewHistory": []
     }
     ```

  4. SHOW confirmation:
     "💾 Project context cached to [path]"
     "   Future reviews will load instantly (7-day validity)"

CACHE BENEFITS:
├── Skip redundant Context7 calls (saves ~30 seconds)
├── Consistent rules across review sessions
├── User custom rules preserved
└── Quality tool detection reused
</persist-context>
```

#### Step 2.8: Update Review History

**Track review sessions for audit trail:**

```
<update-history>
After each review completion (Phase 6):

  1. READ existing cache
  2. APPEND to reviewHistory:
     {
       "date": "ISO-8601",
       "filesReviewed": 8,
       "grade": "B",
       "score": 68,
       "criticalFindings": 0,
       "highFindings": 2,
       "fixesApplied": 1
     }
  3. WRITE updated cache

  4. IF in requirements workflow:
     → Also update metadata.json with:
       "lastCodeReview": {
         "date": "ISO-8601",
         "grade": "B",
         "score": 68
       }
</update-history>
```
</project-context-discovery>

---

### Phase 3: Eight-Pillar Analysis

<pillar-analysis>
**IMPORTANT:** Pillar checks are GENERATED from discovered context, not hardcoded.

#### How Analysis Works

For each pillar:
1. **Reference discovered rules** for this category
2. **Apply Context7 findings** for framework-specific checks
3. **Search code** for patterns that violate discovered rules
4. **Score based on** project-specific standards

#### Pillar 1: Code Quality & Style (10 pts)

**Dynamic checks based on:**
- Linting rules from .eslintrc, .pylintrc, etc.
- Naming conventions from CLAUDE.md
- Formatting rules from .prettierrc, .editorconfig
- Context7 recommendations for [framework] style

**Universal checks (always apply):**
- Consistency within changed files
- Readability of new code
- Appropriate code comments (why, not what)

#### Pillar 2: Security (10 pts)

**Dynamic checks based on:**
- Context7: "[framework] security vulnerabilities common patterns"
- Security tool configs (.snyk, sonar-project.properties)
- CLAUDE.md security requirements
- Brave search: Recent CVEs for detected dependencies

**Universal checks (always apply):**
- Secrets/credentials in code (API keys, passwords)
- Input handling (user data flows)
- Authentication/authorization patterns

#### Pillar 3: Performance (10 pts)

**Dynamic checks based on:**
- Context7: "[framework] performance anti-patterns"
- Project-specific performance requirements
- Database library documentation (N+1, query optimization)

**Universal checks (always apply):**
- Obvious inefficiencies (nested loops on large data)
- Resource management (file handles, connections)
- Async/blocking patterns

#### Pillar 4: Stack Compatibility (10 pts)

**Dynamic checks based on:**
- Context7: "[framework] deprecated APIs breaking changes"
- Package version constraints
- Framework migration guides

**Universal checks (always apply):**
- Consistent import patterns
- API contract changes
- Backward compatibility concerns

#### Pillar 5: Error Handling (10 pts)

**Dynamic checks based on:**
- Context7: "[framework] error handling best practices"
- Logging framework conventions
- Project error handling patterns

**Universal checks (always apply):**
- Unhandled error paths
- Error information exposure
- Graceful degradation

#### Pillar 6: Testing (10 pts)

**Dynamic checks based on:**
- Test framework config (jest.config, pytest.ini)
- Coverage requirements from CI config
- Project testing conventions

**Universal checks (always apply):**
- Test file presence for new code
- Test quality (assertions, not just snapshots)
- Edge case consideration

#### Pillar 7: Dependencies (10 pts)

**Dynamic checks based on:**
- Dependency audit tools (npm audit, pip-audit)
- Lock file changes
- License requirements

**Execute security scan:**
```bash
# Detect and run appropriate audit
npm audit --json 2>/dev/null ||
yarn audit --json 2>/dev/null ||
pip-audit --format json 2>/dev/null ||
composer audit 2>/dev/null
```

#### Pillar 8: Architecture (10 pts)

**Dynamic checks based on:**
- Context7: "[framework] architecture patterns"
- CLAUDE.md architecture guidelines
- Project structure conventions

**Universal checks (always apply):**
- Module boundaries respected
- Coupling between components
- Single responsibility indicators
</pillar-analysis>

---

### Phase 4: Scoring & Grading

<scoring-system>
**Pillar Scoring (0-10 each):**

| Score | Rating | Meaning |
|-------|--------|---------|
| 9-10 | Excellent | Meets/exceeds discovered standards |
| 7-8 | Good | Minor deviations from standards |
| 5-6 | Acceptable | Several standard violations |
| 3-4 | Concerning | Significant violations |
| 0-2 | Critical | Major violations, blocks merge |

**Severity Classification:**

| Level | Icon | Meaning | Action |
|-------|------|---------|--------|
| CRITICAL | 🔴 | Violates security/stability standards | Must fix before merge |
| HIGH | 🟠 | Significant standard violation | Should fix before merge |
| MEDIUM | 🟡 | Moderate deviation from standards | Recommended to fix |
| LOW | 🟢 | Minor style/convention issue | Optional improvement |
| INFO | ℹ️ | Observation or suggestion | Informational only |

**Overall Grade:**
```
Total Score = Sum of 8 pillar scores (0-80)

Grade:
├── A (72-80): Excellent - Ready for production
├── B (64-71): Good - Minor improvements recommended
├── C (56-63): Acceptable - Address issues before merge
├── D (48-55): Below Standard - Significant revision needed
└── F (<48): Failing - Major refactoring required

Pass Threshold: 56/80 (70%)
```

**Merge Readiness:**
- **✅ READY**: Grade A or B, no CRITICAL findings
- **⚠️ CONDITIONAL**: Grade C, or Grade B with HIGH findings
- **❌ NOT READY**: Grade D or F, or any CRITICAL findings
</scoring-system>

---

### Phase 5: Report Generation

<report-format>
```
═══════════════════════════════════════════════════════════════════
📊 CODE REVIEW REPORT
═══════════════════════════════════════════════════════════════════

Review Date: [ISO-8601]
Reviewed By: Claude Code Review
Depth Mode: [QUICK|STANDARD|THOROUGH]
Changes Analyzed: [X files, Y lines added, Z lines removed]

Project Context:
├── Tech Stack: [discovered]
├── Standards Applied: [sources]
└── Custom Rules: [if any]

───────────────────────────────────────────────────────────────────
OVERALL GRADE: [A/B/C/D/F] ([score]/80)
MERGE READINESS: [✅ READY | ⚠️ CONDITIONAL | ❌ NOT READY]
───────────────────────────────────────────────────────────────────

PILLAR SCORES:
├── Code Quality:      [X]/10 [██████████]
├── Security:          [X]/10 [████████░░]
├── Performance:       [X]/10 [█████████░]
├── Compatibility:     [X]/10 [███████░░░]
├── Error Handling:    [X]/10 [████████░░]
├── Testing:           [X]/10 [██████░░░░]
├── Dependencies:      [X]/10 [█████████░]
└── Architecture:      [X]/10 [███████░░░]

───────────────────────────────────────────────────────────────────
🔴 CRITICAL FINDINGS ([count])
───────────────────────────────────────────────────────────────────

[For each critical finding:]
• [Pillar] [File:Line] [Title]
  Issue: [Description]
  Standard: [Which discovered rule this violates]
  Evidence: [Code snippet]
  Recommendation: [How to fix]

───────────────────────────────────────────────────────────────────
🟠 HIGH PRIORITY ([count])
───────────────────────────────────────────────────────────────────
[Similar format...]

───────────────────────────────────────────────────────────────────
🟡 MEDIUM PRIORITY ([count])
───────────────────────────────────────────────────────────────────
[Similar format...]

───────────────────────────────────────────────────────────────────
🟢 LOW PRIORITY ([count])
───────────────────────────────────────────────────────────────────
[Summarized list...]

───────────────────────────────────────────────────────────────────
💡 TOP RECOMMENDATIONS
───────────────────────────────────────────────────────────────────

1. [Highest priority action]
2. [Second priority]
3. [Third priority]

═══════════════════════════════════════════════════════════════════
```
</report-format>

---

### Phase 6: User Action & Fix Delegation ⭐

<user-action>
**Present action options:**

```json
{
  "questions": [
    {
      "question": "Based on the code review findings, what would you like to do?",
      "header": "Action",
      "multiSelect": false,
      "options": [
        {
          "label": "Fix issues (delegate to agent)",
          "description": "Delegate fixes to code-engineer agent for quality implementation with research and verification."
        },
        {
          "label": "Review specific pillar",
          "description": "Get detailed analysis for a specific pillar before deciding on fixes."
        },
        {
          "label": "Accept and proceed",
          "description": "Acknowledge findings and proceed without fixes. Use when grade is acceptable or time-constrained."
        },
        {
          "label": "Generate fix backlog",
          "description": "Create a task list for future fixes without implementing now. Good for tech debt tracking."
        }
      ]
    }
  ]
}
```
</user-action>

---

### Phase 7: Fix Delegation to code-engineer Agent ⭐

<fix-delegation>
**CRITICAL: Fixes are DELEGATED to code-engineer agent, not done inline.**

**Why Delegation:**
- Context isolation (fresh agent context for each fix)
- Research gate enforced (agent must use Context7)
- Structured verification (20-point checklist)
- Quality consistency (same protocol as task execution)
- Parallel capability (multiple fixes can run simultaneously)

#### Fix Delegation Protocol

**Step 7.1: Package Fix Task**

For each issue to fix, create FIX_TASK:

```yaml
FIX_TASK:
  issue_id: "[PILLAR-NNN]"
  severity: "[CRITICAL|HIGH|MEDIUM|LOW]"
  pillar: "[Pillar name]"
  file_path: "[path/to/file]"
  line_number: [N]
  issue_description: "[What is wrong]"
  violated_standard: "[Which rule/standard this violates]"
  evidence: "[Code snippet showing the issue]"
  recommendation: "[Suggested fix approach]"

  project_context:
    tech_stack: "[discovered tech stack]"
    framework: "[primary framework]"
    coding_standards:
      - source: "[.eslintrc / CLAUDE.md / Context7]"
        rules: "[relevant rules for this fix]"
    claude_md_path: "[path if exists]"
```

**Step 7.2: Invoke code-engineer Agent**

```
Task(
  subagent_type: "code-engineer",
  description: "Fix [PILLAR-NNN] [issue title]",
  prompt: """
<fix_task_specification>
You are fixing a code review issue. Apply the same rigor as implementing a new feature.

ISSUE DETAILS:
- ID: [issue_id]
- Severity: [severity]
- File: [file_path]:[line_number]
- Problem: [issue_description]
- Standard Violated: [violated_standard]
- Evidence: [code snippet]

FIX REQUIREMENTS:
- Address the specific issue identified
- Follow project coding standards: [standards summary]
- Do NOT introduce new issues
- Maintain existing functionality

</fix_task_specification>

<project_constraints>
Tech Stack: [tech_stack]
Framework: [framework]
Standards: [coding_standards summary]
</project_constraints>

<research_requirements>
MANDATORY: Use Context7 to research proper fix pattern for [framework]
Query: "[framework] [issue type] fix best practice"
</research_requirements>

<output_format>
Return IMPLEMENTATION_PACKAGE with:
- research_evidence: What Context7 said about fixing this
- implementation: Files modified with line counts
- self_review: Score and research_gate status
- verification: How to verify the fix works
</output_format>
"""
)
```

**Step 7.3: Validate Agent Output**

Check returned IMPLEMENTATION_PACKAGE:
- `research_gate >= 4` (agent did research)
- `score >= 16` (quality threshold met)
- Files actually modified
- No new issues introduced

**Step 7.4: Present Fix to User**

```
═══════════════════════════════════════════════════════════════════
✅ FIX APPLIED: [PILLAR-NNN]
═══════════════════════════════════════════════════════════════════

Issue: [description]
File: [path]:[line]

Research Applied:
└── Context7: [what agent found]

Changes Made:
└── [file]: [lines modified]

Verification:
└── [how to verify]

Agent Score: [X]/20 (Research Gate: [Y]/4)

[AskUserQuestion: Accept fix / Request revision / Skip this fix]
═══════════════════════════════════════════════════════════════════
```

**Step 7.5: Handle Multiple Fixes**

If user selected multiple issues to fix:
- Can run agents in parallel for independent fixes
- Run sequentially for fixes in same file
- Aggregate results and present summary

```
═══════════════════════════════════════════════════════════════════
📋 FIX SUMMARY
═══════════════════════════════════════════════════════════════════

Fixes Attempted: [N]
├── ✅ Successful: [X]
├── ⚠️ Needs Review: [Y]
└── ❌ Failed: [Z]

[Details for each...]
═══════════════════════════════════════════════════════════════════
```
</fix-delegation>

---

## Meta-Cognitive Verification

<meta-verification>
**Before presenting report, verify analysis quality:**

```
┌─────────────────────────────────────────────────────────────────┐
│ REVIEW QUALITY SELF-CHECK                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ CONTEXT DISCOVERY:                                              │
│ □ Tech stack correctly identified                               │
│ □ Coding standards files found and parsed                       │
│ □ CLAUDE.md conventions extracted (if exists)                   │
│ □ Context7 research completed for framework                     │
│ □ User confirmed/adjusted context                               │
│                                                                 │
│ ANALYSIS QUALITY:                                               │
│ □ Each finding references discovered rule                       │
│ □ Evidence provided for each finding                            │
│ □ No hardcoded assumptions (all from discovery)                 │
│ □ Severity appropriate for project context                      │
│                                                                 │
│ RECOMMENDATIONS:                                                │
│ □ Actionable and specific                                       │
│ □ Reference project standards                                   │
│ □ Priority order makes sense                                    │
│                                                                 │
│ QUALITY SCORE: [X]/12 passed                                    │
│ If <10/12: Re-analyze weak areas before presenting              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```
</meta-verification>

---

## Integration with Workflow

<workflow-integration>
**Standalone Usage:**
```bash
# Any time, any codebase
/requirements-code-review
```

**After Task Execution:**
```bash
# After /requirements-specs-execute completes a task
/requirements-code-review
# Reviews only the task's changes, discovers project context
```

**Before PR/Merge:**
```bash
# Review entire branch diff
/requirements-code-review --range origin/main..HEAD
```

**Complementary with `/requirements-revise`:**
```
1. /requirements-code-review → Technical quality (dynamic rules)
2. /requirements-revise → Requirements alignment check
3. Both pass → Ready for merge
```

**Fix Workflow:**
```
Issue Found → User selects "Fix" → Delegate to code-engineer agent
           → Agent: Research → Implement → Verify
           → Return to user for approval
```
</workflow-integration>

---

## Quick Reference

<quick-reference>
```
┌─────────────────────────────────────────────────────────────────┐
│  CODE REVIEW COMMAND PROTOCOL                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PHASE 1: Change Detection                                      │
│  □ Git diff analysis                                            │
│  □ File categorization                                          │
│                                                                 │
│  PHASE 2: Context Discovery ⭐ (WITH SMART CACHING)              │
│  □ Check cache (.claude/code-review-context.json)               │
│  ├── IF valid cache → Load & skip to Phase 3                    │
│  └── IF no cache OR --refresh:                                  │
│      □ Detect tech stack (package files)                        │
│      □ Find coding standards (.eslintrc, etc.)                  │
│      □ Read CLAUDE.md conventions                               │
│      □ Context7 research for framework                          │
│      □ User confirmation                                        │
│      □ PERSIST to cache (Step 2.7) ⭐                            │
│                                                                 │
│  PHASE 3: Eight-Pillar Analysis (DYNAMIC)                       │
│  □ Apply discovered/cached rules (not hardcoded)                │
│  □ Reference Context7 findings                                  │
│  □ Score based on project standards                             │
│                                                                 │
│  PHASE 4: Report Generation                                     │
│  □ Grade calculation                                            │
│  □ Findings with rule references                                │
│                                                                 │
│  PHASE 5: User Action                                           │
│  □ Present options                                              │
│                                                                 │
│  PHASE 6: Fix Delegation (if selected)                          │
│  □ Package FIX_TASK                                             │
│  □ Invoke code-engineer agent                                   │
│  □ Validate agent output                                        │
│  □ Present to user                                              │
│  □ Update review history in cache (Step 2.8) ⭐                  │
│                                                                 │
│  KEY PRINCIPLES:                                                │
│  • Rules are DISCOVERED, not HARDCODED                          │
│  • Context is CACHED for fast subsequent reviews                │
│  • History is TRACKED for audit trail                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Cache Commands:**
```bash
--refresh      # Force re-discovery
--show-cache   # View cached rules
--clear-cache  # Delete cache
```
</quick-reference>

---

## Related Commands

- `/requirements-revise` - Requirements alignment check (different focus)
- `/requirements-specs-execute` - Execute implementation tasks
- `/requirements-status` - View workflow status
- `/discovery-start` - Codebase analysis

---

## Example Session

<example>
```
User: /requirements-code-review

Claude: 📊 Analyzing code changes...

Detecting changes: git diff HEAD
Found: 8 files changed, 342 lines added, 45 lines removed

═══════════════════════════════════════════════════════════════════
📋 PROJECT CONTEXT DISCOVERY
═══════════════════════════════════════════════════════════════════

Scanning for project context...

TECH STACK DETECTED:
├── Language: TypeScript
├── Framework: React 18 + Express
├── Package Manager: npm
└── Key Dependencies: axios, prisma, zod

CODING STANDARDS FOUND:
├── .eslintrc.json: 47 rules configured
│   └── Key: no-unused-vars (error), @typescript-eslint/strict
├── .prettierrc: Tabs, single quotes, trailing commas
├── CLAUDE.md: Found - extracting conventions...
│   └── Naming: camelCase for functions, PascalCase for components
│   └── Security: All user input must be validated with zod
└── tsconfig.json: strict mode enabled

MCP RESEARCH (Context7):
├── React 18:
│   ├── Best Practice: Use hooks, avoid class components
│   ├── Anti-Pattern: Direct DOM manipulation
│   └── Performance: Memoize expensive computations
└── Express:
    ├── Best Practice: Middleware error handling
    ├── Security: Helmet middleware, input sanitization
    └── Anti-Pattern: Sync operations in handlers

═══════════════════════════════════════════════════════════════════

[AskUserQuestion: Context correct? Additional rules?]

User: Yes, proceed with review

Claude: Running 8-pillar analysis with discovered rules...

═══════════════════════════════════════════════════════════════════
📊 CODE REVIEW REPORT
═══════════════════════════════════════════════════════════════════

Review Date: 2025-01-05T14:30:00Z
Depth Mode: STANDARD
Changes Analyzed: 8 files, 342 lines added, 45 removed

───────────────────────────────────────────────────────────────────
OVERALL GRADE: B (68/80)
MERGE READINESS: ⚠️ CONDITIONAL
───────────────────────────────────────────────────────────────────

🟠 HIGH PRIORITY (2)

• [Security] src/api/userController.ts:45 - Input not validated
  Issue: User input passed directly to prisma query
  Standard: CLAUDE.md - "All user input must be validated with zod"
  Evidence: `prisma.user.findUnique({ where: { id: req.params.id } })`
  Recommendation: Add zod schema validation before query

• [Security] src/utils/auth.ts:23 - Weak hashing algorithm
  Issue: Using crypto.createHash('md5') for passwords
  Standard: Context7 (Express security) - Use bcrypt for passwords
  Evidence: `crypto.createHash('md5').update(password)`
  Recommendation: Switch to bcrypt with cost factor 12+

[AskUserQuestion: What would you like to do?]

User: Fix issues (delegate to agent)

Claude: Delegating fixes to code-engineer agent...

Invoking agent for: [Security] Input validation fix...

═══════════════════════════════════════════════════════════════════
✅ FIX APPLIED: SEC-001
═══════════════════════════════════════════════════════════════════

Issue: Input not validated with zod
File: src/api/userController.ts:45

Research Applied:
└── Context7 (zod): Schema validation pattern for request params

Changes Made:
└── src/api/userController.ts: Added zod schema, validated input

Agent Score: 18/20 (Research Gate: 4/4)

[Proceeding to next fix...]
```
</example>

---

## Notes

- This command is **tech-agnostic** - discovers rules dynamically
- Rules come from: project files, CLAUDE.md, MCP research, user input
- No hardcoded patterns - all checks generated from discovered context
- Fixes are delegated to code-engineer agent for quality and context isolation
- Works independently of requirements workflow
