const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const isValidEmail = (value: string): boolean => EMAIL_REGEX.test(value.trim());

export const isValidPhone = (value: string): boolean => {
  const digits = value.trim().replace(/[\s\-()]/g, "");
  return /^[6-9]\d{9}$/.test(digits);
};
