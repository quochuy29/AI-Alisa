/**
 * Specs Execute Command
 * Execute tasks
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
 * Task interface
 */
interface ITask {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'complete' | 'blocked';
  dependencies: string[];
  estimatedEffort?: string;
}

/**
 * Execute tasks
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

    // Check if phase is correct
    if (metadata.phase !== 'specs_complete' && metadata.phase !== 'design_approved') {
      console.log(chalk.yellow(`Current phase is: ${metadata.phase}`));
      console.log(chalk.dim('This command requires phase: specs_complete or design_approved'));
      console.log(chalk.dim('\nComplete design and task generation first.'));
      console.log(chalk.dim('Use: requirement-commands specs-generate'));
      return;
    }

    // Read tasks document
    const tasksPath = path.join(fullSessionPath, '08-tasks.md');
    if (!exists(tasksPath)) {
      console.log(chalk.yellow('Tasks document not found.'));
      console.log(chalk.dim('Run: requirement-commands specs-generate'));
      return;
    }

    const tasksContent = await readFile(tasksPath);

    // Display header
    console.log(chalk.bold('\n🚀 Executing Implementation Tasks\n'));
    console.log(chalk.gray('═'.repeat(60)));

    console.log(`${chalk.blue('Session:')} ${metadata.sessionId}`);
    console.log(`${chalk.blue('Phase:')} ${metadata.phase}`);

    console.log(chalk.gray('═'.repeat(60)));

    // Parse tasks from the document
    const tasks = parseTasks(tasksContent);

    if (tasks.length === 0) {
      console.log(chalk.yellow('No tasks found in 08-tasks.md'));
      console.log(chalk.dim('The tasks document may be incomplete or empty.'));
      return;
    }

    // Display tasks with status
    console.log(chalk.bold('\n📋 Task List\n'));
    console.log(chalk.gray('─'.repeat(60)));

    for (const task of tasks) {
      const statusIcon = getTaskStatusIcon(task.status);
      const statusText = getTaskStatusText(task.status);

      console.log(`${statusIcon} ${chalk.bold(task.id)}: ${task.description}`);
      console.log(`     ${chalk.dim('Status:')} ${statusText}`);
      if (task.dependencies.length > 0) {
        console.log(`     ${chalk.dim('Dependencies:')} ${task.dependencies.join(', ')}`);
      }
      if (task.estimatedEffort) {
        console.log(`     ${chalk.dim('Effort:')} ${task.estimatedEffort}`);
      }
      console.log('');
    }

    console.log(chalk.gray('─'.repeat(60)));

    // Display task execution options
    console.log(chalk.bold('\n⚙️ Task Execution Options\n'));
    console.log(chalk.gray('═'.repeat(60)));

    console.log(`  ${chalk.cyan('1.')} ${chalk.bold('Execute All Tasks')}`);
    console.log(`      ${chalk.dim('Execute all tasks in dependency order')}`);

    console.log(`  ${chalk.cyan('2.')} ${chalk.bold('Execute Specific Task')}`);
    console.log(`      ${chalk.dim('Execute a specific task by ID')}`);

    console.log(`  ${chalk.cyan('3.')} ${chalk.bold('Mark Task Complete')}`);
    console.log(`      ${chalk.dim('Mark a task as complete without executing')}`);

    console.log(`  ${chalk.cyan('4.')} ${chalk.bold('Report Bug')}`);
    console.log(`      ${chalk.dim('Report a bug for the current task')}`);

    console.log(`  ${chalk.cyan('5.')} ${chalk.bold('Request Change')}`);
    console.log(`      ${chalk.dim('Request a change to requirements')}`);

    console.log(`  ${chalk.cyan('6.')} ${chalk.bold('Update Metadata')}`);
    console.log(`      ${chalk.dim('Update task status in metadata.json')}`);

    console.log(chalk.gray('═'.repeat(60)));

    console.log(chalk.dim('\nUse requirement-commands status to check progress.'));
    console.log(chalk.dim('Use requirement-commands bug-fix for bug fixes.'));
    console.log(chalk.dim('Use requirement-commands spec-enhance for changes.'));

  } catch (error) {
    console.error(chalk.red('Error executing tasks:'), error);
    throw error;
  }
}

/**
 * Parse tasks from tasks document
 */
function parseTasks(content: string): ITask[] {
  const tasks: ITask[] = [];
  const lines = content.split('\n');

  let currentTask: ITask | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Match task pattern: ## Task 1.1: Description
    const taskMatch = trimmedLine.match(/^##\s+Task\s+(\d+(?:\.\d+)?)\s*:\s*(.+)$/);
    if (taskMatch) {
      if (currentTask) {
        tasks.push(currentTask);
      }

      currentTask = {
        id: taskMatch[1],
        description: taskMatch[2].trim(),
        status: 'pending',
        dependencies: [],
      };
    } else if (trimmedLine.startsWith('- **Status:**')) {
      // Parse task status
      const statusLine = trimmedLine.replace(/- \*\*Status:\*\*/, '').trim().toLowerCase();
      if (currentTask) {
        if (statusLine.includes('complete')) {
          currentTask.status = 'complete';
        } else if (statusLine.includes('in_progress') || statusLine.includes('in progress')) {
          currentTask.status = 'in_progress';
        } else if (statusLine.includes('blocked')) {
          currentTask.status = 'blocked';
        }
      }
    } else if (trimmedLine.startsWith('- **Dependencies:**')) {
      // Parse task dependencies
      if (currentTask) {
        const deps = trimmedLine.replace(/- \*\*Dependencies:\*\*/, '').trim();
        currentTask.dependencies = deps.split(',').map(d => d.trim()).filter(d => d);
      }
    } else if (trimmedLine.startsWith('- **Estimated Effort:**')) {
      // Parse estimated effort
      if (currentTask) {
        currentTask.estimatedEffort = trimmedLine.replace(/- \*\*Estimated Effort:\*\*/, '').trim();
      }
    }
  }

  // Add the last task if exists
  if (currentTask) {
    tasks.push(currentTask);
  }

  return tasks;
}

/**
 * Get task status icon
 */
function getTaskStatusIcon(status: string): string {
  switch (status) {
    case 'pending':
      return '⏳';
    case 'in_progress':
      return '🚀';
    case 'complete':
      return '✅';
    case 'blocked':
      return '❌';
    default:
      return '⚪';
  }
}

/**
 * Get task status text
 */
function getTaskStatusText(status: string): string {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'in_progress':
      return 'In Progress';
    case 'complete':
      return 'Complete';
    case 'blocked':
      return 'Blocked';
    default:
      return 'Unknown';
  }
}
