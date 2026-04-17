/**
 * Build Script
 * Compiles TypeScript to JavaScript
 */

import { execSync } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';

console.log('Building requirement-commands...');

/**
 * Recursively copy a directory from src to dest
 */
async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

try {
  // Clean dist directory
  const distDir = path.join(process.cwd(), 'dist');
  try {
    await fs.rm(distDir, { recursive: true, force: true });
    console.log('Cleaned dist directory');
  } catch {
    // Directory doesn't exist, that's fine
  }

  // Run TypeScript compiler
  console.log('Compiling TypeScript...');
  execSync('npx tsc', { stdio: 'inherit' });

  // Copy source templates to dist so they are available at runtime
  const srcTemplates = path.join(process.cwd(), 'src', 'templates');
  const distTemplates = path.join(distDir, 'templates');
  console.log('Copying templates to dist...');
  await copyDir(srcTemplates, distTemplates);

  console.log('✅ Build successful!');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}
