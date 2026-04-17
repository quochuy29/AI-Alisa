/**
 * End Command
 * Complete and archive session
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
 * Complete session
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

    // Display session information
    console.log(chalk.bold('\n📋 Completing Requirement Session\n'));
    console.log(chalk.gray('═'.repeat(60)));

    console.log(`${chalk.blue('Session ID:')} ${metadata.sessionId}`);
    console.log(`${chalk.blue('Current Phase:')} ${metadata.phase}`);
    console.log(`${chalk.blue('Current Status:')} ${metadata.status}`);

    console.log(chalk.gray('═'.repeat(60)));

    // Confirm completion
    console.log(chalk.yellow('\n⚠️  This will:'));
    console.log('  1. Update metadata.json status to "completed"');
    console.log('  2. Move session directory to .archive/');
    console.log('  3. Clear .current-requirement pointer');

    console.log(chalk.dim('\nArchived sessions will be kept in requirements/.archive/'));

    // Update metadata
    metadata.status = 'completed';
    metadata.updatedAt = new Date().toISOString();

    await writeFile(metadataPath, JSON.stringify(metadata, null, 2));

    console.log(chalk.green('\n✅ Updated metadata.json'));

    // Create archive directory if it doesn't exist
    const archiveDir = path.join(REQUIREMENTS_DIR, '.archive');
    const { ensureDir } = await import('../core/utils/file-system.js');
    await ensureDir(archiveDir);

    // Move session to archive
    const archivePath = path.join(archiveDir, sessionPath);
    const { copyFile, deletePath: deletePathFn } = await import('../core/utils/file-system.js');

    // First copy to archive
    await copyFile(fullSessionPath, archivePath);
    console.log(chalk.green('✅ Copied session to .archive/'));
    console.log(chalk.dim(`   Archive path: ${archivePath}`));

    // Then delete original
    await deletePathFn(fullSessionPath);
    console.log(chalk.green('✅ Removed original session directory'));

    // Clear current requirement pointer
    await writeFile(CURRENT_REQUIREMENT_FILE, '');
    console.log(chalk.green('✅ Cleared .current-requirement pointer'));

    console.log(chalk.gray('═'.repeat(60)));

    console.log(chalk.bold('\n✅ Session completed successfully!\n'));

    console.log(chalk.dim('Next steps:'));
    console.log(`  ${chalk.cyan('•')} View archived sessions: requirements/.archive/`);
    console.log(`  ${chalk.cyan('•')} Start a new session: requirement-commands start`);
    console.log(`  ${chalk.cyan('•')} List all sessions: requirement-commands list`);

    console.log(chalk.gray('═'.repeat(60)));

  } catch (error) {
    console.error(chalk.red('Error completing session:'), error);
    throw error;
  }
}
