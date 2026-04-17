/**
 * Bug Fix Command
 * Fix implementation issues with two-step method
 */

import chalk from 'chalk';
import { readFile, exists, writeFile } from '../core/utils/file-system.js';
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
 * Bug interface
 */
interface IBug {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved' | 'verified';
  reportedBy: string;
  reportedDate: string;
  rootCause?: string;
  fixDescription?: string;
  fixVerified?: boolean;
}

/**
 * Fix implementation issues with two-step method
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
    console.log(chalk.bold('\n🐛 Bug Fix Workflow\n'));
    console.log(chalk.gray('═'.repeat(60)));

    console.log(`${chalk.blue('Session:')} ${metadata.sessionId}`);
    console.log(`${chalk.blue('Current Phase:')} ${metadata.phase}`);

    console.log(chalk.gray('═'.repeat(60)));

    // Read bug tracker
    const bugTrackerPath = path.join(fullSessionPath, '09-bug-tracker.md');

    if (!exists(bugTrackerPath)) {
      console.log(chalk.yellow('Bug tracker not found.'));
      console.log(chalk.dim('Creating bug tracker template...'));

      // Create bug tracker template
      const bugTrackerTemplate = createBugTrackerTemplate(metadata.sessionId);
      await writeFile(bugTrackerPath, bugTrackerTemplate);

      console.log(chalk.green(`Created: ${bugTrackerPath}`));
    }

    const bugTrackerContent = await readFile(bugTrackerPath);
    const bugs = parseBugs(bugTrackerContent);

    // Display bugs
    console.log(chalk.bold('\n📋 Bug Tracker\n'));
    console.log(chalk.gray('─'.repeat(60)));

    if (bugs.length === 0) {
      console.log(chalk.yellow('No bugs found in bug tracker.'));
      console.log(chalk.dim('Add bugs to 09-bug-tracker.md to track issues.'));
    } else {
      for (const bug of bugs) {
        const severityIcon = getSeverityIcon(bug.severity);
        const statusIcon = getStatusIcon(bug.status);

        console.log(`${statusIcon} ${severityIcon} ${chalk.bold(bug.id)}: ${bug.title}`);
        console.log(`     ${chalk.dim('Status:')} ${bug.status}`);
        console.log(`     ${chalk.dim('Severity:')} ${bug.severity}`);
        console.log(`     ${chalk.dim('Reported By:')} ${bug.reportedBy}`);
        console.log(`     ${chalk.dim('Date:')} ${bug.reportedDate}`);
        if (bug.rootCause) {
          console.log(`     ${chalk.dim('Root Cause:')} ${bug.rootCause}`);
        }
        if (bug.fixDescription) {
          console.log(`     ${chalk.dim('Fix:')} ${bug.fixDescription}`);
        }
        console.log('');
      }
    }

    console.log(chalk.gray('─'.repeat(60)));

    // Display bug fix workflow
    console.log(chalk.bold('\n⚙️ Bug Fix Workflow (Two-Step Method)\n'));
    console.log(chalk.gray('═'.repeat(60)));

    console.log(`  ${chalk.cyan('Step 1:')} ${chalk.bold('Root Cause Analysis')}`);
    console.log(`      ${chalk.dim('Analyze the bug to determine the root cause')}`);
    console.log(`      ${chalk.dim('Document findings in 09-bug-tracker.md')}`);
    console.log(`      ${chalk.dim('Update bug status to "in_progress"')}`);

    console.log(`\n  ${chalk.cyan('Step 2:')} ${chalk.bold('Fix Implementation & Verification')}`);
    console.log(`      ${chalk.dim('Implement the fix based on root cause analysis')}`);
    console.log(`      ${chalk.dim('Test the fix thoroughly')}`);
    console.log(`      ${chalk.dim('Update bug status to "verified"')}`);
    console.log(`      ${chalk.dim('Update metadata.json phase back to previous phase')}`);

    console.log(chalk.gray('═'.repeat(60)));

    // Display bug fix options
    console.log(chalk.bold('\n📝 Bug Fix Options\n'));
    console.log(chalk.gray('═'.repeat(60)));

    console.log(`  ${chalk.cyan('1.')} ${chalk.bold('Report New Bug')}`);
    console.log(`      ${chalk.dim('Add a new bug to 09-bug-tracker.md')}`);

    console.log(`  ${chalk.cyan('2.')} ${chalk.bold('Analyze Bug (Step 1)')}`);
    console.log(`      ${chalk.dim('Perform root cause analysis')}`);
    console.log(`      ${chalk.dim('Update bug-tracker.md with findings')}`);

    console.log(`  ${chalk.cyan('3.')} ${chalk.bold('Implement Fix (Step 2)')}`);
    console.log(`      ${chalk.dim('Implement and verify the fix')}`);
    console.log(`      ${chalk.dim('Update bug-tracker.md with fix details')}`);

    console.log(`  ${chalk.cyan('4.')} ${chalk.bold('Update Metadata Phase')}`);
    console.log(`      ${chalk.dim('Set phase to "bug_fixing" when starting fix')}`);
    console.log(`      ${chalk.dim('Set phase back to previous phase when complete')}`);

    console.log(`  ${chalk.cyan('5.')} ${chalk.bold('View Bug Tracker')}`);
    console.log(`      ${chalk.dim('View full bug tracker content')}`);

    console.log(chalk.gray('═'.repeat(60)));

    console.log(chalk.dim('\nUse requirement-commands specs-execute to continue implementation.'));
    console.log(chalk.dim('Use requirement-commands code-review to review code quality.'));

    // Display bug tracker template
    console.log(chalk.bold('\n📋 Bug Tracker Template\n'));
    console.log(chalk.gray('═'.repeat(60)));

    const template = createBugTrackerTemplate(metadata.sessionId);
    console.log(template);

    console.log(chalk.gray('═'.repeat(60)));

  } catch (error) {
    console.error(chalk.red('Error fixing bugs:'), error);
    throw error;
  }
}

/**
 * Create bug tracker template
 */
