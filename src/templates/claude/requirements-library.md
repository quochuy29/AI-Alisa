---
description: Manage project knowledge library — init, view, query, and harvest
allowed-tools: Bash(*), Read(*), Write(*), AskUserQuestion(*), Agent(*)
---

# Requirements Library

Manage project knowledge library (`requirements/.library/`).

---

## Boot: Detect Library State

1. Check `requirements/.library/_catalog.json`:
   - Exists → `libraryState = active`, load catalog summary
   - Not found → `libraryState = empty`

2. Show state:

```
Library: ✓ Active — [N] books, [M] entries     [if active]
Library: ✗ Not initialized                      [if empty]
```

3. Call AskUserQuestion:

```
AskUserQuestion("📚 Project Knowledge Library — What would you like to do?", [
  "Initialize library (new project)",           // show if empty
  "View library catalog",                        // show if active
  "Query library — search for knowledge",        // show if active
  "Refresh / re-harvest from last session",      // show if active
  "Reset library — clear all entries"            // show if active
])
```

→ Route to section matching chosen action below.

---

## Action A: Initialize Library

### Step 1 — Create Structure

```bash
mkdir -p requirements/.library
```

Create `requirements/.library/_catalog.json`:

```json
{
  "version": "1.0",
  "project": "[extracted from folder name or CLAUDE.md]",
  "created": "[ISO-8601]",
  "lastUpdated": "[ISO-8601]",
  "stats": {
    "totalBooks": 0,
    "totalEntries": 0,
    "lastHarvest": null
  },
  "books": []
}
```

### Step 2 — Seed Initial Context (optional)

Ask user if they want to seed project context:

```
AskUserQuestion("Seed the library with initial project knowledge?", [
  "Scan CLAUDE.md — import coding rules",
  "Scan README.md — import project overview",
  "Both (Recommended)",
  "Skip — start empty, library fills automatically over time"
])
```

**If "Scan CLAUDE.md", "Scan README.md", or "Both":** Read the selected files, extract key rules/patterns, create a seed book:

```
requirements/.library/project-foundation.md
```

With sections:
- `## Coding Standards` (from CLAUDE.md rules)
- `## Project Overview` (from README.md)
- `## Tech Stack` (detected from package.json / composer.json / go.mod etc.)

Add entry to `_catalog.json`:
```json
{
  "bookId": "project-foundation",
  "title": "Project Foundation",
  "shelf": "architecture",
  "confidence": 0.9,
  "source": "manual-seed",
  "createdAt": "[ISO-8601]",
  "entries": [...]
}
```

**If "Skip":** Skip seeding, library will auto-populate via curator when sessions complete.

### Step 3 — Confirm

```
✅ Library initialized at requirements/.library/
   Books: [N] | Source: [seed source or "empty"]

Library will grow automatically as you complete sessions via /requirements-end.
To view: /requirements-library  →  View catalog
```

---

## Action B: View Catalog

Read `requirements/.library/_catalog.json` and list all books.

Show:

```
══════════════════════════════════════════════════════
📚 Project Knowledge Library
══════════════════════════════════════════════════════
Project  : [name]
Books    : [N]
Entries  : [M]
Updated  : [last harvest timestamp]
══════════════════════════════════════════════════════

SHELF: architecture
  📖 project-foundation       [confidence: 0.9]  [M entries]  [date]
  📖 system-design-patterns   [confidence: 0.85] [M entries]  [date]

SHELF: implementation
  📖 auth-patterns            [confidence: 0.95] [M entries]  [date]
  📖 api-conventions          [confidence: 0.8]  [M entries]  [date]

SHELF: lessons-learned
  📖 common-pitfalls          [confidence: 0.75] [M entries]  [date]
══════════════════════════════════════════════════════
```

Ask to view a specific book:

```
AskUserQuestion("View contents of a specific book?", [
  "Yes — enter book name",
  "No — back to main menu"
])
```

→ "Yes": Read `requirements/.library/[book-id].md` and display contents
→ "No": Done

---

## Action C: Query Library

Ask user for search terms:

```
AskUserQuestion("What topic or keywords do you want to search in the library?")
```

Use Agent tool to invoke `librarian` agent with:
```yaml
LIBRARY_QUERY_REQUEST:
  workflow_phase: "manual-query"
  task_tags: [user's keywords]
  token_budget: 500
```

Display returned `<library_context>` sections directly in chat.

---

## Action D: Re-harvest from Last Session

Re-run knowledge harvest from the most recently archived session.

1. Find latest session in `requirements/archive/` (sort by folder name desc)
2. Use Agent tool to invoke `curator` agent with that session
3. Show:
   ```
   📚 Re-harvest complete from: [session-name]
   New entries: [N] | Updated: [M] | Skipped duplicates: [K]
   ```

---

## Action E: Reset Library

```
AskUserQuestion("⚠️ This will delete ALL library entries. Are you sure?", [
  "Yes — delete everything and start fresh",
  "Cancel"
])
```

→ "Yes":
```bash
rm -rf requirements/.library/
mkdir -p requirements/.library
```
Re-initialize with empty `_catalog.json` (same as Action A, skip seed prompt).

→ "Cancel": Do nothing, acknowledge cancellation.

---

## Library Structure Reference

```
requirements/.library/
├── _catalog.json           ← Index: all books, metadata, confidence scores
├── project-foundation.md   ← Seed: coding rules, tech stack, conventions
├── [feature-slug].md       ← Auto-harvested from each completed session
└── ...
```

**Shelves (categories):**
| Shelf | Contents |
|-------|----------|
| `architecture` | System design, patterns, tech decisions |
| `implementation` | Code patterns, API conventions, reusable snippets |
| `domain` | Business rules, data models, domain logic |
| `lessons-learned` | Pitfalls, bugs encountered, best practices discovered |

---

## Related Commands

- `/requirements-start` — Library auto-queried during codebase analysis
- `/requirements-specs-execute` — Library injected into task context
- `/requirements-end` — Library auto-harvested after session completes
