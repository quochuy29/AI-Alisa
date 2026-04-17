/**
 * Template Manager
 * Manages markdown template generation and file operations
 */

import { readFile, writeFile, ensureDir, getClaudeCommandsDir, getClaudeAgentsDir, getClaudeSkillsDir, getCursorCommandsDir, getCursorAgentsDir, getCursorSkillsDir, getCopilotPromptsDir, getCopilotAgentsDir, getCopilotSkillsDir, exists, InstallScope } from '../utils/file-system.js';
import { generateTimestamp } from '../utils/validation.js';
import { generateClaudeCodeSlashCommands } from './claude-code-template.js';
import { generateCopilotPrompts, generateCopilotFrontmatter } from './copilot-template.js';
import { generateCursorSlashCommands } from './cursor-template.js';
import chalk from 'chalk';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Agent type
 */
export type AgentType = 'claude-code';

/**
 * Editor type - supported AI code editors for slash commands
 */
export type EditorType = 'claude-code' | 'cursor' | 'vscode-copilot' | 'both' | 'all';

/**
 * Resolve the project name from package.json or cwd basename.
 * Strips @scope/ prefix, lowercases, and replaces spaces/slashes with "-".
 */
export function resolveProjectName(): string {
  try {
    const pkgPath = path.join(process.cwd(), 'package.json');
    const raw = fs.readFileSync(pkgPath, 'utf-8');
    const pkg = JSON.parse(raw) as { name?: unknown };
    if (typeof pkg.name === 'string' && pkg.name.trim()) {
      const stripped = pkg.name.replace(/^@[^/]+\//, '');
      return stripped.toLowerCase().replace(/[\s/]+/g, '-');
    }
  } catch {
    // fall through to basename
  }
  return path.basename(process.cwd()).toLowerCase().replace(/[\s/]+/g, '-');
}

/**
 * Template Manager class
 */
export class TemplateManager {
  private templatesDir: string;
  private forceMode: boolean = false;
  private scope: InstallScope = 'userdata';

  constructor() {
    this.templatesDir = path.join(__dirname, '../../templates');
  }

  /**
   * Set force mode for file overwrites
   * @param force - If true, overwrite existing files; if false, skip them
   */
  setForceMode(force: boolean): void {
    this.forceMode = force;
  }

  /**
   * Set install scope (project / workspace / userdata)
   */
  setScope(scope: InstallScope): void {
    this.scope = scope;
  }

  /**
   * Read a template file
   */
  async readTemplate(templateName: string): Promise<string> {
    const templatePath = path.join(this.templatesDir, templateName);
    return await readFile(templatePath);
  }

  /**
   * Generate AGENTS.md content
   */
  generateAgentsMd(): string {
    return `# Requirements Commands - Universal Agent Instructions

## Overview

This directory contains the Requirements commands system for AI coding agents. The system provides 12 markdown-based commands that guide AI agents through a structured development process from requirements gathering to implementation and maintenance.

## File Structure

\`\`\`
requirements/
├── .current-requirement          # Pointer to active requirement session
├── .agents/                        # Agent-specific configurations
│   ├── claude.md
│   ├── cline.md
│   └── ...
├── YYYY-MM-DD-HHMM-[feature-slug]/  # Requirement sessions
│   ├── 00-initial-request.md
│   ├── 01-discovery-questions.md
│   ├── 02-discovery-answers.md
│   ├── 03-context-findings.md
│   ├── 04-detail-questions.md
│   ├── 05-detail-answers.md
│   ├── 06-requirements-spec.md
│   ├── 07-design.md
│   ├── 08-tasks.md
│   ├── 09-bug-tracker.md
│   ├── 10-change-log.md
│   ├── 11-change-backlog.md
│   └── metadata.json
└── ...
\`\`\`

## Phase States

- \`discovery\` - Asking context discovery questions
- \`context\` - Autonomous codebase analysis
- \`detail\` - Asking expert detail questions
- \`requirements_complete\` - Requirements spec generated
- \`specs_generated\` - Design generated, awaiting approval
- \`design_approved\` - Design approved, tasks pending
- \`specs_complete\` - Design and tasks generated
- \`executing\` - Tasks being executed
- \`implemented\` - All tasks complete
- \`bug_fixing\` - Bug fix in progress
- \`change_review\` - Change request in progress

## Universal Rules

1. Always read \`requirements/.current-requirement\` to identify active session
2. Use \`metadata.json\` for phase and progress tracking
3. Never assume session state - always verify from files
4. Follow the workflow defined in each markdown command file
5. Maintain traceability throughout the development process

## Commands Reference

| Command | Purpose | When to Use |
|---------|---------|-------------|
| \`/requirements-start\` | Begin requirements gathering | Starting new feature |
| \`/requirements-status\` | Check progress | Anytime to see state |
| \`/requirements-list\` | List all requirements | Review all sessions |
| \`/requirements-current\` | View current requirement | See full details |
| \`/requirements-remind\` | Show phase rules | When deviating from rules |
| \`/requirements-end\` | Complete session | When requirements done |
| \`/requirements-specs-generate\` | Generate design & tasks | After requirements complete |
| \`/requirements-specs-execute\` | Execute tasks | After design approved |
| \`/requirements-spec-enhance\` | Handle changes | During implementation |
| \`/requirements-bug-fix\` | Fix bugs | When issues found |
| \`/requirements-code-review\` | Review code | Quality assurance |
| \`/requirements-revise\` | Check alignment | Verify implementation |

## Getting Started

1. Run \`requirement-commands init\` to initialize the requirements directory
2. Use \`/requirements-start [description]\` to begin a new requirement session
3. Follow the prompts and complete each phase
4. Use \`/requirements-status\` to check progress at any time

For more information, see the individual command files in the requirements directory.
`;
  }

  /**
   * Generate project.md content
   */
  generateProjectMd(): string {
    return `# Project Context

This file provides project-specific context for AI coding agents when working with Requirements commands.

## Project Information

Add your project-specific information here:

- **Project Name:** [Your Project Name]
- **Description:** [Brief project description]
- **Tech Stack:** [List of technologies used]
- **Architecture:** [Brief architecture overview]

## Codebase Structure

Describe your codebase structure:

\`\`\`
src/
├── components/
├── services/
├── utils/
└── ...
\`\`\`

## Development Guidelines

Add any project-specific development guidelines:

- Coding standards
- Testing requirements
- Deployment process
- Code review process

## Important Notes

Add any important notes for AI agents:

- Known issues
- Workarounds
- Special considerations
- TODO items
`;
  }

  /**
   * Generate metadata.json content
   */
  generateMetadataJson(featureSlug: string): string {
    const timestamp = generateTimestamp();
    const metadata = {
      sessionId: `${timestamp}-${featureSlug}`,
      phase: 'discovery',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      files: [
        '00-initial-request.md',
        '01-discovery-questions.md',
        '02-discovery-answers.md',
        '03-context-findings.md',
        '04-detail-questions.md',
        '05-detail-answers.md',
        '06-requirements-spec.md',
        '07-design.md',
        '08-tasks.md',
        '09-bug-tracker.md',
        '10-change-log.md',
        '11-change-backlog.md'
      ]
    };
    return JSON.stringify(metadata, null, 2);
  }

  /**
   * Write AGENTS.md to the requirements directory
   */
  async writeAgentsMd(requirementsDir: string): Promise<void> {
    const content = this.generateAgentsMd();
    const filePath = path.join(requirementsDir, 'AGENTS.md');
    await writeFile(filePath, content);
  }

  /**
   * Write project.md to the requirements directory
   */
  async writeProjectMd(requirementsDir: string): Promise<void> {
    const content = this.generateProjectMd();
    const filePath = path.join(requirementsDir, 'project.md');
    await writeFile(filePath, content);
  }

  /**
   * Write metadata.json to a requirement session directory
   */
  async writeMetadataJson(sessionDir: string, featureSlug: string): Promise<void> {
    const content = this.generateMetadataJson(featureSlug);
    const filePath = path.join(sessionDir, 'metadata.json');
    await writeFile(filePath, content);
  }

  /**
   * Create a new requirement session directory
   */
  async createSessionDir(requirementsDir: string, featureSlug: string): Promise<string> {
    const timestamp = generateTimestamp();
    const sessionName = `${timestamp}-${featureSlug}`;
    const sessionDir = path.join(requirementsDir, sessionName);
    await ensureDir(sessionDir);
    return sessionDir;
  }

  /**
   * Write the .current-requirement pointer file
   */
  async writeCurrentRequirementPointer(requirementsDir: string, sessionName: string): Promise<void> {
    const filePath = path.join(requirementsDir, '.current-requirement');
    await writeFile(filePath, sessionName);
  }

  /**
   * Generate agent-specific configuration
   */
  generateAgentConfig(agent: AgentType): string {
    switch (agent) {
      case 'claude-code':
        return this.generateAgentsMd();
      default:
        throw new Error(`Unknown agent type: ${agent}`);
    }
  }

  /**
   * Write agent configuration to the .agents directory
   */
  async writeAgentConfig(requirementsDir: string, agent: AgentType): Promise<void> {
    const content = this.generateAgentConfig(agent);
    const agentsDir = path.join(requirementsDir, '.agents');
    await ensureDir(agentsDir);
    const configFileName = `${agent}.md`;
    const filePath = path.join(agentsDir, configFileName);
    await writeFile(filePath, content);
  }

  /**
   * Generate a slash command markdown file with frontmatter
   */
  async generateSlashCommand(
     _commandName: string,
     description: string,
     allowedTools: string,
     content: string
   ): Promise<string> {
    return `---
description: ${description}
allowed-tools: ${allowedTools}
---

${content}`;
  }

  /**
   * Install slash commands to specific editor
   * @param editor - Editor type ('claude-code' or 'cursor')
   */
  private async installToEditor(editor: 'claude-code' | 'cursor' | 'vscode-copilot'): Promise<void> {
    let commandsDir: string;

    if (editor === 'claude-code') {
      commandsDir = getClaudeCommandsDir(this.scope);
    } else if (editor === 'cursor') {
      commandsDir = getCursorCommandsDir(this.scope);
    } else {
      commandsDir = getCopilotPromptsDir(this.scope);
    }

    await ensureDir(commandsDir);

    if (editor === 'vscode-copilot') {
      const prompts = generateCopilotPrompts();

      /** Map command names to their Copilot-specific source template file names */
      const sourceTemplateMap: Record<string, string> = {
        'requirements-start': 'copilot/requirements-start.md',
        'requirements-status': 'copilot/requirements-status.md',
        'requirements-list': 'copilot/requirements-list.md',
        'requirements-current': 'copilot/requirements-current.md',
        'requirements-remind': 'copilot/requirements-remind.md',
        'requirements-end': 'copilot/requirements-end.md',
        'requirements-specs-generate': 'copilot/requirements-specs-generate.md',
        'requirements-specs-execute': 'copilot/requirements-specs-execute.md',
        'requirements-spec-enhance': 'copilot/requirements-spec-enhance.md',
        'requirements-bug-fix': 'copilot/requirements-bug-fix.md',
        'requirements-code-review': 'copilot/requirements-code-review.md',
        'requirements-revise': 'copilot/requirements-revise.md',
        'requirements-library': 'copilot/requirements-library.md',
      };

      for (const [commandName, promptData] of Object.entries(prompts)) {
        const filePath = path.join(commandsDir, `${commandName}.prompt.md`);

        // Check if file exists and skip (unless --force)
        if (exists(filePath) && !this.forceMode) {
          console.log(`⚠️ Skipped ${commandName}.prompt.md (already exists)`);
          continue;
        }

        // Use rich source template content when available; fall back to minimal content
        let bodyContent = promptData.content;
        const templateFileName = sourceTemplateMap[commandName];
        if (templateFileName) {
          try {
            bodyContent = await this.readTemplate(templateFileName);
          } catch {
            // Source template not found – use the minimal inline content
          }
        }

        const frontmatter = generateCopilotFrontmatter(promptData);
        const content = `${frontmatter}\n\n${bodyContent}`;

        await writeFile(filePath, content);
      }

      // Generate README.md in .github/prompts/ for Copilot installations
      await this.generateCopilotPromptsReadme(commandsDir);

      // Generate the orchestrator agent file in .github/agents/
      await this.installCopilotAgent();

      // Install specialist sub-agents to .github/agents/
      await this.installCopilotSubAgents();

      // Install skill protocol files to .github/prompts/
      await this.installCopilotSkills();
    } else if (editor === 'cursor') {
      const commands = generateCursorSlashCommands();

      /** Map command names to their Cursor-specific source template file names */
      const sourceTemplateMap: Record<string, string> = {
        'requirements-start':          'cursor/requirements-start.md',
        'requirements-status':         'cursor/requirements-status.md',
        'requirements-list':           'cursor/requirements-list.md',
        'requirements-current':        'cursor/requirements-current.md',
        'requirements-remind':         'cursor/requirements-remind.md',
        'requirements-end':            'cursor/requirements-end.md',
        'requirements-specs-generate': 'cursor/requirements-specs-generate.md',
        'requirements-specs-execute':  'cursor/requirements-specs-execute.md',
        'requirements-spec-enhance':   'cursor/requirements-spec-enhance.md',
        'requirements-bug-fix':        'cursor/requirements-bug-fix.md',
        'requirements-code-review':    'cursor/requirements-code-review.md',
        'requirements-revise':         'cursor/requirements-revise.md',
        'requirements-library':        'cursor/requirements-library.md',
      };

      for (const [commandName, commandData] of Object.entries(commands)) {
        const filePath = path.join(commandsDir, `${commandName}.md`);

        // Check if file exists and skip (unless --force)
        if (exists(filePath) && !this.forceMode) {
          console.log(`⚠️ Skipped ${commandName}.md (already exists)`);
          continue;
        }

        // Use rich Cursor-specific template when available; fall back to inline content
        let bodyContent = commandData.content;
        const templateFileName = sourceTemplateMap[commandName];
        if (templateFileName) {
          try {
            bodyContent = await this.readTemplate(templateFileName);
          } catch {
            // Source template not found – use inline content from cursor-template.ts
          }
        }

        const content = await this.generateSlashCommand(
          commandName,
          commandData.description,
          commandData.allowedTools,
          bodyContent
        );

        await writeFile(filePath, content);
      }

      // Install sub-agents and skills
      await this.installCursorSubAgents();
      await this.installCursorSkills();

      // Generate README.md and orchestrator rule in .cursor/commands/
      await this.generateCursorCommandsReadme(commandsDir);
      await this.installCursorAgent(commandsDir);
    } else {
      const commands = generateClaudeCodeSlashCommands();

      /** Map command names to their Claude Code-specific source template file names */
      const sourceTemplateMap: Record<string, string> = {
        'requirements-start':          'claude/requirements-start.md',
        'requirements-status':         'claude/requirements-status.md',
        'requirements-list':           'claude/requirements-list.md',
        'requirements-current':        'claude/requirements-current.md',
        'requirements-remind':         'claude/requirements-remind.md',
        'requirements-end':            'claude/requirements-end.md',
        'requirements-specs-generate': 'claude/requirements-specs-generate.md',
        'requirements-specs-execute':  'claude/requirements-specs-execute.md',
        'requirements-spec-enhance':   'claude/requirements-spec-enhance.md',
        'requirements-bug-fix':        'claude/requirements-bug-fix.md',
        'requirements-code-review':    'claude/requirements-code-review.md',
        'requirements-revise':         'claude/requirements-revise.md',
        'requirements-library':        'claude/requirements-library.md',
      };

      for (const [commandName, commandData] of Object.entries(commands)) {
        const filePath = path.join(commandsDir, `${commandName}.md`);

        // Check if file exists and skip (unless --force)
        if (exists(filePath) && !this.forceMode) {
          console.log(`⚠️ Skipped ${commandName}.md (already exists)`);
          continue;
        }

        // Use rich Claude-specific template when available; fall back to inline content
        let bodyContent = commandData.content;
        const templateFileName = sourceTemplateMap[commandName];
        if (templateFileName) {
          try {
            bodyContent = await this.readTemplate(templateFileName);
          } catch {
            // Source template not found – use inline content from claude-code-template.ts
          }
        }

        const content = await this.generateSlashCommand(
          commandName,
          commandData.description,
          commandData.allowedTools,
          bodyContent
        );

        await writeFile(filePath, content);
        console.log(`  ${chalk.green('✔')} ${commandsDir}/${commandName}.md`);
      }

      // Install orchestrator agent and sub-agents to ~/.claude/agents/
      await this.installClaudeAgent();
      await this.installClaudeSubAgents();

      // Install skill protocol files to ~/.claude/commands/
      await this.installClaudeSkills();
    }
  }

  /**
   * Install the main orchestrator agent to ~/.claude/agents/requirements-agent.md
   */
  private async installClaudeAgent(): Promise<void> {
    const agentsDir = getClaudeAgentsDir(this.scope);
    await ensureDir(agentsDir);

    const agentFilePath = path.join(agentsDir, 'requirements-agent.md');
    if (exists(agentFilePath) && !this.forceMode) {
      console.log('⚠️ Skipped requirements-agent.md (already exists)');
      return;
    }

    const agentBody = await this.readTemplate('claude/requirements-agent.md').catch(() => '');
    if (!agentBody) return;

    const frontmatter = [
      '---',
      'name: requirements-agent',
      'description: >-',
      '  Alisa — Requirements Manager orchestrator for the full software development lifecycle.',
      '  Routes user requests to the correct /requirements-* slash command and guides through',
      '  capture, design, implementation, review, and close stages.',
      '  Use proactively when the user mentions features, bugs, tasks, specs, or requirements work.',
      'tools: [Read, Write, Bash, Edit, Glob, Grep, AskUserQuestion, Agent]',
      '---',
      '',
    ].join('\n');

    await writeFile(agentFilePath, frontmatter + agentBody);
    console.log(`  ${chalk.green('✔')} ${agentsDir}/requirements-agent.md`);
  }

  /**
   * Install all sub-agent files from src/templates/claude/agents/ to ~/.claude/agents/
   * Claude agent templates already contain their own complete frontmatter (name, description, model, tools).
   */
  private async installClaudeSubAgents(): Promise<void> {
    const agentsDir = getClaudeAgentsDir(this.scope);
    await ensureDir(agentsDir);

    const agentNames = [
      'junior-engineer',
      'mid-engineer',
      'senior-engineer',
      'spec-reviewer',
      'task-orchestrator',
      'code-seeker',
      'librarian',
      'curator',
    ];

    for (const agentName of agentNames) {
      const destPath = path.join(agentsDir, `${agentName}.md`);

      if (exists(destPath) && !this.forceMode) {
        console.log(`⚠️ Skipped ${agentName}.md (already exists)`);
        continue;
      }

      const agentContent = await this.readTemplate(`claude/agents/${agentName}.md`).catch(() => '');
      if (!agentContent) continue;

      await writeFile(destPath, agentContent);
      console.log(`  ${chalk.green('✔')} ${agentsDir}/${agentName}.md`);
    }
  }

  /**
   * Install sub-agent files from src/templates/cursor/agents/ to .cursor/agents/
   * Each agent gets Cursor agent frontmatter (name, description, tools).
   */
  private async installCursorSubAgents(): Promise<void> {
    const agentsDir = getCursorAgentsDir(this.scope);
    await ensureDir(agentsDir);

    const agentMetadata: Record<string, { description: string; tools: string }> = {
      'junior-engineer':    { description: 'Junior engineer agent (Haiku tier) — simple CRUD, config, types, CSS, scaffolding', tools: '[Read, Write, Bash]' },
      'mid-engineer':       { description: 'Mid-level engineer agent (Sonnet tier, default) — standard features, API, UI, tests', tools: '[Read, Write, Bash]' },
      'senior-engineer':    { description: 'Senior engineer agent (Opus tier) — complex, security-critical, or novel work', tools: '[Read, Write, Bash]' },
      'spec-reviewer':      { description: 'Spec reviewer — independently verifies implementation against requirements spec', tools: '[Read, Bash]' },
      'task-orchestrator':  { description: 'Task orchestrator — breaks approved design into executable 08-tasks.md with tier annotations', tools: '[Read, Write]' },
      'code-seeker':        { description: 'Code seeker — analyzes codebase from Architect/Developer/Product perspectives', tools: '[Read, Bash]' },
      'librarian':          { description: 'Librarian — queries project knowledge library and retrieves relevant context (read-only)', tools: '[Read]' },
      'curator':            { description: 'Curator — harvests knowledge from completed sessions into project library books', tools: '[Read, Write]' },
    };

    for (const [agentName, meta] of Object.entries(agentMetadata)) {
      const destPath = path.join(agentsDir, `${agentName}.md`);

      if (exists(destPath) && !this.forceMode) {
        console.log(`⚠️ Skipped ${agentName}.md (already exists)`);
        continue;
      }

      const agentBody = await this.readTemplate(`cursor/agents/${agentName}.md`).catch(() => '');
      if (!agentBody) continue;

      const frontmatter = [
        '---',
        `name: ${agentName}`,
        `description: ${meta.description}`,
        `tools: ${meta.tools}`,
        '---',
        '',
      ].join('\n');

      await writeFile(destPath, frontmatter + agentBody);
      console.log(`  ${chalk.green('✔')} .cursor/agents/${agentName}.md`);
    }
  }

  /**
   * Install skill protocol files per the Agent Skills open standard.
   * Each skill is installed as .cursor/skills/skill-{name}/SKILL.md
   * The `name` field in SKILL.md frontmatter must match the directory name.
   */
  private async installCursorSkills(): Promise<void> {
    const skillsBaseDir = getCursorSkillsDir(this.scope);

    const skillMetadata: Record<string, { description: string; argumentHint?: string }> = {
      'skill-research-gate': {
        description: 'Research gate protocol — runs library docs lookup + web search + structured reasoning before any code is written. Use when starting implementation of any task that involves libraries or frameworks.',
        argumentHint: '[library names] [task description]',
      },
      'skill-tier-routing': {
        description: 'Tier routing protocol — determines the correct engineer agent (Junior/Mid/Senior) from task complexity, packages context, and delegates. Use when deciding which specialist agent should implement a task.',
        argumentHint: '[task number] [optional: override tier]',
      },
      'skill-spec-review': {
        description: 'Spec review protocol — independently verifies that the actual code matches the requirements spec. Use after an engineer agent completes implementation to verify compliance.',
        argumentHint: '[task number] [files changed]',
      },
      'skill-library-ops': {
        description: 'Library operations — queries the project knowledge library before implementation, and harvests new knowledge after a session ends. Use to inject prior project patterns into context or archive learned knowledge.',
        argumentHint: 'query|harvest [optional: session path]',
      },
    };

    for (const [skillName, meta] of Object.entries(skillMetadata)) {
      const skillDir = path.join(skillsBaseDir, skillName);
      const destPath = path.join(skillDir, 'SKILL.md');

      if (exists(destPath) && !this.forceMode) {
        console.log(`⚠️ Skipped ${skillName}/SKILL.md (already exists)`);
        continue;
      }

      const skillBody = await this.readTemplate(`cursor/skills/${skillName.replace('skill-', '')}.md`).catch(() => '');
      if (!skillBody) continue;

      await ensureDir(skillDir);

      const frontmatterLines = [
        '---',
        `name: ${skillName}`,
        `description: >-`,
        `  ${meta.description}`,
      ];
      if (meta.argumentHint) {
        frontmatterLines.push(`argument-hint: '${meta.argumentHint}'`);
      }
      frontmatterLines.push('---', '');

      await writeFile(destPath, frontmatterLines.join('\n') + skillBody);
      console.log(`  ${chalk.green('✔')} .cursor/skills/${skillName}/SKILL.md`);
    }
  }

  /**
   * Install Copilot Agent Skills per the open Agent Skills standard (agentskills.io).
   * Each skill is a directory under .github/skills/ containing a SKILL.md file.
   * Directory name must match the `name` field in SKILL.md frontmatter.
   *
   * Structure created:
   *   .github/skills/
   *     skill-research-gate/SKILL.md
   *     skill-tier-routing/SKILL.md
   *     skill-spec-review/SKILL.md
   *     skill-library-ops/SKILL.md
   */
  private async installCopilotSkills(): Promise<void> {
    const skillsBaseDir = getCopilotSkillsDir(this.scope);

    const skillMetadata: Record<string, { description: string; argumentHint?: string }> = {
      'skill-research-gate': {
        description: 'Research gate protocol — runs library docs lookup + web search + structured reasoning before any code is written. Use this skill when starting implementation of any task that involves libraries or frameworks.',
        argumentHint: '[library names] [task description]',
      },
      'skill-tier-routing': {
        description: 'Tier routing protocol — determines the correct engineer agent (Junior/Mid/Senior) from task complexity, packages context, and delegates. Use this skill when deciding which specialist agent should implement a task.',
        argumentHint: '[task number] [optional: override tier]',
      },
      'skill-spec-review': {
        description: 'Spec review protocol — independently verifies that the actual code matches the requirements spec. Use this skill after an engineer agent completes implementation to verify compliance.',
        argumentHint: '[task number] [files changed]',
      },
      'skill-library-ops': {
        description: 'Library operations — queries the project knowledge library before implementation, and harvests new knowledge after a session ends. Use this skill to inject prior project patterns into context or to archive learned knowledge.',
        argumentHint: 'query|harvest [optional: session path]',
      },
    };

    for (const [skillName, meta] of Object.entries(skillMetadata)) {
      const skillDir = path.join(skillsBaseDir, skillName);
      const destPath = path.join(skillDir, 'SKILL.md');

      if (exists(destPath) && !this.forceMode) {
        console.log(`⚠️ Skipped ${skillName}/SKILL.md (already exists)`);
        continue;
      }

      const skillBody = await this.readTemplate(`copilot/skills/${skillName.replace('skill-', '')}.md`).catch(() => '');
      if (!skillBody) continue;

      await ensureDir(skillDir);

      // SKILL.md frontmatter: name must match directory name, description covers both
      // what it does and when to use it (per Agent Skills spec)
      const frontmatterLines = [
        '---',
        `name: ${skillName}`,
        `description: >-`,
        `  ${meta.description}`,
      ];
      if (meta.argumentHint) {
        frontmatterLines.push(`argument-hint: '${meta.argumentHint}'`);
      }
      frontmatterLines.push('---', '');

      await writeFile(destPath, frontmatterLines.join('\n') + skillBody);
      console.log(`  ${chalk.green('✔')} .github/skills/${skillName}/SKILL.md`);
    }
  }

  /**
   * Install Claude Code skill protocol files per the Agent Skills open standard.
   * Each skill is installed as .claude/skills/skill-{name}/SKILL.md
   * The `name` field in SKILL.md frontmatter must match the directory name.
   */
  private async installClaudeSkills(): Promise<void> {
    const skillsBaseDir = getClaudeSkillsDir(this.scope);

    const skillMetadata: Record<string, { description: string; argumentHint?: string; allowedTools: string }> = {
      'skill-research-gate': {
        description: 'Research gate protocol — runs library docs lookup + web search + structured reasoning before any code is written. Use when starting implementation of any task that involves libraries or frameworks.',
        argumentHint: '[library names] [task description]',
        allowedTools: 'Read, Bash, WebFetch',
      },
      'skill-tier-routing': {
        description: 'Tier routing protocol — determines the correct engineer agent (Junior/Mid/Senior) from task complexity, packages context, and delegates. Use when deciding which specialist agent should implement a task.',
        argumentHint: '[task number] [optional: override tier]',
        allowedTools: 'Read, Agent',
      },
      'skill-spec-review': {
        description: 'Spec review protocol — independently verifies that the actual code matches the requirements spec. Use after an engineer agent completes implementation to verify compliance.',
        argumentHint: '[task number] [files changed]',
        allowedTools: 'Read, Agent',
      },
      'skill-library-ops': {
        description: 'Library operations — queries the project knowledge library before implementation, and harvests new knowledge after a session ends. Use to inject prior project patterns into context or archive learned knowledge.',
        argumentHint: 'query|harvest [optional: session path]',
        allowedTools: 'Read, Write, Agent',
      },
    };

    for (const [skillName, meta] of Object.entries(skillMetadata)) {
      const skillDir = path.join(skillsBaseDir, skillName);
      const destPath = path.join(skillDir, 'SKILL.md');

      if (exists(destPath) && !this.forceMode) {
        console.log(`⚠️ Skipped ${skillName}/SKILL.md (already exists)`);
        continue;
      }

      const skillBody = await this.readTemplate(`claude/skills/${skillName.replace('skill-', '')}.md`).catch(() => '');
      if (!skillBody) continue;

      await ensureDir(skillDir);

      const frontmatterLines = [
        '---',
        `name: ${skillName}`,
        `description: >-`,
        `  ${meta.description}`,
      ];
      if (meta.argumentHint) {
        frontmatterLines.push(`argument-hint: '${meta.argumentHint}'`);
      }
      frontmatterLines.push(`allowed-tools: ${meta.allowedTools}`, '---', '');

      await writeFile(destPath, frontmatterLines.join('\n') + skillBody);
      console.log(`  ${chalk.green('✔')} .claude/skills/${skillName}/SKILL.md`);
    }
  }

  /**
   * Install the Alisa orchestrator subagent to .cursor/agents/requirements-agent.md
   * Uses Cursor agent frontmatter format: name + description (no model/tools/globs).
   */
  private async installCursorAgent(_commandsDir: string): Promise<void> {
    const agentsDir = getCursorAgentsDir(this.scope);
    const agentFilePath = path.join(agentsDir, 'requirements-agent.md');

    if (exists(agentFilePath) && !this.forceMode) {
      console.log('⚠️ Skipped requirements-agent.md (already exists)');
      return;
    }

    const agentBody = await this.readTemplate('cursor/requirements-agent.md').catch(() => '');
    const frontmatter = [
      '---',
      'name: requirements-agent',
      'description: >-',
      '  Alisa — Requirements Manager orchestrator for the full software development lifecycle.',
      '  Routes user requests to the correct /requirements-* slash command and guides through',
      '  capture, design, implementation, review, and close stages.',
      '  Use proactively when the user mentions features, bugs, tasks, specs, or requirements work.',
      'tools: [Read, Write, Bash, AskQuestion]',
      '---',
      '',
    ].join('\n');

    await writeFile(agentFilePath, frontmatter + agentBody);
  }

  /**
   * Generate README.md in .cursor/commands/ for git tracking
   * @param commandsDir - Path to .cursor/commands/ directory
   */
  private async generateCursorCommandsReadme(commandsDir: string): Promise<void> {
    const readmePath = path.join(commandsDir, 'README.md');

    const content = `# Cursor Slash Commands — Requirements Manager (Alisa)

Slash commands for the Requirements Manager workflow, installed in \`.cursor/commands/\`.

## Installation

Commands are automatically generated by running:
\`\`\`bash
requirement-commands init --editor=cursor
\`\`\`

## Installed Structure

\`\`\`
.cursor/
├── commands/                  # Slash commands (13 files)
│   └── requirements-*.md
├── agents/                    # Alisa orchestrator + 8 specialist sub-agents
│   ├── requirements-agent.md  # Alisa — main orchestrator
│   ├── junior-engineer.md
│   ├── mid-engineer.md
│   ├── senior-engineer.md
│   ├── spec-reviewer.md
│   ├── task-orchestrator.md
│   ├── code-seeker.md
│   ├── librarian.md
│   └── curator.md
└── rules/                     # Skill protocol files (4 files, alwaysApply: false)
    ├── research-gate.md
    ├── tier-routing.md
    ├── spec-review.md
    └── library-ops.md
\`\`\`

## Available Commands

| Command | Description | Phase |
|---------|-------------|-------|
| \`/requirements-start\` | Begin gathering requirements for a new feature | Capture |
| \`/requirements-status\` | Check progress of current requirement session | Any |
| \`/requirements-current\` | View active requirement session details | Any |
| \`/requirements-list\` | List all requirement sessions | Any |
| \`/requirements-remind\` | Show phase-specific rules and reminders | Any |
| \`/requirements-end\` | Complete and archive current requirement session | Close |
| \`/requirements-specs-generate\` | Generate design and task specifications | Design |
| \`/requirements-specs-execute\` | Execute ONE implementation task (fresh session) | Implement |
| \`/requirements-spec-enhance\` | Handle mid-execution changes and modifications | Any |
| \`/requirements-bug-fix\` | Fix implementation issues with two-step method | Any |
| \`/requirements-code-review\` | Eight-pillar technical code review | Quality |
| \`/requirements-revise\` | Check alignment between implementation and requirements | Quality |
| \`/requirements-library\` | Manage project knowledge library — init, view, query, harvest | Any |

## Tier-Based Agent Delegation

\`/requirements-specs-execute\` automatically delegates implementation to the right engineer agent:

| Task Complexity | Agent | Model |
|-----------------|-------|-------|
| Simple (CRUD, config, types) | \`junior-engineer\` | Haiku |
| Standard (features, API, UI, tests) | \`mid-engineer\` | Sonnet (default) |
| Complex (architecture, security, novel) | \`senior-engineer\` | Opus |

After implementation, \`spec-reviewer\` independently verifies the result (Mid/Senior tiers).

## Project Knowledge Library

Use \`/requirements-library\` to initialize and manage the knowledge base.
The library auto-grows as sessions are completed via \`/requirements-end\`.

## One Task Per Session

\`/requirements-specs-execute\` implements **exactly one task per Cursor session**.
Start a new Cursor Composer session for each task for optimal code quality.
`;



    await writeFile(readmePath, content);
  }

  /**
   * Generate README.md in .github/prompts/ for git tracking
   * Reads from src/templates/copilot/prompts-readme.md if available, otherwise uses inline fallback.
   * @param promptsDir - Path to .github/prompts/ directory
   */
  private async generateCopilotPromptsReadme(promptsDir: string): Promise<void> {
    const readmePath = path.join(promptsDir, 'README.md');
    let content: string;
    try {
      content = await this.readTemplate('copilot/prompts-readme.md');
    } catch {
      content = `# Copilot Prompt Files\n\nSee [README](../agents/README.md) for full documentation.\n`;
    }
    await writeFile(readmePath, content);
  }

  /**
   * Generate README.md in .github/agents/ for git tracking
   * Reads from src/templates/copilot/agents-readme.md if available, otherwise uses inline fallback.
   * @param agentsDir - Path to .github/agents/ directory
   */
  private async generateCopilotAgentsReadme(agentsDir: string): Promise<void> {
    const readmePath = path.join(agentsDir, 'README.md');
    let content: string;
    try {
      content = await this.readTemplate('copilot/agents-readme.md');
    } catch {
      content = `# Copilot Agents\n\nSee [README](../prompts/README.md) for full documentation.\n`;
    }
    await writeFile(readmePath, content);
  }
  /**
   * Install the orchestrator agent file to .github/agents/requirements.agent.md
   * Only writes the file if force mode is on or it does not already exist.
   */
  private async installCopilotAgent(): Promise<void> {
    const agentsDir = getCopilotAgentsDir(this.scope);
    const agentFilePath = path.join(agentsDir, 'requirements.agent.md');

    if (exists(agentFilePath) && !this.forceMode) {
      console.log('⚠️ Skipped requirements.agent.md (already exists)');
      return;
    }

    const agentBody = await this.readTemplate('copilot/requirements-agent.md').catch(() => '');

    const frontmatter = [
      '---',
      "name: 'Requirements Manager'",
      "description: 'Orchestrates requirement management workflows — routes your request to the right prompt'",
      "model: 'Claude Sonnet 4.6'",
      "tools: ['vscode/askQuestions', 'search/codebase', 'edit/editFiles', 'execute/runInTerminal', 'execute/getTerminalOutput', 'read/problems', 'read/terminalLastCommand']",
      '---',
    ].join('\n');

    await writeFile(agentFilePath, frontmatter + '\n\n' + agentBody);

    // Generate README.md in .github/agents/
    await this.generateCopilotAgentsReadme(agentsDir);
  }

  /**
   * Install specialist sub-agent files from src/templates/copilot/agents/ to .github/agents/
   * Each agent gets Copilot agent frontmatter (name, description, model, tools).
   */
  private async installCopilotSubAgents(): Promise<void> {
    const agentsDir = getCopilotAgentsDir(this.scope);
    await ensureDir(agentsDir);

    const agentMetadata: Record<string, { description: string; model: string; tools: string[] }> = {
      'junior-engineer': {
        description: 'Junior engineer (Haiku tier) — data models, config, types, simple CRUD, CSS, scaffolding',
        model: 'Claude Haiku 3.5',
        tools: ['search/codebase', 'edit/editFiles', 'execute/runInTerminal', 'execute/getTerminalOutput'],
      },
      'mid-engineer': {
        description: 'Mid-level engineer (Sonnet tier, default) — standard features, API, UI, tests, integrations',
        model: 'Claude Sonnet 4.6',
        tools: ['search/codebase', 'edit/editFiles', 'execute/runInTerminal', 'execute/getTerminalOutput'],
      },
      'senior-engineer': {
        description: 'Senior engineer (Opus tier) — complex, security-critical, or novel work',
        model: 'Claude Opus 4.5',
        tools: ['search/codebase', 'edit/editFiles', 'execute/runInTerminal', 'execute/getTerminalOutput', 'read/problems'],
      },
      'spec-reviewer': {
        description: 'Spec reviewer — independently verifies implementation against requirements spec',
        model: 'Claude Sonnet 4.6',
        tools: ['search/codebase', 'execute/runInTerminal'],
      },
      'task-orchestrator': {
        description: 'Task orchestrator — converts approved design into executable 08-tasks.md with tier annotations',
        model: 'Claude Opus 4.5',
        tools: ['search/codebase', 'edit/editFiles'],
      },
      'code-seeker': {
        description: 'Code seeker — analyzes codebase from Architect/Developer/Product perspectives',
        model: 'Claude Sonnet 4.6',
        tools: ['search/codebase', 'execute/runInTerminal'],
      },
      'librarian': {
        description: 'Librarian — queries project knowledge library and retrieves relevant context (read-only)',
        model: 'Claude Haiku 3.5',
        tools: ['search/codebase'],
      },
      'curator': {
        description: 'Curator — harvests knowledge from completed sessions into project library books',
        model: 'Claude Sonnet 4.6',
        tools: ['search/codebase', 'edit/editFiles'],
      },
    };

    for (const [agentName, meta] of Object.entries(agentMetadata)) {
      const destPath = path.join(agentsDir, `${agentName}.agent.md`);

      if (exists(destPath) && !this.forceMode) {
        console.log(`⚠️ Skipped ${agentName}.agent.md (already exists)`);
        continue;
      }

      const agentBody = await this.readTemplate(`copilot/agents/${agentName}.md`).catch(() => '');
      if (!agentBody) continue;

      const toolsInline = `[${meta.tools.map((t) => `'${t}'`).join(', ')}]`;
      const frontmatter = [
        '---',
        `name: '${agentName}'`,
        `description: '${meta.description}'`,
        `model: '${meta.model}'`,
        `tools: ${toolsInline}`,
        '---',
        '',
      ].join('\n');

      await writeFile(destPath, frontmatter + agentBody);
      console.log(`  ${chalk.green('✔')} .github/agents/${agentName}.agent.md`);
    }
  }

  /**
   * Scaffold Memory Bank template files into memory-bank/{projectName}/.
   * Reads 5 placeholder templates from src/templates/memory-bank/ and writes them
   * to the target directory, preserving subdirectory structure.
   * Respects this.forceMode for overwrite behavior.
   */
  async scaffoldMemoryBank(projectName: string): Promise<void> {
    const templates = [
      'memory-bank/activeContext.md',
      'memory-bank/foundation/projectbrief.md',
      'memory-bank/foundation/techContext.md',
      'memory-bank/docs-rule/coding-rule.md',
      'memory-bank/docs-rule/review-rule.md',
    ];

    const targetBase = path.join(process.cwd(), 'memory-bank', projectName);

    for (const templateRelPath of templates) {
      const relativeDest = templateRelPath.replace('memory-bank/', '');
      const targetPath = path.join(targetBase, relativeDest);

      if (exists(targetPath) && !this.forceMode) {
        console.log(`  ⚠️  Skipped ${relativeDest} (already exists)`);
        continue;
      }

      const content = await this.readTemplate(templateRelPath);
      await ensureDir(path.dirname(targetPath));
      await writeFile(targetPath, content);
      console.log(`  ${chalk.green('✔')} ${chalk.dim('memory-bank/')}${chalk.cyan(projectName + '/')}${relativeDest}`);
    }
  }

  /**
   * Install slash commands to editor-specific commands directory
   * @param editor - Editor type for installation ('claude-code', 'cursor', 'vscode-copilot', 'both', or 'all')
   *                 Defaults to 'claude-code' for backward compatibility
   */
  async installSlashCommands(editor: EditorType = 'claude-code'): Promise<void> {
    // Handle 'all' option by installing to all 3 editors
    if (editor === 'all') {
      await this.installToEditor('claude-code');
      await this.installToEditor('cursor');
      await this.installToEditor('vscode-copilot');
      return;
    }

    // Handle 'both' option for backward compatibility (Claude Code + Cursor only)
    if (editor === 'both') {
      console.log(chalk.yellow('⚠️  --editor=both is deprecated. Use --editor=all to install to all supported editors.'));
      await this.installToEditor('claude-code');
      await this.installToEditor('cursor');
      return;
    }

    // Direct editor installation - all single editor types supported
    await this.installToEditor(editor as 'claude-code' | 'cursor' | 'vscode-copilot');
  }
}
