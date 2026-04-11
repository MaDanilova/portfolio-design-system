// Top common passwords to reject (subset of top-1000 list)
const COMMON_PASSWORDS = new Set([
  "password", "12345678", "123456789", "1234567890", "qwerty123",
  "password1", "iloveyou", "sunshine1", "princess1", "football1",
  "charlie1", "trustno1", "letmein01", "baseball1", "dragon123",
  "master123", "monkey123", "shadow123", "ashley123", "michael1",
  "qwertyui", "abcdefgh", "11111111", "00000000", "password123",
  "abc12345", "admin123", "welcome1", "pass1234", "changeme1",
]);

export interface PasswordValidation {
  valid: boolean;
  errors: string[];
}

export function validatePasswordStrength(password: string): PasswordValidation {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    errors.push("This password is too common — please choose a stronger one");
  }

  return { valid: errors.length === 0, errors };
}