function createBugTrackerTemplate(sessionId: string): string {
  const date = new Date().toISOString();
  return `# Bug Tracker

**Session:** ${sessionId}
**Last Updated:** ${date}

## Bug Entry Template

\`\`\`
## Bug [BUG-001]

- **ID:** BUG-001
- **Title:** [Bug Title]
- **Description:** [Detailed description of the bug]
- **Severity:** [critical | high | medium | low]
- **Status:** [open | in_progress | resolved | verified]
- **Reported By:** [Agent/User]
- **Reported Date:** ${date}

### Root Cause Analysis

[Analyze the root cause of the bug]

### Fix Description

[Describe the fix implementation]

### Verification

[Describe how the fix was verified]

### Related Files

- [List affected files]
\`\`\`

## Bugs

*No bugs reported yet.*

`;
}

/**
 * Parse bugs from bug tracker
 */
function parseBugs(content: string): IBug[] {
  const bugs: IBug[] = [];
  const lines = content.split('\n');

  let currentBug: IBug | null = null;
  let inBugSection = false;
  let inRootCause = false;
  let inFix = false;

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Match bug header: ## Bug [BUG-001]
    const bugMatch = trimmedLine.match(/^##\s+Bug\s+\[(.+?)\]$/);
    if (bugMatch) {
      if (currentBug) {
        bugs.push(currentBug);
      }

      currentBug = {
        id: bugMatch[1],
        title: '',
        description: '',
        severity: 'medium',
        status: 'open',
        reportedBy: '',
        reportedDate: new Date().toISOString(),
      };
      inBugSection = true;
      inRootCause = false;
      inFix = false;
    } else if (currentBug && inBugSection) {
      if (trimmedLine.startsWith('- **Title:**')) {
        currentBug.title = trimmedLine.replace(/- \*\*Title:\*\*/, '').trim();
      } else if (trimmedLine.startsWith('- **Description:**')) {
        currentBug.description = trimmedLine.replace(/- \*\*Description:\*\*/, '').trim();
      } else if (trimmedLine.startsWith('- **Severity:**')) {
        const severity = trimmedLine.replace(/- \*\*Severity:\*\*/, '').trim().toLowerCase();
        if (['critical', 'high', 'medium', 'low'].includes(severity)) {
          currentBug.severity = severity as any;
        }
      } else if (trimmedLine.startsWith('- **Status:**')) {
        const status = trimmedLine.replace(/- \*\*Status:\*\*/, '').trim().toLowerCase();
        if (['open', 'in_progress', 'resolved', 'verified'].includes(status)) {
          currentBug.status = status as any;
        }
      } else if (trimmedLine.startsWith('- **Reported By:**')) {
        currentBug.reportedBy = trimmedLine.replace(/- \*\*Reported By:\*\*/, '').trim();
      } else if (trimmedLine.startsWith('- **Reported Date:**')) {
        currentBug.reportedDate = trimmedLine.replace(/- \*\*Reported Date:\*\*/, '').trim();
      } else if (trimmedLine.startsWith('### Root Cause Analysis')) {
        inRootCause = true;
        inFix = false;
      } else if (trimmedLine.startsWith('### Fix Description')) {
        inFix = true;
        inRootCause = false;
      } else if (inRootCause && trimmedLine && !trimmedLine.startsWith('#')) {
        currentBug.rootCause = (currentBug.rootCause || '') + trimmedLine + '\n';
      } else if (inFix && trimmedLine && !trimmedLine.startsWith('#')) {
        currentBug.fixDescription = (currentBug.fixDescription || '') + trimmedLine + '\n';
      }
    }
  }

  // Add the last bug if exists
  if (currentBug) {
    bugs.push(currentBug);
  }

  return bugs;
}

/**
 * Get severity icon
 */
function getSeverityIcon(severity: string): string {
  switch (severity) {
    case 'critical':
      return '🔴';
    case 'high':
      return '🟠';
    case 'medium':
      return '🟡';
    case 'low':
      return '🟢';
    default:
      return '⚪';
  }
}

/**
 * Get status icon
 */
function getStatusIcon(status: string): string {
  switch (status) {
    case 'open':
      return '📝';
    case 'in_progress':
      return '🔧';
    case 'resolved':
      return '✅';
    case 'verified':
      return '✨';
    default:
      return '⚪';
  }
}
