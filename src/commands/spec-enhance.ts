/**
 * Spec Enhance Command
 * Handle mid-execution changes
 */

import chalk from 'chalk';
import { readFile, exists } from '../core/utils/file-system.js';
import * as path from 'path';

/**
 * Metadata interface for requirement sessions
 */
interface IMetadata {
  sessionId: string;
  phase: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  files: string[];
}

/**
 * Handle mid-execution changes
 */
export async function execute(): Promise<void> {
  const REQUIREMENTS_DIR = 'requirements';
  const CURRENT_REQUIREMENT_FILE = path.join(REQUIREMENTS_DIR, '.current-requirement');

  try {
    // Check if requirements directory exists
    if (!exists(REQUIREMENTS_DIR)) {
      console.log(chalk.yellow('Requirements directory not found.'));
      console.log(chalk.dim('Run `requirement-commands init` to initialize requirements directory.'));
      return;
    }

    // Check if there's a current requirement
    if (!exists(CURRENT_REQUIREMENT_FILE)) {
      console.log(chalk.yellow('No active requirement session found.'));
      console.log(chalk.dim('Run `requirement-commands start` to begin a new requirement session.'));
      return;
    }

    // Read current requirement pointer
    const currentSession = await readFile(CURRENT_REQUIREMENT_FILE);
    const sessionPath = currentSession.trim();

    if (!sessionPath) {
      console.log(chalk.yellow('No active requirement session found.'));
      console.log(chalk.dim('Run `requirement-commands start` to begin a new requirement session.'));
      return;
    }

    // Check if session directory exists
    const fullSessionPath = path.join(REQUIREMENTS_DIR, sessionPath);
    if (!exists(fullSessionPath)) {
      console.log(chalk.yellow(`Session directory not found: ${sessionPath}`));
      console.log(chalk.dim('The current requirement session may have been moved or deleted.'));
      return;
    }

    // Read metadata
    const metadataPath = path.join(fullSessionPath, 'metadata.json');
    if (!exists(metadataPath)) {
      console.log(chalk.yellow(`Metadata file not found: ${metadataPath}`));
      console.log(chalk.dim('The session may be corrupted or incomplete.'));
      return;
    }

    const metadataContent = await readFile(metadataPath);
    const metadata: IMetadata = JSON.parse(metadataContent);

    // Display header
    console.log(chalk.bold('\n🔄 Change Management\n'));
    console.log(chalk.gray('═'.repeat(60)));

    console.log(`${chalk.blue('Session:')} ${metadata.sessionId}`);
    console.log(`${chalk.blue('Current Phase:')} ${metadata.phase}`);

    console.log(chalk.gray('═'.repeat(60)));

    // Display change management options
    console.log(chalk.bold('\n📝 Change Management Options\n'));
    console.log(chalk.gray('═'.repeat(60)));

    console.log(`  ${chalk.cyan('1.')} ${chalk.bold('Document New Change')}`);
    console.log(`      ${chalk.dim('Document change in 10-change-log.md')}`);
    console.log(`      ${chalk.dim('Update 11-change-backlog.md with pending changes')}`);

    console.log(`  ${chalk.cyan('2.')} ${chalk.bold('Process Change Request')}`);
    console.log(`      ${chalk.dim('Analyze impact on requirements and implementation')}`);
    console.log(`      ${chalk.dim('Update change-log.md with impact analysis')}`);
    console.log(`      ${chalk.dim('Update metadata.json phase to "change_review"')}`);

    console.log(`  ${chalk.cyan('3.')} ${chalk.bold('Update Change Backlog')}`);
    console.log(`      ${chalk.dim('Add change to 11-change-backlog.md')}`);
    console.log(`      ${chalk.dim('Prioritize changes for implementation')}`);

    console.log(`  ${chalk.cyan('4.')} ${chalk.bold('Complete Change Review')}`);
    console.log(`      ${chalk.dim('After implementation, verify all changes are complete')}`);
    console.log(`      ${chalk.dim('Update change-log.md with completion status')}`);
    console.log(`      ${chalk.dim('Update metadata.json phase back to previous phase')}`);

    console.log(`  ${chalk.cyan('5.')} ${chalk.bold('Cancel Change Request')}`);
    console.log(`      ${chalk.dim('Remove change from change-log.md and change-backlog.md')}`);
    console.log(`      ${chalk.dim('Update metadata.json phase back to previous phase')}`);

    console.log(chalk.gray('═'.repeat(60)));

    console.log(chalk.dim('\nUse requirement-commands specs-execute to continue implementation.'));
    console.log(chalk.dim('Use requirement-commands bug-fix for any issues encountered.'));

    // Display file paths
    console.log(chalk.bold('\n📁 File Paths\n'));
    console.log(chalk.gray('─'.repeat(60)));

    const changeLogPath = path.join(fullSessionPath, '10-change-log.md');
    const changeBacklogPath = path.join(fullSessionPath, '11-change-backlog.md');

    console.log(`${chalk.blue('Change Log:')} ${changeLogPath}`);
    console.log(`${chalk.blue('Change Backlog:')} ${changeBacklogPath}`);

    console.log(chalk.gray('─'.repeat(60)));

    // Display change log template
    console.log(chalk.bold('\n📋 Change Log Template\n'));
    console.log(chalk.gray('═'.repeat(60)));

    console.log(`\`\`\`markdown`);
    console.log(`# Change Log`);
    console.log(`\`\`\``);
    console.log(`**Date:** ${new Date().toISOString()}`);
    console.log(`**Session:** ${metadata.sessionId}`);
    console.log(`\`\`\``);
    console.log(`## Change Entry`);
    console.log(`\`\`\``);
    console.log(`- **ID:** [CHANGE-001]`);
    console.log(`- **Date:** ${new Date().toISOString()}`);
    console.log(`- **Type:** [new_feature | enhancement | bug_fix | refactor]`);
    console.log(`- **Description:** [Change description]`);
    console.log(`- **Requested By:** [Agent/User]`);
    console.log(`- **Impact Analysis:**`);
    console.log(`  - [Affected Requirements:] [List requirements]`);
    console.log(`  - [Affected Files:] [List files]`);
    console.log(`  - [Risk Level:] [low | medium | high]`);
    console.log(`- [Mitigation:] [Mitigation strategy]`);
    console.log(`\`\`\``);
    console.log(`## Implementation`);
    console.log(`\`\`\``);
    console.log(`- [ ] Task: [Task ID] - [Status: pending | in_progress | complete]`);
    console.log(`\`\`\``);
    console.log(`## Approval`);
    console.log(`\`\`\``);
    console.log(`- **Approved By:** [Approver]`);
    console.log(`- **Approval Date:** [Date]`);
    console.log(`\`\`\``);
    console.log(`---`);
    console.log(`\`\`\``);

    console.log(chalk.gray('═'.repeat(60)));

    // Display change backlog template
    console.log(chalk.bold('\n📋 Change Backlog Template\n'));
    console.log(chalk.gray('═'.repeat(60)));

    console.log(`\`\`\`markdown`);
    console.log(`# Change Backlog`);
    console.log(`\`\`\``);
    console.log(`| Priority | ID | Description | Status | Requested Date | Target Phase |`);
    console.log(`|---------|----|------------|--------|---------------|--------------|---------------|`);
    console.log(`| [High | Low] | [CHANGE-001] | [Change description] | pending | ${new Date().toISOString()} | [Phase] |`);
    console.log(`| [High | Low] | [CHANGE-002] | [Change description] | pending | ${new Date().toISOString()} | [Phase] |`);
    console.log(`| [High | Low] | [CHANGE-003] | [Change description] | pending | ${new Date().toISOString()} | [Phase] |`);
    console.log(`| [High | Low] | [CHANGE-004] | [Change description] | pending | ${new Date().toISOString()} | [Phase] |`);
    console.log(`\`\`\`\``);

    console.log(chalk.gray('═'.repeat(60)));

  } catch (error) {
    console.error(chalk.red('Error handling change request:'), error);
    throw error;
  }
}
