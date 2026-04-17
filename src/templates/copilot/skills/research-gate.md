# Skill: Research Gate

Reusable research protocol. MUST run BEFORE writing any code.

---

## When to Use This Skill

Called by any command/agent that writes code:
- `requirements-specs-execute` — Phase: Context Preparation
- `requirements-bug-fix` — Phase: Root Cause & Fix Strategy
- Engineer agents (junior/mid/senior) — before implementation

---

## 3 Research Steps

### Step 1 — Library Documentation Lookup (MANDATORY for all libraries)

For each library/framework needed in the task:

```
1. Search for the library documentation (official docs, API references)
2. Extract exact API signatures, patterns, and current best practices
3. Summarize key patterns (~100 tokens/library) — DO NOT paste raw output
```

**Trigger threshold:** Any library/framework in the task → this step is MANDATORY.

**Fallback if no results found:**
1. Try broader topic search
2. Try alternative library name
3. Move to Step 2 (Web Search)
4. If still nothing → use Step 3 (Structured Reasoning) from first principles

---

### Step 2 — Web Search (IF needed)

Triggered when:
- Novel problem not in codebase
- Need industry best practices
- CVE / security vulnerability lookup
- Library docs not sufficient

```
Search: "[problem] [library] best practice 2025"
Validate: 3+ sources, recent, consistent with library docs
```

**DO NOT use web search to replace library docs** — web results may be outdated on APIs.

---

### Step 3 — Structured Reasoning (IF complex logic)

Triggered when:
- Logic has more than 3 decision branches
- New algorithm
- Security / auth / encryption flow
- Multi-component architecture

```
Apply structured step-by-step reasoning to the problem.
Document each decision point and its rationale.
Summarize conclusions.
```

---

## Research Gate Checklist

Before transitioning to writing code, confirm:

```
[ ] Library docs checked for ALL libraries in the task?
[ ] Research results summarized (not raw output)?
[ ] Web search done if novel problem?
[ ] Structured reasoning applied if logic > 3 branches?
```

**If any checkbox is unticked → STOP, complete it first.**

---

## Output Format

After completing research, output BEFORE coding:

```
RESEARCH OUTPUT:
  Library Docs:
    - [library]: [key patterns summary ~100 tokens]
  Web Search: [findings if any, or "N/A"]
  Reasoning: [reasoning summary if any, or "N/A"]
  Key Decision: [1-2 sentences: approach to use and why]
```

---

## Immutable Principles

1. **Research BEFORE Code** — never write code without completing research
2. **Show Evidence** — always display research output before implementation
3. **Current APIs Only** — never use deprecated APIs when current ones exist
4. **Project Conventions First** — follow existing codebase patterns over generic best practices
