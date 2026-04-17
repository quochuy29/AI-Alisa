/**
 * Specs Generate Command
 * Generate design & tasks
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
 * Generate design and tasks
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
    if (metadata.phase !== 'requirements_complete') {
      console.log(chalk.yellow(`Current phase is: ${metadata.phase}`));
      console.log(chalk.dim('This command requires phase: requirements_complete'));
      console.log(chalk.dim('\nComplete the requirements gathering phase first.'));
      console.log(chalk.dim('Use requirement-commands status to check current progress.'));
      return;
    }

    // Display header
    console.log(chalk.bold('\n📐 Generating Design & Tasks\n'));
    console.log(chalk.gray('═'.repeat(60)));

    // Read requirements spec
    const requirementsSpecPath = path.join(fullSessionPath, '06-requirements-spec.md');
    if (!exists(requirementsSpecPath)) {
      console.log(chalk.yellow('Requirements specification not found.'));
      console.log(chalk.dim('Complete the requirements gathering phase first.'));
      return;
    }

    const requirementsSpec = await readFile(requirementsSpecPath);

    console.log(chalk.blue('📋 Reading requirements specification...'));
    console.log(chalk.dim(`   From: ${requirementsSpecPath}`));

    // Generate design document
    console.log(chalk.blue('\n📝 Generating design document...'));

    const designContent = generateDesignContent(requirementsSpec, metadata.sessionId);
    const designPath = path.join(fullSessionPath, '07-design.md');
    await writeFile(designPath, designContent);
    console.log(chalk.green('✅ Created: 07-design.md'));

    // Generate tasks document
    console.log(chalk.blue('\n✓ Generating task breakdown...'));

    const tasksContent = generateTasksContent(requirementsSpec, metadata.sessionId);
    const tasksPath = path.join(fullSessionPath, '08-tasks.md');
    await writeFile(tasksPath, tasksContent);
    console.log(chalk.green('✅ Created: 08-tasks.md'));

    // Update metadata
    metadata.phase = 'specs_generated';
    metadata.updatedAt = new Date().toISOString();
    metadata.files.push('07-design.md', '08-tasks.md');
    await writeFile(metadataPath, JSON.stringify(metadata, null, 2));

    console.log(chalk.green('✅ Updated metadata.json'));

    console.log(chalk.gray('═'.repeat(60)));

    console.log(chalk.bold('\n✅ Design and tasks generated successfully!\n'));

    console.log(chalk.dim('Next steps:'));
    console.log(`  ${chalk.cyan('•')} Review 07-design.md for technical design`);
    console.log(`  ${chalk.cyan('•')} Review 08-tasks.md for implementation tasks`);
    console.log(`  ${chalk.cyan('•')} Approve design to proceed with implementation`);
    console.log(`  ${chalk.cyan('•')} Run: requirement-commands specs-execute to begin implementation`);

    console.log(chalk.dim('\nSession path:'));
    console.log(chalk.dim(fullSessionPath));

  } catch (error) {
    console.error(chalk.red('Error generating design and tasks:'), error);
    throw error;
  }
}

/**
 * Generate design document content
 */
function generateDesignContent(_requirementsSpec: string, sessionId: string): string {
  const timestamp = new Date().toISOString();

  return `# Technical Design Document

**Session:** ${sessionId}
**Generated:** ${timestamp}

## Overview

This document provides the technical design for implementing the requirements specified in 06-requirements-spec.md.

## Architecture

Based on the requirements, the following architectural decisions are proposed:

### System Architecture
- [To be filled based on requirements]

### Component Structure
- [To be filled based on requirements]

### Technology Stack
- [To be filled based on requirements]

## Design Decisions

### Key Design Decisions
1. [Decision 1]
2. [Decision 2]
3. [Decision 3]

### Rationale
- [Rationale for each design decision]

## Implementation Details

### Data Models
- [To be filled based on requirements]

### API Design
- [To be filled based on requirements]

### Database Schema
- [To be filled based on requirements]

## Security Considerations

- [Security considerations based on requirements]

## Performance Considerations

- [Performance considerations based on requirements]

## Scalability Considerations

- [Scalability considerations based on requirements]

## Testing Strategy

### Unit Testing
- [Unit testing approach]

### Integration Testing
- [Integration testing approach]

### End-to-End Testing
- [E2E testing approach]

## Deployment Strategy

- [Deployment approach based on requirements]

## Risks and Mitigations

| Risk | Impact | Mitigation |
|-------|---------|------------|
| [Risk 1] | [Impact] | [Mitigation] |
| [Risk 2] | [Impact] | [Mitigation] |

## Approval

This design document must be approved before proceeding to implementation.

**Approval Status:** ⏳ Pending Approval

**Approver:** [To be filled]

**Approval Date:** [To be filled]

---
`;
}

/**
 * Generate tasks document content
 */
function generateTasksContent(_requirementsSpec: string, sessionId: string): string {
  const timestamp = new Date().toISOString();

  return `# Implementation Tasks

**Session:** ${sessionId}
**Generated:** ${timestamp}

## Overview

This document breaks down the implementation work into manageable tasks with dependencies.

## Task Breakdown

### Phase 1: Setup and Configuration
- [ ] Task 1.1: [Task description]
  - **Estimated Effort:** [To be filled]
  - **Dependencies:** None
  - **Acceptance Criteria:** [Criteria]

- [ ] Task 1.2: [Task description]
  - **Estimated Effort:** [To be filled]
  - **Dependencies:** Task 1.1
  - **Acceptance Criteria:** [Criteria]

### Phase 2: Core Implementation
- [ ] Task 2.1: [Task description]
  - **Estimated Effort:** [To be filled]
  - **Dependencies:** Phase 1 completion
  - **Acceptance Criteria:** [Criteria]

- [ ] Task 2.2: [Task description]
  - **Estimated Effort:** [To be filled]
  - **Dependencies:** Task 2.1
  - **Acceptance Criteria:** [Criteria]

### Phase 3: Integration and Testing
- [ ] Task 3.1: [Task description]
  - **Estimated Effort:** [To be filled]
  - **Dependencies:** Phase 2 completion
  - **Acceptance Criteria:** [Criteria]

- [ ] Task 3.2: [Task description]
  - **Estimated Effort:** [To be filled]
  - **Dependencies:** Task 3.1
  - **Acceptance Criteria:** [Criteria]

## Task Dependencies

\`\`\`
+---------------------+
| Task ID | Depends On |
+---------+-----------+
| 1.1     | None      |
| 1.2     | 1.1       |
| 2.1     | 1.2       |
| 2.2     | 2.1       |
| 3.1     | 2.2       |
| 3.2     | 3.1       |
+---------------------+
\`\`\`

## Execution Order

Tasks should be executed in the order specified in the task breakdown, respecting dependencies.

## Task Status Tracking

Use the following status indicators for each task:
- ⏳ Not Started
- 🚀 In Progress
- ✅ Complete
- ❌ Blocked
- ⚠️ Deferred

## Notes

- [Additional notes for implementation]

---
`;
}
