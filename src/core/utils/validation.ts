/**
 * Validation Utilities
 * Provides helper functions for validating inputs and data
 */

/**
 * Check if a string is a valid directory name
 */
export function isValidDirectoryName(name: string): boolean {
  if (!name || name.trim().length === 0) {
    return false;
  }
  // Check for invalid characters
  const invalidChars = /[<>:"|?*]/;
  if (invalidChars.test(name)) {
    return false;
  }
  // Check for reserved names
  const reservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];
  const upperName = name.toUpperCase();
  if (reservedNames.includes(upperName)) {
    return false;
  }
  return true;
}

/**
 * Validate that a value is not empty
 */
export function isNotEmpty(value: string | null | undefined): boolean {
  return value !== null && value !== undefined && value.trim().length > 0;
}

/**
 * Sanitize a string for use as a filename
 */
export function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

/**
 * Validate a JSON string
 */
export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a string is a valid timestamp format (YYYY-MM-DD-HHMM)
 */
export function isValidTimestamp(timestamp: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}-\d{4}$/;
  return regex.test(timestamp);
}

/**
 * Generate a timestamp string
 */
export function generateTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}-${hours}${minutes}`;
}
