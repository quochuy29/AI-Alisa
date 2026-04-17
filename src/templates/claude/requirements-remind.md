---
description: Show phase-specific rules and reminders
allowed-tools: Read(*)
---

# Phase Rules & Reminders

Show phase-specific rules and workflow reminders for the Requirements system.

---

## Universal Rules (All Phases)

1. **Always** read `requirements/.current-requirement` before acting
2. **Always** verify session state from `metadata.json` — never assume
3. **Maintain traceability**: every code change links to a task → design → requirement
4. **One task per Claude Code session** for `specs-execute` (fresh context = better quality)
5. **Two-step method for bugs**: analyze first, fix only after approval
6. **Never skip design validation** in `specs-generate`

---

## Phase-Specific Rules

### 🔍 Discovery Phase
| Rule | Detail |
|------|--------|
| Question count | Exactly 5 questions per phase |
| Question type | Binary (yes/no) or multiple-choice ONLY |
| Question format | Inline lettered options `[A] / [B] / [C]` |
| File order | Write ALL questions to `.md` BEFORE presenting |
| Batch structure | Phase 2: 4+1 batches; Phase 4: 3+2 batches |
| Recording | Record answers ONLY after all batch questions answered |

### 🔬 Context Phase (Autonomous)
| Rule | Detail |
|------|--------|
| User interaction | NONE — complete analysis silently |
| Tools | `Read` + `Bash` + `Grep` + `Glob` |
| Output | Document EVERY finding in `03-context-findings.md` |
| Required items | File paths, class names, patterns, constraints, risks |

### 💡 Detail Phase
| Rule | Detail |
|------|--------|
| File references | MUST reference actual file paths from Phase 3 |
| Language | PM-answerable (explain technical choices in business terms) |
| Context | Build on discovery answers (security=YES → ask encryption) |

### 📋 Requirements Phase
| Rule | Detail |
|------|--------|
| FR format | Functional Requirements with Given-When-Then ACs |
| AC format | Acceptance Criteria must be testable/measurable |
| Assumptions | Document every assumption made |
| Technical | Include actual file paths in implementation hints |

### 📐 Specs Generate Phase
| Rule | Detail |
|------|--------|
| Design approval | MANDATORY before task generation |
| Approval format | Via AskUserQuestion: Approve / Minor / Major / Detail |
| Loop | Repeat until explicit approval |
| Task generation | Prefer fresh Claude Code session for 100% clean context |
| Task inputs | ONLY use design + requirements + findings (no conversation history) |

### ⚙️ Specs Execute Phase
| Rule | Detail |
|------|--------|
| Session rule | ONE task per Claude Code session — MANDATORY |
| Task order | Follow dependencies from `08-tasks.md` |
| Research | Research existing patterns BEFORE implementing |
| Convention | Follow `CLAUDE.md` strictly |
| Verification | Ask user with AskUserQuestion after each task |
| Completion | Mark `[x]` ONLY after user confirms |
| Logging | Log all changes in `10-change-log.md` |

### 🐛 Bug Fix Phase
| Rule | Detail |
|------|--------|
| No skipping | NEVER skip root cause analysis |
| Autonomy | Phase 2 is 100% autonomous (no user questions) |
| Approval | MUST get Phase 3 approval before any code changes |
| Scope | One bug at a time — focus and quality |
| Traceability | Bug → Task → Design → Requirement |
| Tracking | Update `09-bug-tracker.md` at EVERY phase transition |

### 🔄 Change Review Phase
| Rule | Detail |
|------|--------|
| Impact first | Complete impact analysis BEFORE showing to user |
| Approval | Get approval via AskUserQuestion before applying |
| Cascade | Update spec + design + tasks together |
| Logging | Log every change in `10-change-log.md` |

---

## Claude Code-Specific Rules

### Interaction Pattern
- ✅ Use `AskUserQuestion` tool for ALL decisions and choices
- ✅ Wait for user reply before proceeding
- ❌ Never present choices as plain prose without using AskUserQuestion
- ❌ Never assume intent — always ask when ambiguous

### Session Management
- Each `/requirements-specs-execute` = ONE new Claude Code session
- Fresh session after `/requirements-specs-generate` for tasks (optional but recommended)
- Use `awaitingVerification: true` in metadata to resume interrupted sessions

### Tool Usage
- `Read` — reading files
- `Write` — creating NEW files only
- `Edit` — modifying EXISTING files (always Read first)
- `Bash` — terminal commands (grep, find, tree, test runners, git)
- `Glob` — finding files by pattern
- `Grep` — searching file contents
- `Agent` — invoking specialist sub-agents

---

## Metadata Phase Progression

```
discovery → context → detail → requirements_complete
    → specs_generated → design_approved → specs_complete
        → executing → implemented
            → (side: bug_fixing, change_review)
```

---

## Related Commands

- `/requirements-status` — Check current progress
- `/requirements-current` — View full session details
