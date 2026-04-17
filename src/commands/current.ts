/**
 * Current Command
 * View current requirement details
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
 * File descriptions for display
 */
const FILE_DESCRIPTIONS: Record<string, string> = {
  '00-initial-request.md': 'Initial feature request',
  '01-discovery-questions.md': 'Context discovery questions',
  '02-discovery-answers.md': 'Discovery answers',
  '03-context-findings.md': 'Codebase context findings',
  '04-detail-questions.md': 'Expert detail questions',
  '05-detail-answers.md': 'Detail answers',
  '06-requirements-spec.md': 'Requirements specification',
  '07-design.md': 'Technical design document',
  '08-tasks.md': 'Implementation tasks',
  '09-bug-tracker.md': 'Bug tracking log',
  '10-change-log.md': 'Change log',
  '11-change-backlog.md': 'Change backlog',
};

/**
 * View current requirement
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

    // Display session header
    console.log(chalk.bold('\n📋 Current Requirement Session\n'));
    console.log(chalk.gray('═'.repeat(60)));

    console.log(`${chalk.blue('Session ID:')} ${metadata.sessionId}`);
    console.log(`${chalk.blue('Status:')} ${metadata.status}`);
    console.log(`${chalk.blue('Phase:')} ${metadata.phase}`);
    console.log(`${chalk.blue('Created:')} ${new Date(metadata.createdAt).toLocaleString()}`);
    console.log(`${chalk.blue('Updated:')} ${new Date(metadata.updatedAt).toLocaleString()}`);
    console.log(`${chalk.blue('Path:')} ${fullSessionPath}`);

    console.log(chalk.gray('═'.repeat(60)));

    // Display files section
    console.log(chalk.bold('\n📁 Session Files\n'));
    console.log(chalk.gray('─'.repeat(60)));

    // List all files in session directory
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

    // Display each file with status and preview
    for (const file of standardFiles) {
      const filePath = path.join(fullSessionPath, file);
      const fileExists = exists(filePath);
      const description = FILE_DESCRIPTIONS[file] || 'Unknown file';

      if (fileExists) {
        // Get file preview (first few lines)
        try {
          const content = await readFile(filePath);
          const lines = content.split('\n').filter(line => line.trim());
          const preview = lines.length > 0 ? lines[0].substring(0, 60) + (lines[0].length > 60 ? '...' : '') : '(empty)';
          console.log(`  ${chalk.green('✅')} ${chalk.bold(file.replace('.md', ''))}`);
          console.log(`      ${chalk.dim(description)}`);
          console.log(`      ${chalk.cyan(preview)}`);
          console.log('');
        } catch {
          console.log(`  ${chalk.green('✅')} ${chalk.bold(file.replace('.md', ''))}`);
          console.log(`      ${chalk.dim(description)}`);
          console.log(`      ${chalk.dim('(unable to read preview)')}`);
          console.log('');
        }
      } else {
        console.log(`  ${chalk.red('❌')} ${chalk.bold(file.replace('.md', ''))}`);
        console.log(`      ${chalk.dim(description)}`);
        console.log(`      ${chalk.red('(not created yet)')}`);
        console.log('');
      }
    }

    console.log(chalk.gray('─'.repeat(60)));

    // Display next steps based on phase
    console.log(chalk.bold('\n🚀 Next Steps\n'));
    const nextSteps = getNextSteps(metadata.phase);
    for (const step of nextSteps) {
      console.log(`  ${chalk.cyan('•')} ${step.description}`);
      console.log(`    ${chalk.dim(step.command)}`);
    }

    console.log(chalk.gray('═'.repeat(60)));
    console.log(chalk.dim(`\nUse ${chalk.cyan('requirement-commands status')} for more options.`));

  } catch (error) {
    console.error(chalk.red('Error viewing current requirement:'), error);
    throw error;
  }
}

/**
 * Get next steps based on current phase
 */
function getNextSteps(phase: string): Array<{ description: string; command: string }> {
  const steps: Array<{ description: string; command: string }> = [];

  switch (phase) {
    case 'discovery':
      steps.push({
        description: 'Continue discovery questions',
        command: 'Review 01-discovery-questions.md and continue',
      });
      break;

    case 'context':
      steps.push({
        description: 'Continue context analysis',
        command: 'Review 03-context-findings.md and continue',
      });
      break;

    case 'detail':
      steps.push({
        description: 'Continue detail questions',
        command: 'Review 04-detail-questions.md and continue',
      });
      break;

    case 'requirements_complete':
      steps.push({
        description: 'Generate design and tasks',
        command: 'Run: requirement-commands specs-generate',
      });
      break;

    case 'specs_generated':
      steps.push({
        description: 'Review and approve design',
        command: 'Review 07-design.md and approve',
      });
      break;

    case 'design_approved':
    case 'specs_complete':
      steps.push({
        description: 'Execute implementation tasks',
        command: 'Run: requirement-commands specs-execute',
      });
      break;

    case 'executing':
      steps.push({
        description: 'Continue task execution',
        command: 'Review 08-tasks.md and continue',
      });
      steps.push({
        description: 'Report a bug',
        command: 'Run: requirement-commands bug-fix',
      });
      steps.push({
        description: 'Request a change',
        command: 'Run: requirement-commands spec-enhance',
      });
      break;

    case 'implemented':
      steps.push({
        description: 'Review implementation',
        command: 'Run: requirement-commands code-review',
      });
      steps.push({
        description: 'Check alignment',
        command: 'Run: requirement-commands revise',
      });
      steps.push({
        description: 'Complete session',
        command: 'Run: requirement-commands end',
      });
      break;

    case 'bug_fixing':
      steps.push({
        description: 'Continue bug fix',
        command: 'Review 09-bug-tracker.md and continue',
      });
      break;

    case 'change_review':
      steps.push({
        description: 'Continue change review',
        command: 'Review 10-change-log.md and 11-change-backlog.md',
      });
      break;

    default:
      steps.push({
        description: 'View session status',
        command: 'Run: requirement-commands status',
      });
  }

  return steps;
}
