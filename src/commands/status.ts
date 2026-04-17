/**
 * Status Command
 * Check current progress and phase
 */

import chalk from 'chalk';
import { readFile, exists, listFiles } from '../core/utils/file-system.js';
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
 * Phase descriptions for user-friendly display
 */
const PHASE_DESCRIPTIONS: Record<string, string> = {
  discovery: 'Asking context discovery questions',
  context: 'Autonomous codebase analysis',
  detail: 'Asking expert detail questions',
  requirements_complete: 'Requirements specification complete',
  specs_generated: 'Design generated, awaiting approval',
  design_approved: 'Design approved, tasks pending',
  specs_complete: 'Design and tasks generated',
  executing: 'Tasks being executed',
  implemented: 'All tasks complete',
  bug_fixing: 'Bug fix in progress',
  change_review: 'Change request in progress',
};

/**
 * Phase icons for visual display
 */
const PHASE_ICONS: Record<string, string> = {
  discovery: '🔍',
  context: '📊',
  detail: '📝',
  requirements_complete: '✅',
  specs_generated: '📐',
  design_approved: '👍',
  specs_complete: '🎯',
  executing: '🚀',
  implemented: '🎉',
  bug_fixing: '🐛',
  change_review: '🔄',
};

/**
 * Status icons for visual display
 */
const STATUS_ICONS: Record<string, string> = {
  active: '🟢',
  completed: '✅',
  archived: '📦',
};

/**
 * Check current progress
 */
export async function execute(): Promise<void> {
  const REQUIREMENTS_DIR = 'requirements';
  const CURRENT_REQUIREMENT_FILE = path.join(REQUIREMENTS_DIR, '.current-requirement');

  try {
    // Check if requirements directory exists
    if (!exists(REQUIREMENTS_DIR)) {
      console.log(chalk.yellow('Requirements directory not found.'));
      console.log(chalk.dim('Run `requirement-commands init` to initialize the requirements directory.'));
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

    // Display session information
    console.log(chalk.bold('\n📋 Current Requirement Session\n'));
    console.log(chalk.gray('═'.repeat(40)));

    console.log(`${chalk.blue('Session ID:')} ${metadata.sessionId}`);
    console.log(`${chalk.blue('Status:')} ${STATUS_ICONS[metadata.status] || ''} ${metadata.status}`);
    console.log(`${chalk.blue('Phase:')} ${PHASE_ICONS[metadata.phase] || ''} ${metadata.phase}`);
    console.log(`${chalk.blue('Description:')} ${PHASE_DESCRIPTIONS[metadata.phase] || 'Unknown phase'}`);
    console.log(`${chalk.blue('Created:')} ${new Date(metadata.createdAt).toLocaleString()}`);
    console.log(`${chalk.blue('Updated:')} ${new Date(metadata.updatedAt).toLocaleString()}`);

    console.log(chalk.gray('═'.repeat(40)));

    // Display checkpoint information
    console.log(chalk.bold('\n📍 Checkpoint\n'));

    // List files in session directory
    const files = await listFiles(fullSessionPath, '*.md');
    const fileStatus: Record<string, string> = {};

    // Determine which files exist and their status
    for (const file of files) {
      if (file !== 'metadata.json') {
        const filePath = path.join(fullSessionPath, file);
        if (exists(filePath)) {
          fileStatus[file] = '✅';
        } else {
          fileStatus[file] = '❌';
        }
      }
    }

    // Display file status
    const standardFiles = [
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
      '11-change-backlog.md',
    ];

    for (const file of standardFiles) {
      const status = fileStatus[file] || '⚪';
      const fileName = file.replace('.md', '').replace(/^\d{2}-/, '');
      console.log(`  ${status} ${fileName}`);
    }

    // Display resume options based on phase
    console.log(chalk.bold('\n🔄 Resume Options\n'));

    const resumeOptions = getResumeOptions(metadata.phase);
    for (const option of resumeOptions) {
      console.log(`  ${chalk.cyan('•')} ${option.description}`);
      console.log(`    ${chalk.dim(option.command)}`);
    }

    console.log(chalk.gray('═'.repeat(40)));
    console.log(chalk.dim(`\nSession path: ${fullSessionPath}`));
    console.log(chalk.dim(`Use ${chalk.cyan('requirement-commands current')} to view full session details.`));

  } catch (error) {
    console.error(chalk.red('Error checking status:'), error);
    throw error;
  }
}

/**
 * Get resume options based on current phase
 */
function getResumeOptions(phase: string): Array<{ description: string; command: string }> {
  const options: Array<{ description: string; command: string }> = [];

  switch (phase) {
    case 'discovery':
      options.push({
        description: 'Continue with discovery questions',
        command: 'Review 01-discovery-questions.md and continue asking questions',
      });
      break;

    case 'context':
      options.push({
        description: 'Continue context analysis',
        command: 'Review 03-context-findings.md and continue analysis',
      });
      break;

    case 'detail':
      options.push({
        description: 'Continue with detail questions',
        command: 'Review 04-detail-questions.md and continue asking questions',
      });
      break;

    case 'requirements_complete':
      options.push({
        description: 'Generate design and tasks',
        command: 'Run: requirement-commands specs-generate',
      });
      break;

    case 'specs_generated':
      options.push({
        description: 'Review and approve design',
        command: 'Review 07-design.md and approve to proceed',
      });
      options.push({
        description: 'Regenerate design',
        command: 'Run: requirement-commands specs-generate',
      });
      break;

    case 'design_approved':
    case 'specs_complete':
      options.push({
        description: 'Execute implementation tasks',
        command: 'Run: requirement-commands specs-execute',
      });
      break;

    case 'executing':
      options.push({
        description: 'Continue task execution',
        command: 'Review 08-tasks.md and continue with next task',
      });
      options.push({
        description: 'Report a bug',
        command: 'Run: requirement-commands bug-fix',
      });
      options.push({
        description: 'Request a change',
        command: 'Run: requirement-commands spec-enhance',
      });
      break;

    case 'implemented':
      options.push({
        description: 'Review implementation',
        command: 'Run: requirement-commands code-review',
      });
      options.push({
        description: 'Check alignment',
        command: 'Run: requirement-commands revise',
      });
      options.push({
        description: 'Complete session',
        command: 'Run: requirement-commands end',
      });
      break;

    case 'bug_fixing':
      options.push({
        description: 'Continue bug fix',
        command: 'Review 09-bug-tracker.md and continue with fix',
      });
      break;

    case 'change_review':
      options.push({
        description: 'Continue change review',
        command: 'Review 10-change-log.md and 11-change-backlog.md',
      });
      break;

    default:
      options.push({
        description: 'View current session',
        command: 'Run: requirement-commands current',
      });
  }

  return options;
}
