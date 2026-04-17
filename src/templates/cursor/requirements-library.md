---
description: Manage project knowledge library — init, view, and maintain
allowed-tools: Bash(*), Read(*), Write(*), AskQuestion(*)
---

# Requirements Library

Quản lý project knowledge library (`requirements/.library/`).

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

3. Call AskQuestion:

```
AskQuestion({
  questions: [{
    id: "library_action",
    prompt: "📚 Project Knowledge Library — What would you like to do?",
    options: [
      { id: "a", label: "Initialize library (new project)" },          // show if empty
      { id: "b", label: "View library catalog" },                       // show if active
      { id: "c", label: "Query library — search for knowledge" },       // show if active
      { id: "d", label: "Refresh / re-harvest from last session" },     // show if active
      { id: "e", label: "Reset library — clear all entries" }           // show if active
    ]
  }]
})
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
  "project": "[extracted from folder name or CURSOR.md]",
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
AskQuestion({
  questions: [{
    id: "seed_source",
    prompt: "Seed the library with initial project knowledge?",
    options: [
      { id: "a", label: "Scan CURSOR.md / CLAUDE.md — import coding rules" },
      { id: "b", label: "Scan README.md — import project overview" },
      { id: "c", label: "Both (Recommended)" },
      { id: "d", label: "Skip — start empty, library fills automatically over time" }
    ]
  }]
})
```

**If [a], [b], or [c]:** Read the selected files, extract key rules/patterns, create a seed book:

```
requirements/.library/project-foundation.md
```

With sections:
- `## Coding Standards` (from CURSOR.md rules)
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

**If [d]:** Skip seeding, library will auto-populate via curator when sessions complete.

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
AskQuestion({
  questions: [{
    id: "view_book",
    prompt: "View contents of a specific book?",
    options: [
      { id: "a", label: "Yes — enter book name" },
      { id: "b", label: "No — back to main menu" }
    ]
  }]
})
```

→ `"a"`: Read `requirements/.library/[book-id].md` and display contents
→ `"b"`: Done

---

## Action C: Query Library

Follow `skills/library-ops.md` (Query operation) interactively:

Ask user for search terms:

```
AskQuestion({
  questions: [{
    id: "query_terms",
    prompt: "What topic or keywords do you want to search in the library?",
    options: []   // open-ended text input
  }]
})
```

Invoke `agents/librarian.md` with:
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
2. Follow `skills/library-ops.md` (Harvest operation) — invoke `agents/curator.md` with that session
3. Show:
   ```
   📚 Re-harvest complete from: [session-name]
   New entries: [N] | Updated: [M] | Skipped duplicates: [K]
   ```

---

## Action E: Reset Library

```
AskQuestion({
  questions: [{
    id: "confirm_reset",
    prompt: "⚠️ This will delete ALL library entries. Are you sure?",
    options: [
      { id: "a", label: "Yes — delete everything and start fresh" },
      { id: "b", label: "Cancel" }
    ]
  }]
})
```

→ `"a"`:
```bash
rm -rf requirements/.library/
mkdir -p requirements/.library
```
Re-initialize with empty `_catalog.json` (same as Action A, skip seed prompt).

→ `"b"`: Do nothing, acknowledge cancellation.

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
