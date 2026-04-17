# Skill: Spec Review

Reusable verification protocol. Checks whether actual code matches the defined specification.

---

## When to Use This Skill

Called after an engineer agent completes implementation:
- `requirements-specs-execute` — Phase: Verify
- `requirements-auto-execute` — Phase: Auto-Decision Gate
- `requirements-bug-fix` — Phase: Verify Fix

**SKIP** for Junior-tier tasks (only used for Mid and Senior).

---

## Core Principle

> "Implementer may self-report incorrectly. Read actual code, do not trust self-report."

**Completely independent** — Spec reviewer does NOT know what the engineer claims. Only reads code and spec.

---

## Protocol (4 Steps)

### Step 1 — Read Spec

```
1. Read 06-requirements-spec.md  →  extract FR-X.Y and Acceptance Criteria for the task
2. Read relevant section of 07-design.md  →  extract technical design intent
3. Remember: what CORRECT looks like according to spec
```

### Step 2 — Read Actual Code

```
For each file in files_created and files_modified:
  → Read FULL file content
  → Understand what the code actually does (not what the agent says it does)
```

### Step 3 — Compare

For each requirement (FR-X.Y):
- Is it implemented? Where (file:line)?
- Does implementation match spec intent?

For each Acceptance Criteria (AC-X.Y):
- Is the criterion satisfied by the code?
- Point to the specific code satisfying it.

For each sub-task:
- Is it complete? In which file?

### Step 4 — Detect Drift

```
Missing:     What in spec does code NOT have?
Scope creep: What in code does spec NOT require?
Mismatch:    Spec says X, code does Y?
```

---

## Output — SPEC_REVIEW_RESULT

```yaml
SPEC_REVIEW_RESULT:
  verdict: COMPLIANT | PARTIAL | NON_COMPLIANT

  requirements_check:
    - requirement: "FR-X.Y"
      status: MET | PARTIAL | MISSING
      evidence: "file.ext:line"

  acceptance_criteria_check:
    - criterion: "AC-X.1"
      status: MET | PARTIAL | MISSING
      evidence: "file.ext:line"

  sub_tasks_check:
    - sub_task: "[description]"
      status: DONE | PARTIAL | MISSING

  scope_creep: []
  missing: []
  misunderstandings: []

  summary: "[1-2 sentence overall assessment]"
```

**Output limit: 800 tokens.** Only detail PARTIAL/MISSING/MISMATCH items.

---

## Verdict Rules

| Verdict | Condition |
|---------|-----------|
| **COMPLIANT** | All requirements MET, all ACs MET, no scope creep |
| **PARTIAL** | 1-2 items PARTIAL, zero MISSING, minor scope creep only |
| **NON_COMPLIANT** | Any requirement MISSING, or major misunderstanding of spec intent |

---

## Immutable Principles

1. **Read code, not claims** — never trust agent self-report
2. **Evidence required** — every MET verdict must cite file:line
3. **Independence** — reviewer has no knowledge of implementation process
4. **Scope creep is a finding** — extra code not in spec must be reported
