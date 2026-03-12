export const PHONE_REGEX = /^[6-9]\d{9}$/;

export const EMAIL_REGEX =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

// At least 8 chars, one letter, one number
export const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/;

export const validatePhone = (value: string): string | null => {
  if (!value?.trim()) return 'Phone number is required';
  if (!PHONE_REGEX.test(value.trim())) return 'Enter a valid 10‑digit phone number';
  return null;
};

export const validateEmailOrPhone = (value: string): string | null => {
  const v = value.trim();
  if (!v) return 'Email or phone is required';
  if (PHONE_REGEX.test(v) || EMAIL_REGEX.test(v)) return null;
  return 'Enter a valid email or phone number';
};

export const validateEmail = (value: string): string | null => {
  if (!value?.trim()) return 'Email is required';
  if (!EMAIL_REGEX.test(value.trim())) return 'Enter a valid email address';
  return null;
};

export const validatePassword = (value: string): string | null => {
  if (!value) return 'Password is required';
  if (!PASSWORD_REGEX.test(value)) {
    return 'Password must be at least 8 characters, include letters and numbers';
  }
  return null;
};

export const validateConfirmPassword = (
  password: string,
  confirm: string,
): string | null => {
  if (!confirm) return 'Confirm password is required';
  if (password !== confirm) return 'Passwords do not match';
  return null;
};

