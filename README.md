# requirement-commands

> CLI-based scaffolding tool for AI coding agents - Quick setup of Requirements commands stack

## Overview

`requirement-commands` is an npm package that enables developers to quickly set up a comprehensive requirements gathering and implementation workflow system for AI coding agents. The package provides **13 prompt commands** and a **specialist sub-agent tier system** that guides AI agents through a structured development process — from requirements gathering to implementation, quality review, and session archiving.

**Editor Support:**
- **Claude Code**: System-wide installation via `~/.claude/commands/`
- **Cursor**: Project-level installation via `.cursor/commands/`, `.cursor/agents/`, `.cursor/rules/`
- **VSCode + GitHub Copilot**: Project-level installation via `.github/prompts/`, `.github/agents/`

## Features

- **Structured Requirements Gathering** - 2-phase PM interview (5+5 questions), autonomous codebase analysis via Code Seeker agent, context-aware detail questions
- **Design & Task Generation** - Technical design document, tier-annotated task breakdown via Task Orchestrator agent
- **Specialist Agent Tiers** - Junior (CRUD/config/scaffolding), Mid (standard features, API, UI), Senior (security/auth/payment/complex) — routed automatically per task complexity
- **Independent Spec Review** - Every implementation verified against spec by a dedicated Spec Reviewer agent before marking tasks complete
- **Knowledge Library** - Project knowledge automatically extracted from each completed session into a reusable library (`requirements/.library/`)
- **Bug Fix & Change Management** - Two-step Analyze→Fix workflow, mid-execution scope change management with full impact analysis
- **Quality Assurance** - Eight-dimension code review, alignment drift detection against spec and design
- **Multi-Editor Support** - Claude Code, Cursor (v2 with agents & skills), VSCode GitHub Copilot (v2 with agents)

## Quick Start (npx - Recommended)

```bash
# Run directly - no installation needed (defaults to init)
npx requirement-commands

# Or with explicit options
npx requirement-commands init --editor=cursor
npx requirement-commands init --editor=vscode-copilot
npx requirement-commands init --editor=both --force
npx requirement-commands init --editor=all   # all three editors
```

> **Tip:** If you encounter cache issues, use `npx requirement-commands@latest`

## Requirements

- Node.js >= 20.0.0
- ESM module support

## Alternative: Global Installation

```bash
npm install -g requirement-commands
```

Or install locally:

```bash
npm install requirement-commands
```

Then run:

```bash
# Interactive mode (prompts for editor choice)
requirement-commands init

# For Claude Code (default)
requirement-commands init --editor=claude-code

# For Cursor
requirement-commands init --editor=cursor

# For VSCode + GitHub Copilot
requirement-commands init --editor=vscode-copilot

# For both Claude Code + Cursor
requirement-commands init --editor=both

# For all three editors
requirement-commands init --editor=all
```

This creates:
- `requirements/` directory with `.current-requirement` pointer file
- Slash commands / prompt files per editor (see table below)
- Specialist sub-agent files per editor

| Editor | Commands dir | Agents dir | Skills/Rules |
|--------|-------------|-----------|-------------|
| Claude Code | `~/.claude/commands/` (13 files) | — | — |
| Cursor | `.cursor/commands/` (13 files) | `.cursor/agents/` (9 files) | `.cursor/rules/` (4 files) |
| VSCode Copilot | `.github/prompts/` (13 files) | `.github/agents/` (9 files) | — |

## Knowledge Library

Requirement Commands v2 includes a built-in **Project Knowledge Library** — a reusable store of patterns, decisions, and lessons learned, extracted automatically from completed sessions.

### How It Works

| Event | Library Action |
|-------|---------------|
| `requirements-start` | Librarian agent injects relevant library knowledge into the session context |
| `requirements-specs-execute` | Implementation informed by prior library patterns |
| `requirements-end` | Curator agent harvests new knowledge from the session into the library |
| `requirements-library` | Manually init, view, query, or harvest the library at any time |

### Library Structure

