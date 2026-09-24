/**
 * Store Code & Sub-Code Utility
 * Rule: Standard prefix 'CH-' followed by a 4-digit number (1000 - 9999)
 * e.g. "CH-4912", "CH-1084"
 */

export function generateRandomCode(prefix: string = 'CH'): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomNum}`;
}

export function generateProductSku(): string {
  return generateRandomCode('CH');
}

export function generateSubCode(): string {
  return generateRandomCode('CH');
}
