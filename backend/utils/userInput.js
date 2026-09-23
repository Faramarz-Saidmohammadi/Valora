const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizeEmail = (email) =>
  typeof email === 'string' ? email.trim().toLowerCase() : '';

export const validateAccountInput = ({ name, email, password }, options = {}) => {
  const { requirePassword = true } = options;

  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 80) {
    return 'Name must be between 2 and 80 characters';
  }

  if (!EMAIL_PATTERN.test(normalizeEmail(email)) || normalizeEmail(email).length > 254) {
    return 'Enter a valid email address';
  }

  if ((requirePassword || password) &&
      (typeof password !== 'string' || password.length < 8 || password.length > 128)) {
    return 'Password must be between 8 and 128 characters';
  }

  return null;
};
