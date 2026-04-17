---
description: Perform technical code review with eight-pillar analysis
allowed-tools: Bash(*), Read(*), Grep(*), Glob(*), AskUserQuestion(*)
---

# Technical Code Review

Perform a comprehensive technical code review using the **Eight-Pillar Analysis Framework**.

---

## Eight Quality Pillars

| # | Pillar | Focus Areas |
|---|--------|-------------|
| 1 | **Correctness** | Meets all FRs? Acceptance criteria pass? Edge cases handled? |
| 2 | **Performance** | Efficient algorithms? No N+1 queries? Response times? Memory? |
| 3 | **Security** | Input validation? Auth checks? No secrets in code? SQL injection? |
| 4 | **Maintainability** | Readable? Well-named? Low cognitive complexity? DRY? |
| 5 | **Scalability** | Handles growth? No hard-coded limits? Connection pooling? |
| 6 | **Testing** | Coverage ≥80%? Unit + integration? Edge cases tested? |
| 7 | **Documentation** | Non-obvious logic commented? README updated? API docs? |
| 8 | **Architecture** | Follows project patterns? No god classes? Separation of concerns? |

---

## Instructions

1. Read `requirements/.current-requirement`
2. Load `06-requirements-spec.md` (requirements and ACs)
3. Load `07-design.md` (architectural decisions and patterns)
4. Load `metadata.json` → identify phase, completed tasks
5. Identify all implementation files:
   - Read `10-change-log.md` for files modified
   - Run `Bash git diff --name-only HEAD` (if git available)
   - Scan `08-tasks.md` for completed tasks and their files
6. For each pillar, analyze code systematically

---

## Analysis Process

### Pillar 1: Correctness
- Map each FR-X.Y to its implementation
- Verify acceptance criteria (AC-X.Y) are satisfied
- Check error handling completeness
- Verify boundary conditions and edge cases

### Pillar 2: Performance
- Look for: nested loops on large datasets, synchronous blocking calls
- Check: proper use of indexes, caching, pagination
- Measure or estimate: key operation response times vs. TR specs

### Pillar 3: Security
- Check: input sanitization, parameterized queries, authentication gates
- Verify: no hardcoded credentials, no sensitive data in logs
- Review: authorization checks (not just authentication)

### Pillar 4: Maintainability
- Check: function length (<30 lines ideal), class size (<300 lines)
- Verify: single responsibility principle
- Review: naming clarity (no single-letter vars outside loops)

### Pillar 5: Scalability
- Check: stateless design, no in-memory session state at scale
- Verify: no hard limits (file sizes, query limits) without configuration
- Review: resource cleanup (connections, file handles)

### Pillar 6: Testing
- Measure coverage if test runner available: `Bash [coverage command]`
- Verify: happy path + error path + edge cases
- Check: test isolation (no test-to-test dependencies)

### Pillar 7: Documentation
- Check: complex logic has explanatory comments
- Verify: public API methods have docstrings
- Review: README reflects new features

### Pillar 8: Architecture
- Compare against `07-design.md` patterns
- Check: no circular dependencies
- Verify: consistent error handling strategy

---

## Review Report Format

```
╔════════════════════════════════════════════════════════════╗
║  Code Review — [Feature Name]                              ║
╠════════════════════════════════════════════════════════════╣
║  Overall: [✅ PASS | ⚠️ PASS WITH NOTES | ❌ NEEDS WORK]  ║
╚════════════════════════════════════════════════════════════╝

Pillar Results:
  1. Correctness      [✅ PASS | ⚠️ WARN | ❌ FAIL]  [brief note]
  2. Performance      [✅ PASS | ⚠️ WARN | ❌ FAIL]  [brief note]
  3. Security         [✅ PASS | ⚠️ WARN | ❌ FAIL]  [brief note]
  4. Maintainability  [✅ PASS | ⚠️ WARN | ❌ FAIL]  [brief note]
  5. Scalability      [✅ PASS | ⚠️ WARN | ❌ FAIL]  [brief note]
  6. Testing          [✅ PASS | ⚠️ WARN | ❌ FAIL]  [brief note]
  7. Documentation    [✅ PASS | ⚠️ WARN | ❌ FAIL]  [brief note]
  8. Architecture     [✅ PASS | ⚠️ WARN | ❌ FAIL]  [brief note]

Issues Found: [N total]

🔴 Critical ([N]) — must fix before merge:
  - [file:line] [description] ([pillar])

🟠 High ([N]) — should fix before merge:
  - [file:line] [description] ([pillar])

🟡 Medium ([N]) — fix in follow-up:
  - [file:line] [description] ([pillar])

🟢 Low ([N]) — optional improvements:
  - [file:line] [description] ([pillar])

Requirements Compliance:
  ✅ FR-1.1 [satisfied]
  ✅ FR-1.2 [satisfied]
  ⚠️ FR-2.1 [partial — missing edge case]
  ❌ FR-3.1 [not implemented]

Recommendations:
  1. [Specific actionable recommendation with file reference]
  2. [...]
```

---

## Severity Definitions

| Level | Symbol | Meaning |
|-------|--------|---------|
| Critical | 🔴 | Must fix before merging: security holes, data loss, broken core features |
| High | 🟠 | Should fix before merging: performance regression, major maintainability debt |
| Medium | 🟡 | Fix in follow-up PR: minor maintainability, missing test cases |
| Low | 🟢 | Optional improvement: style, extra documentation |

---

## After Review

Present next steps using AskUserQuestion tool:
```
AskUserQuestion("🔍 Review complete. What would you like to do next?", [
  "🐛 Fix critical/high issues found — /requirements-bug-fix",
  "⚙️ Continue with remaining tasks — /requirements-specs-execute",
  "✅ Archive & close session — /requirements-end"
])
```
→ "🐛 Fix…"       : `/requirements-bug-fix`
→ "⚙️ Continue…"  : `/requirements-specs-execute`
→ "✅ Archive…"    : `/requirements-end`
