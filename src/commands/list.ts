/**
 * List Command
 * List all requirements with status indicators
 */

import chalk from 'chalk';
import { readFile, exists, listFiles } from '../core/utils/file-system.js';
import * as path from 'path';
import * as fs from 'fs/promises';

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
 * Status icons for visual display
 */
const STATUS_ICONS: Record<string, string> = {
  active: '🟢',
  completed: '✅',
  archived: '📦',
};

/**
 * List all requirements
 */
export async function execute(): Promise<void> {
  const REQUIREMENTS_DIR = 'requirements';

  try {
    // Check if requirements directory exists
    if (!exists(REQUIREMENTS_DIR)) {
      console.log(chalk.yellow('Requirements directory not found.'));
      console.log(chalk.dim('Run `requirement-commands init` to initialize the requirements directory.'));
      return;
    }

    // Get all directories in requirements/ (excluding hidden files and .current-requirement)
    const allEntries = await listFiles(REQUIREMENTS_DIR, '*');
    const dirChecks = await Promise.all(
      allEntries.map(async entry => {
        if (entry.startsWith('.')) return null;
        const fullPath = path.join(REQUIREMENTS_DIR, entry);
        try {
          const stat = await fs.stat(fullPath);
          return stat.isDirectory() ? entry : null;
        } catch {
          return null;
        }
      })
    );
    const sessionDirs = dirChecks.filter((entry): entry is string => entry !== null);

    if (sessionDirs.length === 0) {
      console.log(chalk.yellow('No requirement sessions found.'));
      console.log(chalk.dim('Run `requirement-commands start` to begin a new requirement session.'));
      return;
    }

    // Read current requirement pointer
    const CURRENT_REQUIREMENT_FILE = path.join(REQUIREMENTS_DIR, '.current-requirement');
    let currentSession = '';
    if (exists(CURRENT_REQUIREMENT_FILE)) {
      currentSession = (await readFile(CURRENT_REQUIREMENT_FILE)).trim();
    }

    // Display header
    console.log(chalk.bold('\n📋 All Requirement Sessions\n'));
    console.log(chalk.gray('═'.repeat(60)));

    // Process each session directory
    const sessions: Array<{
      sessionId: string;
      phase: string;
      status: string;
      summary: string;
      createdAt: string;
      updatedAt: string;
      isCurrent: boolean;
    }> = [];

    for (const sessionDir of sessionDirs) {
      const sessionPath = path.join(REQUIREMENTS_DIR, sessionDir);
      const metadataPath = path.join(sessionPath, 'metadata.json');
      const initialRequestPath = path.join(sessionPath, '00-initial-request.md');

      if (exists(metadataPath)) {
        try {
          const metadataContent = await readFile(metadataPath);
          const metadata: IMetadata = JSON.parse(metadataContent);

          // Get summary from initial request
          let summary = 'No summary available';
          if (exists(initialRequestPath)) {
            const requestContent = await readFile(initialRequestPath);
            // Get first non-empty line as summary
            const lines = requestContent.split('\n').filter(line => line.trim());
            if (lines.length > 0) {
              summary = lines[0].substring(0, 50) + (lines[0].length > 50 ? '...' : '');
            }
          }

          sessions.push({
            sessionId: metadata.sessionId,
            phase: metadata.phase,
            status: metadata.status,
            summary,
            createdAt: metadata.createdAt,
            updatedAt: metadata.updatedAt,
            isCurrent: sessionDir === currentSession,
          });
        } catch {
          // Skip sessions with invalid metadata
          console.log(chalk.dim(`Skipping ${sessionDir}: invalid metadata`));
        }
      }
    }

    // Sort sessions by updatedAt (newest first)
    sessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    // Display sessions
    for (const session of sessions) {
      const currentIndicator = session.isCurrent ? chalk.cyan('◄ CURRENT') : '          ';
      const statusIcon = STATUS_ICONS[session.status] || '⚪';
      const updatedAt = new Date(session.updatedAt).toLocaleDateString();

      console.log(`${currentIndicator} ${statusIcon} ${chalk.bold(session.sessionId)}`);
      console.log(`             ${chalk.dim('Status:')} ${session.status} ${chalk.dim('| Phase:')} ${session.phase}`);
      console.log(`             ${chalk.dim('Summary:')} ${session.summary}`);
      console.log(`             ${chalk.dim('Updated:')} ${updatedAt}`);
      console.log('');
    }

    console.log(chalk.gray('═'.repeat(60)));

    // Display summary
    console.log(chalk.bold('\n📊 Summary\n'));
    console.log(`  Total sessions: ${chalk.cyan(sessions.length)}`);
    const activeCount = sessions.filter(s => s.status === 'active').length;
    const completedCount = sessions.filter(s => s.status === 'completed').length;
    const archivedCount = sessions.filter(s => s.status === 'archived').length;
    console.log(`  Active: ${chalk.green(activeCount)} | Completed: ${chalk.blue(completedCount)} | Archived: ${chalk.gray(archivedCount)}`);

    console.log(chalk.gray('═'.repeat(60)));
    console.log(chalk.dim(`\nUse ${chalk.cyan('requirement-commands status')} to check current session progress.`));
    console.log(chalk.dim(`Use ${chalk.cyan('requirement-commands current')} to view current session details.`));

  } catch (error) {
    console.error(chalk.red('Error listing requirements:'), error);
    throw error;
  }
}
