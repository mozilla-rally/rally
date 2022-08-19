import { Strings } from "../../../resources/Strings";

const strings = Strings.components.pages.login.loginFormValidators;

export interface LoginFormValidationResult {
  email: {
    error?: string | null;
  };
  password: {
    error?: string | null;
  };
  passwordRules: PasswordRule[];
  valid: boolean;
}

export interface PasswordAccountValidationResult {
  currentPassword: {
    error?: string | null;
  };
  newPassword: {
    error?: string | null;
  };
  confirmPassword: {
    error?: string | null;
  };
  passwordRules: PasswordRule[];
  valid: boolean;
}

export interface PasswordRule {
  title: string;
  valid: boolean;
}

export function validateLoginForm(
  email: string,
  password: string
): LoginFormValidationResult {
  const result: LoginFormValidationResult = {
    email: {
      error: validateEmailAndReturnError(email),
    },
    password: {
      error: validatePasswordAndReturnError(password),
    },
    passwordRules: validatePasswordRules(password),
    valid: false,
  };

  result.valid =
    !result.email.error &&
    !result.password.error &&
    !result.passwordRules.find((rule) => !rule.valid);

  return result;
}

export function validatePasswordAccountForm(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string

): PasswordAccountValidationResult {
  const result: PasswordAccountValidationResult = {
    currentPassword: {
      error: validatePasswordAndReturnError(currentPassword),
    },
    newPassword: {
      error: validatePasswordAndReturnError(newPassword),
    },
    confirmPassword: {
      error: validatePasswordAndReturnError(confirmPassword),
    },
    passwordRules: validatePasswordRules(newPassword),
    valid: false,
  };

  result.valid =
    !result.currentPassword.error &&
    !result.newPassword.error &&
    !result.confirmPassword.error &&
    !result.passwordRules.find((rule) => !rule.valid);

  return result;
}

export function validatePasswordRules(password: string): PasswordRule[] {
  const normalizedPassword = (password || "").trim();

  let containsLowercase = false;
  let containsUppercase = false;
  let containsDigit = false;

  const lowercaseRegExp = /[a-z]/;
  const uppercaseRegExp = /[A-Z]/;
  const digitRegExp = /^\d+$/;

  for (const char of normalizedPassword) {
    containsLowercase = containsLowercase || lowercaseRegExp.test(char);
    containsUppercase = containsUppercase || uppercaseRegExp.test(char);
    containsDigit = containsDigit || digitRegExp.test(char);
  }

  const passwordRules = strings.passwordRules;

  return [
    {
      title: passwordRules.minLength,
      valid: normalizedPassword.length >= 8,
    },
    {
      title: passwordRules.containsLowercase,
      valid: containsLowercase,
    },
    {
      title: passwordRules.containsUppercase,
      valid: containsUppercase,
    },
    {
      title: passwordRules.containsDigit,
      valid: containsDigit,
    },
  ];
}

export function validateEmailAndReturnError(email: string) {
  const emailPattern = // eslint-disable-next-line no-useless-escape
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

  const normalizedEmail = (email || "").trim();

  if (!normalizedEmail) {
    return strings.required;
  }

  if (!normalizedEmail.match(emailPattern)) {
    return strings.invalidFormat;
  }

  return null;
}

function validatePasswordAndReturnError(password: string) {
  const normalizedPassword = (password || "").trim();

  if (!normalizedPassword) {
    return strings.required;
  }

  return null;
}
