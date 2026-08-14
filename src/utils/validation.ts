const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const isValidEmail = (value: string): boolean => EMAIL_REGEX.test(value.trim());
