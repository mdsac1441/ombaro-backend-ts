export const validatePassword= (password: string): boolean => {
  // Has at least 8 characters
  if (password.length < 8) return false;

  // Has uppercase letters
  if (!/[A-Z]/.test(password)) return false;

  // Has lowercase letters
  if (!/[a-z]/.test(password)) return false;

  // Has numbers
  if (!/\d/.test(password)) return false;

  // Has non-alphanumeric characters
  return !!/\W/.test(password);
}