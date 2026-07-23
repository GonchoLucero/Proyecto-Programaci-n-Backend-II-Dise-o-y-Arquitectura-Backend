export const MIN_PASSWORD_LENGTH = 6;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (email) => EMAIL_REGEX.test(email);

export const isValidPasswordLength = (password) =>
    typeof password === 'string' && password.length >= MIN_PASSWORD_LENGTH;
