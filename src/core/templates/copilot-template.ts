/**
 * VS Code Copilot Prompt Files Template Generator
 * Generates Copilot prompt files with YAML frontmatter format
 */

import { generateClaudeCodeSlashCommands } from './claude-code-template.js';

/**
 * Valid VS Code Copilot built-in tool identifiers.
 * These match the official VS Code Copilot agent tool names.
 */
export type CopilotTool =
  | 'search/codebase'            // Semantic search & read across the workspace
  | 'edit/editFiles'             // Create and edit files in the workspace
  | 'execute/runInTerminal'      // Run shell commands in the integrated terminal
  | 'execute/getTerminalOutput'  // Get output from the terminal
  | 'read/problems'              // VS Code Problems panel (errors/warnings)
  | 'read/terminalLastCommand'   // Get the last terminal command output
  | 'read/terminalSelection'     // Get the current terminal selection
  | 'vscode/askQuestions';        // Ask the user a question in Copilot Chat

/**
 * Represents a Copilot prompt file with frontmatter and content
 */
export interface CopilotPromptData {
  /** Copilot agent mode — maps to the `agent` frontmatter field */
  agent: 'agent' | 'ask' | 'edit';
  /** Language model to use (e.g. "Claude Sonnet 4.5", "GPT-4o") */
  model?: string;
  /** Copilot tool permissions */
  tools: CopilotTool[];
  /** Human-readable description */
  description: string;
  /** Hint text shown in chat input box when invoking the prompt */
  argumentHint?: string;
  /** Markdown content (body of the prompt) */
  content: string;
}

/** Claude Code to Copilot tool mapping */
export interface ToolMapping {
  claudeCode: string;
  copilot: CopilotTool[];
}

/** Maps Claude Code tool names to their VS Code Copilot equivalents */
export const TOOL_MAPPING: ToolMapping[] = [
  {
    claudeCode: 'Bash',
    copilot: ['execute/runInTerminal', 'execute/getTerminalOutput'],
  },
  {
    claudeCode: 'Read',
    copilot: ['search/codebase'],
  },
  {
    claudeCode: 'Write',
    copilot: ['edit/editFiles'],
  },
];

/**
 * Map Claude Code allowedTools string to Copilot tool identifiers
 *
 * @param allowedTools - Claude Code format string, e.g. "Bash(*), Read(*), Write(*)"
 * @returns Deduplicated array of Copilot tool identifiers
 */
export function mapAllowedToolsToCopilotTools(allowedTools: string): CopilotTool[] {
  if (!allowedTools) return [];

  const tools: CopilotTool[] = [];
  for (const mapping of TOOL_MAPPING) {
    if (allowedTools.includes(mapping.claudeCode)) {
      tools.push(...mapping.copilot);
    }
  }
  return [...new Set(tools)];
}

/**
 * Generate YAML frontmatter string for a Copilot prompt file
 *
 * @param prompt - Copilot prompt data containing mode, tools, and description
 * @returns Complete YAML frontmatter string with --- delimiters
 */
export function generateCopilotFrontmatter(prompt: CopilotPromptData): string {
  const toolsInline = `[${prompt.tools.map((t) => `'${t}'`).join(', ')}]`;
  const lines = [
    `agent: '${prompt.agent}'`,
  ];
  if (prompt.model) {
    lines.push(`model: '${prompt.model}'`);
  }
  lines.push(`tools: ${toolsInline}`);
  lines.push(`description: '${prompt.description}'`);
  if (prompt.argumentHint) {
    lines.push(`argument-hint: '${prompt.argumentHint}'`);
  }
  return `---\n${lines.join('\n')}\n---`;
}

/**
 * Generate all Copilot prompt data by transforming Claude Code slash commands
 * into the Copilot prompt format.
 *
 * @returns Record of command names to CopilotPromptData (12 prompts total)
 */
export function generateCopilotPrompts(): Record<string, CopilotPromptData> {
  const slashCommands = generateClaudeCodeSlashCommands();
  const prompts: Record<string, CopilotPromptData> = {};

  /** Argument hints for commands that accept free-text parameters */
  const argumentHints: Record<string, string> = {
    'requirements-start': 'feature description, e.g. add user profile page',
    'requirements-bug-fix': 'bug description or issue id',
    'requirements-spec-enhance': 'change request description',
  };

  /**
   * Per-command tool sets — each command gets exactly the tools it needs.
   * Using correct VS Code Copilot built-in tool identifiers.
   */
  const toolOverrides: Record<string, CopilotTool[]> = {
    // Codebase exploration + write requirements files + run git/find commands + discovery Q&A
    'requirements-start':          ['search/codebase', 'edit/editFiles', 'execute/runInTerminal', 'execute/getTerminalOutput', 'vscode/askQuestions'],
    // Read and update session state files
    'requirements-status':         ['search/codebase', 'edit/editFiles'],
    // Reference-only: display rules and reminders
    'requirements-remind':         ['search/codebase'],
    // List directories, read metadata files
    'requirements-list':           ['search/codebase', 'execute/runInTerminal', 'execute/getTerminalOutput'],
    // View-only: display comprehensive requirement state
    'requirements-current':        ['search/codebase'],
    // Move/archive files, clear active pointer
    'requirements-end':            ['edit/editFiles', 'execute/runInTerminal', 'execute/getTerminalOutput'],
    // Analyze codebase, generate design & task documents — [A]/[B] approval gates
    'requirements-specs-generate': ['search/codebase', 'edit/editFiles', 'vscode/askQuestions'],
    // Full implementation: read code, write code, run tests, check problems
    'requirements-specs-execute':  ['search/codebase', 'edit/editFiles', 'execute/runInTerminal', 'execute/getTerminalOutput', 'read/problems'],
    // Change management: impact analysis and spec file updates — impact Q&A with [A]/[B] choices
    'requirements-spec-enhance':   ['search/codebase', 'edit/editFiles', 'execute/runInTerminal', 'execute/getTerminalOutput', 'vscode/askQuestions'],
    // Debugging: read code, check errors, run commands, apply fixes — validation questions
    'requirements-bug-fix':        ['search/codebase', 'edit/editFiles', 'execute/runInTerminal', 'execute/getTerminalOutput', 'read/problems', 'read/terminalLastCommand', 'vscode/askQuestions'],
    // Code quality analysis: git diff, linters, security audit
    'requirements-code-review':    ['search/codebase', 'execute/runInTerminal', 'execute/getTerminalOutput', 'read/problems'],
    // Alignment analysis: git diff + compare code against requirements/design
    'requirements-revise':         ['search/codebase', 'execute/runInTerminal', 'execute/getTerminalOutput'],
    // Project knowledge library — init, view, query, harvest
    'requirements-library':        ['search/codebase', 'edit/editFiles', 'execute/runInTerminal', 'execute/getTerminalOutput', 'vscode/askQuestions'],
  };

  for (const [name, command] of Object.entries(slashCommands)) {
    prompts[name] = {
      agent: 'agent',
      model: 'Claude Sonnet 4.6',
      tools: toolOverrides[name] ?? mapAllowedToolsToCopilotTools(command.allowedTools),
      description: command.description,
      argumentHint: argumentHints[name],
      content: command.content,
    };
  }

  // Add requirements-library (not in claude-code slash commands but needed for Copilot)
  prompts['requirements-library'] = {
    agent: 'agent',
    model: 'Claude Sonnet 4.6',
    tools: toolOverrides['requirements-library']!,
    description: 'Manage project knowledge library — init, view, query, and harvest',
    argumentHint: undefined,
    content: '',
  };

  return prompts;
}
