/**
 * Display Utilities Module
 * Provides branded UI output, spinners, and formatted boxes for CLI
 */

import chalk from 'chalk';
import ora from 'ora';

/**
 * Semantic color scheme for consistent UI styling
 */
export const Colors = {
  success: chalk.green,
  warning: chalk.yellow,
  info: chalk.cyan,
  muted: chalk.dim,
  primary: chalk.magenta,
  accent: chalk.cyan.bold,
  brand: chalk.white.bold,
};

/**
 * Display branded header at init start
 */
export function showInitHeader(): void {
  const divider = Colors.muted('━'.repeat(55));
  console.log(divider);
  console.log(Colors.accent('  VNEXT ALISA'));
  console.log(Colors.primary('  ' + '═'.repeat(45)));
  console.log(Colors.brand('  REQUIREMENT STACK'));
  console.log(Colors.muted('  Initializing requirements directory...'));
  console.log(divider);
  console.log();
}

/**
 * Execute async operation with visual spinner
 */
export async function withSpinner<T>(
  message: string,
  operation: () => Promise<T>
): Promise<T> {
  const spinner = ora(message).start();
  try {
    const result = await operation();
    spinner.succeed(Colors.success(message));
    return result;
  } catch (error) {
    spinner.fail(Colors.warning(message));
    throw error;
  }
}

/**
 * Display bordered summary box with installation details and next steps
 */
export function showInitSummary(options: {
  selectedEditor: 'claude-code' | 'cursor' | 'vscode-copilot' | 'both' | 'all';
  scope?: 'project' | 'workspace' | 'userdata';
  claudeDir?: string;
  claudeSkillsDir?: string;
  cursorDir?: string;
  cursorAgentsDir?: string;
  cursorSkillsDir?: string;
  copilotDir?: string;
  copilotAgentsDir?: string;
  copilotSkillsDir?: string;
}): void {
  // Directory section
  const dirLines: string[] = [];
  if (options.scope) {
    const scopeLabel: Record<string, string> = {
      project:   'project  (current folder)',
      workspace: 'workspace (current folder)',
      userdata:  'userdata (~/ home directory)',
    };
    dirLines.push(`  🎯 Scope: ${scopeLabel[options.scope] ?? options.scope}`);
    dirLines.push('');
  }
  if (options.selectedEditor === 'claude-code' || options.selectedEditor === 'both' || options.selectedEditor === 'all') {
    dirLines.push(`  📦 Claude Code:      ${options.claudeDir}`);
    dirLines.push(`  🎯 Claude skills:    ${options.claudeSkillsDir} (4 skills)`);
  }
  if (options.selectedEditor === 'cursor' || options.selectedEditor === 'both' || options.selectedEditor === 'all') {
    dirLines.push(`  📦 Cursor commands:  ${options.cursorDir}`);
    dirLines.push(`  🤖 Cursor agents:    ${options.cursorAgentsDir} (9 files)`);
    dirLines.push(`  🎯 Cursor skills:    ${options.cursorSkillsDir} (4 skills)`);
  }
  if (options.selectedEditor === 'vscode-copilot' || options.selectedEditor === 'all') {
    dirLines.push(`  📦 VSCode + Copilot: ${options.copilotDir}`);
    dirLines.push(`  🤖 Copilot agents:   ${options.copilotAgentsDir} (8 files)`);
    dirLines.push(`  🎯 Copilot skills:   ${options.copilotSkillsDir} (4 skills)`);
  }

  const cmds = [
    '/requirements-start', '/requirements-status', '/requirements-list',
    '/requirements-current', '/requirements-remind', '/requirements-end',
    '/requirements-specs-generate', '/requirements-specs-execute',
    '/requirements-spec-enhance', '/requirements-bug-fix',
    '/requirements-code-review', '/requirements-revise',
    '/requirements-library',
  ];

  const minWidth = 53;
  const dirMaxLen = dirLines.reduce((max, line) => Math.max(max, line.length), 0);
  const scopeLineLen = options.scope
    ? (`  🎯 Scope: ` + (options.scope === 'userdata' ? 'Userdata  (~/.claude / ~/.cursor)' : `Project / Workspace  (${process.cwd()})`)).length
    : 0;
  const w = Math.max(minWidth, dirMaxLen + 2, scopeLineLen + 2);

  const colored = (text: string, fn: typeof chalk.green, extraWidth = 0) => {
    const pad = Math.max(0, w - text.length - extraWidth);
    return fn(text + ' '.repeat(pad));
  };

  // ✅ is BMP (U+2705): JS .length=1, terminal width=2, so extraWidth=1
  console.log('╭' + '─'.repeat(w) + '╮');
  console.log('│' + colored('  ✅ Requirement Commands Installed Successfully', Colors.success, 1) + '│');
  console.log('│' + '─'.repeat(w) + '│');
  console.log('│' + ' '.repeat(w) + '│');
  if (options.scope) {
    const scopeLabel = options.scope === 'userdata'
      ? 'Userdata  (~/.claude / ~/.cursor)'
      : `Project / Workspace  (${process.cwd()})`;
    console.log('│' + colored(`  🎯 Scope: ${scopeLabel}`, Colors.muted) + '│');
    console.log('│' + ' '.repeat(w) + '│');
  }
  for (const line of dirLines) {
    // 📦 is surrogate pair (U+1F4E6): JS .length=2, terminal width=2, no adjustment needed
    console.log('│' + line.padEnd(w) + '│');
  }
  console.log('│' + ' '.repeat(w) + '│');
  console.log('│' + '  Available Commands:'.padEnd(w) + '│');
  for (const cmd of cmds) {
    console.log('│' + colored('    ' + cmd, Colors.info) + '│');
  }
  console.log('│' + ' '.repeat(w) + '│');
  console.log('│' + '  Next Steps:'.padEnd(w) + '│');
  console.log('│' + colored('    1. (Optional) Run /requirements-library to init knowledge base', Colors.muted) + '│');
  console.log('│' + colored('    2. Run /requirements-start [description]', Colors.muted) + '│');
  console.log('│' + colored('    3. Answer discovery questions', Colors.muted) + '│');
  console.log('│' + colored('    4. Review generated specs', Colors.muted) + '│');
  console.log('╰' + '─'.repeat(w) + '╯');
  console.log();
}