```
requirements/.library/
├── _catalog.json          ← index of all books (auto-managed)
└── [shelf]/[book].md      ← individual knowledge entries
```

The library is local to the project and can be committed to git alongside `requirements/`.

## Commands

### Phase 1: MVP (Current)

| Command | Description | Availability |
|---------|-------------|--------------|
| `requirement-commands init` | Initialize requirements directory and install slash commands | CLI + Slash |
| `requirement-commands status` | Check current progress and resume workflow | Slash only (/requirements-status) |
| `requirement-commands list` | List all requirements | Slash only (/requirements-list) |
| `requirement-commands current` | View current requirement | Slash only (/requirements-current) |
| `requirement-commands remind` | Show phase rules | Slash only (/requirements-remind) |
| `requirement-commands end` | Complete session | Slash only (/requirements-end) |
| `requirement-commands specs-generate` | Generate design and tasks | Slash only (/requirements-specs-generate) |
| `requirement-commands specs-execute` | Execute tasks | Slash only (/requirements-specs-execute) |
| `requirement-commands spec-enhance` | Handle changes | Slash only (/requirements-spec-enhance) |
| `requirement-commands bug-fix` | Fix issues | Slash only (/requirements-bug-fix) |
| `requirement-commands code-review` | Technical review | Slash only (/requirements-code-review) |
| `requirement-commands revise` | Check alignment | Slash only (/requirements-revise) |

**Phase 1 Note:** The CLI currently supports only the `init` command. For the full requirements workflow, use slash commands in Claude Code after running `requirement-commands init`.

## Supported Editors

| Editor | Status | Notes |
|--------|--------|-------|
| **Claude Code** | ✅ Full support | System-wide `~/.claude/commands/` |
| **Cursor** | ✅ Full support (v2) | Agents + Skills via `.cursor/agents/` and `.cursor/rules/` |
| **VSCode + GitHub Copilot** | ✅ Full support (v2) | Agents via `.github/agents/` |

Use `--editor=all` to install for all three editors simultaneously.

## Development

### Setup

```bash
# Clone repository
git clone https://github.com/yourorg/requirement-commands.git
cd requirement-commands

# Install dependencies
npm install

# Build project
npm run build

# Link for local development
npm link
```

### Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Build TypeScript to JavaScript |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests (coming in Phase 2) |

### Project Structure

```
requirement-commands/
├── bin/
│   └── requirement-commands.js    # CLI entry point
├── src/
│   ├── commands/                   # Command handlers
│   ├── core/
│   │   ├── templates/             # Template installer system
│   │   └── utils/                 # Core utilities
│   ├── templates/
│   │   ├── claude-code/           # Claude Code slash commands (13)
│   │   ├── cursor/                # Cursor v2 commands (13) + agents (8) + skills (4)
│   │   └── copilot/               # Copilot v2 prompts (13) + agents (8)
│   └── schemas/                   # JSON schemas
├── scripts/                       # Build scripts
├── package.json
├── tsconfig.json
└── README.md
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## Support

- **Issues:** https://github.com/yourorg/requirement-commands/issues
- **Documentation:** https://github.com/yourorg/requirement-commands/wiki

## Roadmap

### Completed
- ✅ 13 prompt command templates (all editors)
- ✅ CLI `init` with interactive editor selection
- ✅ Specialist sub-agent tier system (Junior / Mid / Senior)
- ✅ Knowledge Library with librarian + curator agents
- ✅ Spec Reviewer agent (independent spec compliance)
- ✅ Task Orchestrator agent (design → task breakdown)
- ✅ Code Seeker agent (3-perspective codebase analysis)
- ✅ Cursor v2: agents + skills (research-gate, tier-routing, spec-review, library-ops)
- ✅ VSCode Copilot v2: agents
- ✅ Progress spinners and colorized output

### Coming
- Claude Code v2 agent tier system
- Additional editor support (Cline, CodeBuddy)
- Published package registry updates

---

**Version:** 2.0.0
**Status:** v2 — Cursor + Copilot full agent support
