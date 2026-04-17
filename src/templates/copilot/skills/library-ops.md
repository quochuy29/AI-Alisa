# Skill: Library Ops

Reusable knowledge system. Two operations: **Query** (retrieve knowledge into context) and **Harvest** (save knowledge after session).

---

## When to Use This Skill

**Query** — called BY commands before execution:
- `requirements-specs-execute` — Phase: Context Preparation
- `requirements-specs-generate` — Phase: Load context
- `requirements-bug-fix` — Phase: Root Cause Analysis

**Harvest** — called BY `requirements-end` after session completes.

---

## Library Structure

```
requirements/.library/
├── _catalog.json          ← Index of all Books + sectionIndex
├── _rules.json            ← TTL rules, confidence thresholds
├── foundations/           ← Tech stack, folder structure, architecture
├── domain/                ← Domain glossary, business rules
├── conventions/           ← Coding conventions, anti-patterns
├── frameworks/            ← Framework-specific practices
├── patterns/              ← Reusable implementation patterns
├── decisions/             ← Architecture Decision Records (ADR)
├── research/              ← Cached research findings
│   ├── docs/
│   └── web/
└── metrics/               ← Agent performance data
```

**Book** = 1 markdown file, max 2000 tokens, up to 8 sections.
**Shelf** = 1 directory, groups Books of the same type.

---

## Operation 1: QUERY — Retrieve Knowledge Into Context

### When Library doesn't exist (`_catalog.json` not found)

```
→ Skip, continue workflow normally
→ DO NOT report error
```

### When Library has data

**1. Invoke `@librarian` agent** with request:

```yaml
QUERY_REQUEST:
  query_type: "phase_injection"
  library_path: "requirements/.library/"
  workflow_phase: "[current phase name]"
  task_tags: ["[tags from task description]"]
  token_budget: 250   # Junior | 350 Mid | 450 Senior
  section_limit: 3    # Junior | 5 Mid   | 7 Senior
```

**2. Receive `KNOWLEDGE_PACKAGE`** from librarian.

**3. Inject into context** of engineer agent in `TASK_CONTEXT.library_context`.

---

## Operation 2: HARVEST — Save Knowledge After Session

Runs when `requirements-end` is called with a session that has completed tasks.

**1. Invoke `@curator` agent** with request:

```yaml
CATALOGING_REQUEST:
  session_path: "[path to session folder]"
  library_path: "requirements/.library/"
  source_files:
    - "03-context-findings.md"
    - "07-design.md"
    - "metadata.json"
  cataloging_scope: "full"
```

**2. Curator will automatically:**
- Read source artifacts
- Classify knowledge into correct shelf
- Deduplicate with existing Books (Jaccard similarity ≥ 0.70 → merge)
- Assign confidence score by source
- Write Books + update `_catalog.json`

**3. Receive `CATALOGING_REPORT`** — display summary for user.

---

## Confidence Score Reference

| Knowledge Source | Confidence |
|-----------------|------------|
| Verified in actual code | 1.00 |
| From spec + design (reviewed) | 0.85 |
| From context-findings (auto-analyzed) | 0.70 |
| From web research (recent, multi-source) | 0.55 |
| From web research (single source or old) | 0.30 |

---

## Immutable Principles

1. **Library is optional** — if it doesn't exist, skip silently
2. **Token budget is law** — never exceed the allocated budget per tier
3. **Deduplication before write** — always check for existing similar Books
4. **Confidence scores are evidence-based** — never assign max confidence to unverified knowledge
