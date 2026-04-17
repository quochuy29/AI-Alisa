/**
 * Post-install Script
 * Runs after npm install to set up the package
 */

// Guard: skip postinstall output for npx and CI environments
const userAgent = process.env.npm_config_user_agent || '';
if (userAgent.includes('npx') || process.env.CI) {
  process.exit(0);
}

console.log('✅ requirement-commands installed successfully!');
console.log('');
console.log('Getting Started:');
console.log('1. Run: requirement-commands init');
console.log('2. This installs slash commands and creates the requirements/ directory');
console.log('3. Use /requirements-start [description] to begin a new requirement session');
console.log('');
console.log('For more information, run: requirement-commands --help');
