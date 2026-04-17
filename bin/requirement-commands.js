#!/usr/bin/env node

/**
 * CLI Entry Point
 * Main entry point for the requirement-commands CLI
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { init } from '../dist/commands/init.js';

const program = new Command();

program
  .name('requirement-commands')
  .description('CLI-based scaffolding tool for AI coding agents')
  .version('1.0.0 (Phase 1: init-only mode)');

// Init command
program
  .command('init')
  .description('Initialize requirements directory with templates')
  .option('-f, --force', 'Overwrite existing files')
  .option('--editor <editor>', 'Target editor (claude-code, cursor, vscode-copilot, both, all)')
  .option('--scope <scope>', 'Installation scope: project, workspace, or userdata (default: userdata for Claude, project for Cursor/Copilot)')
  .option('--with-memory-bank', 'Scaffold Memory Bank templates into memory-bank/{project}/')
  .action(async (options) => {
    try {
      await init(options);
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

// Stub commands for Phase 3
program
  .command('status')
  .description('Check current progress and resume workflow (not available in Phase 1)')
  .action(async () => {
    // DISABLED IN PHASE 1 - Uncomment to re-enable in future phases
    // try {
    //   await executeStatus();
    // } catch (error) {
    //   console.error('Error:', error.message);
    //   process.exit(1);
    // }

    // PHASE 1: Show error message
    console.log(chalk.yellow('This command is not available in the current version.'));
    console.log(chalk.dim('The CLI currently supports only the \'init\' command.'));
    console.log(chalk.dim('For full workflow capabilities, use slash commands in Claude Code:'));
    console.log(chalk.cyan('  /requirements-status'));
    process.exit(1);
  });

program
  .command('list')
  .description('List all requirements with status indicators (not available in Phase 1)')
  .action(async () => {
    // DISABLED IN PHASE 1 - Uncomment to re-enable in future phases
    // try {
    //   await executeList();
    // } catch (error) {
    //   console.error('Error:', error.message);
    //   process.exit(1);
    // }

    // PHASE 1: Show error message
    console.log(chalk.yellow('This command is not available in the current version.'));
    console.log(chalk.dim('The CLI currently supports only the \'init\' command.'));
    console.log(chalk.dim('For full workflow capabilities, use slash commands in Claude Code:'));
    console.log(chalk.cyan('  /requirements-list'));
    process.exit(1);
  });

program
  .command('current')
  .description('View current requirement details (not available in Phase 1)')
  .action(async () => {
    // DISABLED IN PHASE 1 - Uncomment to re-enable in future phases
    // try {
    //   await executeCurrent();
    // } catch (error) {
    //   console.error('Error:', error.message);
    //   process.exit(1);
    // }

    // PHASE 1: Show error message
    console.log(chalk.yellow('This command is not available in the current version.'));
    console.log(chalk.dim('The CLI currently supports only the \'init\' command.'));
    console.log(chalk.dim('For full workflow capabilities, use slash commands in Claude Code:'));
    console.log(chalk.cyan('  /requirements-current'));
    process.exit(1);
  });

program
  .command('remind')
  .description('Show phase-specific rules (not available in Phase 1)')
  .action(async () => {
    // DISABLED IN PHASE 1 - Uncomment to re-enable in future phases
    // try {
    //   await executeRemind();
    // } catch (error) {
    //   console.error('Error:', error.message);
    //   process.exit(1);
    // }

    // PHASE 1: Show error message
    console.log(chalk.yellow('This command is not available in the current version.'));
    console.log(chalk.dim('The CLI currently supports only the \'init\' command.'));
    console.log(chalk.dim('For full workflow capabilities, use slash commands in Claude Code:'));
    console.log(chalk.cyan('  /requirements-remind'));
    process.exit(1);
  });

program
  .command('end')
  .description('Complete and archive session (not available in Phase 1)')
  .action(async () => {
    // DISABLED IN PHASE 1 - Uncomment to re-enable in future phases
    // try {
    //   await executeEnd();
    // } catch (error) {
    //   console.error('Error:', error.message);
    //   process.exit(1);
    // }

    // PHASE 1: Show error message
    console.log(chalk.yellow('This command is not available in the current version.'));
    console.log(chalk.dim('The CLI currently supports only the \'init\' command.'));
    console.log(chalk.dim('For full workflow capabilities, use slash commands in Claude Code:'));
    console.log(chalk.cyan('  /requirements-end'));
    process.exit(1);
  });

program
  .command('specs-generate')
  .description('Generate design and tasks from requirements (not available in Phase 1)')
  .action(async () => {
    // DISABLED IN PHASE 1 - Uncomment to re-enable in future phases
    // try {
    //   await executeSpecsGenerate();
    // } catch (error) {
    //   console.error('Error:', error.message);
    //   process.exit(1);
    // }

    // PHASE 1: Show error message
    console.log(chalk.yellow('This command is not available in the current version.'));
    console.log(chalk.dim('The CLI currently supports only the \'init\' command.'));
    console.log(chalk.dim('For full workflow capabilities, use slash commands in Claude Code:'));
    console.log(chalk.cyan('  /requirements-specs-generate'));
    process.exit(1);
  });

program
  .command('specs-execute')
  .description('Execute implementation tasks (not available in Phase 1)')
  .action(async () => {
    // DISABLED IN PHASE 1 - Uncomment to re-enable in future phases
    // try {
    //   await executeSpecsExecute();
    // } catch (error) {
    //   console.error('Error:', error.message);
    //   process.exit(1);
    // }

    // PHASE 1: Show error message
    console.log(chalk.yellow('This command is not available in the current version.'));
    console.log(chalk.dim('The CLI currently supports only the \'init\' command.'));
    console.log(chalk.dim('For full workflow capabilities, use slash commands in Claude Code:'));
    console.log(chalk.cyan('  /requirements-specs-execute'));
    process.exit(1);
  });

program
  .command('spec-enhance')
  .description('Handle mid-execution changes (not available in Phase 1)')
  .action(async () => {
    // DISABLED IN PHASE 1 - Uncomment to re-enable in future phases
    // try {
    //   await executeSpecEnhance();
    // } catch (error) {
    //   console.error('Error:', error.message);
    //   process.exit(1);
    // }

    // PHASE 1: Show error message
    console.log(chalk.yellow('This command is not available in the current version.'));
    console.log(chalk.dim('The CLI currently supports only the \'init\' command.'));
    console.log(chalk.dim('For full workflow capabilities, use slash commands in Claude Code:'));
    console.log(chalk.cyan('  /requirements-spec-enhance'));
    process.exit(1);
  });

program
  .command('bug-fix')
  .description('Fix implementation issues (not available in Phase 1)')
  .action(async () => {
    // DISABLED IN PHASE 1 - Uncomment to re-enable in future phases
    // try {
    //   await executeBugFix();
    // } catch (error) {
    //   console.error('Error:', error.message);
    //   process.exit(1);
    // }

    // PHASE 1: Show error message
    console.log(chalk.yellow('This command is not available in the current version.'));
    console.log(chalk.dim('The CLI currently supports only the \'init\' command.'));
    console.log(chalk.dim('For full workflow capabilities, use slash commands in Claude Code:'));
    console.log(chalk.cyan('  /requirements-bug-fix'));
    process.exit(1);
  });

program
  .command('code-review')
  .description('Technical quality analysis (not available in Phase 1)')
  .action(async () => {
    // DISABLED IN PHASE 1 - Uncomment to re-enable in future phases
    // try {
    //   await executeCodeReview();
    // } catch (error) {
    //   console.error('Error:', error.message);
    //   process.exit(1);
    // }

    // PHASE 1: Show error message
    console.log(chalk.yellow('This command is not available in the current version.'));
    console.log(chalk.dim('The CLI currently supports only the \'init\' command.'));
    console.log(chalk.dim('For full workflow capabilities, use slash commands in Claude Code:'));
    console.log(chalk.cyan('  /requirements-code-review'));
    process.exit(1);
  });

program
  .command('revise')
  .description('Check alignment with requirements (not available in Phase 1)')
  .action(async () => {
    // DISABLED IN PHASE 1 - Uncomment to re-enable in future phases
    // try {
    //   await executeRevise();
    // } catch (error) {
    //   console.error('Error:', error.message);
    //   process.exit(1);
    // }

    // PHASE 1: Show error message
    console.log(chalk.yellow('This command is not available in the current version.'));
    console.log(chalk.dim('The CLI currently supports only the \'init\' command.'));
    console.log(chalk.dim('For full workflow capabilities, use slash commands in Claude Code:'));
    console.log(chalk.cyan('  /requirements-revise'));
    process.exit(1);
  });

// Default to 'init' if no command provided (enables: npx requirement-commands)
if (process.argv.length === 2) {
  process.argv.push('init');
}

program.parse();
