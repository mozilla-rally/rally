import { Strings } from "../../../../resources/Strings";
import { validateLoginForm } from "../LoginFormValidator";

const strings = Strings.components.pages.login.loginFormValidators;
const passwordRules = strings.passwordRules;

const allInvalidPasswordRules = [
  { title: passwordRules.minLength, valid: false },
  { title: passwordRules.containsLowercase, valid: false },
  { title: passwordRules.containsUppercase, valid: false },
  { title: passwordRules.containsDigit, valid: false },
];

describe("LoginFormValidators tests", () => {
  it("empty email and password", () => {
    const result = validateLoginForm("", "");

    expect(result.email.error).toBe(strings.required);
    expect(result.password.error).toBe(strings.required);
    expect(result.passwordRules).toEqual(allInvalidPasswordRules);
    expect(result.valid).toBeFalsy();
  });

  it("invalid email and empty password", () => {
    const result = validateLoginForm("invalidemail", "");

    expect(result.email.error).toBe(strings.invalidFormat);
    expect(result.password.error).toBe(strings.required);
    expect(result.passwordRules).toEqual(allInvalidPasswordRules);
    expect(result.valid).toBeFalsy();
  });

  it("valid email and empty password", () => {
    const result = validateLoginForm("john.doe@mail.com", "");

    expect(result.email.error).toBeNull();
    expect(result.password.error).toBe(strings.required);
    expect(result.passwordRules).toEqual(allInvalidPasswordRules);
    expect(result.valid).toBeFalsy();
  });

  it("valid email, password does not meet minimum length", () => {
    const result = validateLoginForm("john.doe@mail.com", "#");

    expect(result.email.error).toBeNull();
    expect(result.password.error).toBeNull();

    expect(result.passwordRules).toEqual(allInvalidPasswordRules);
    expect(result.valid).toBeFalsy();
  });

  it("valid email, password meets minimum length", () => {
    const result = validateLoginForm("john.doe@mail.com", "###########");

    expect(result.email.error).toBeNull();
    expect(result.password.error).toBeNull();

    const expectedPasswordRules = [...allInvalidPasswordRules];
    expectedPasswordRules[0].valid = true;

    expect(result.passwordRules).toEqual(expectedPasswordRules);
    expect(result.valid).toBeFalsy();
  });

  it("valid email, password meets minimum length, contains lowercase", () => {
    const result = validateLoginForm("john.doe@mail.com", "aaaaaaaaaaa");

    expect(result.email.error).toBeNull();
    expect(result.password.error).toBeNull();

    const expectedPasswordRules = [...allInvalidPasswordRules];
    expectedPasswordRules[0].valid = true;
    expectedPasswordRules[1].valid = true;

    expect(result.passwordRules).toEqual(expectedPasswordRules);
    expect(result.valid).toBeFalsy();
  });

  it("valid email, password meets minimum length, contains lowercase and uppercase", () => {
    const result = validateLoginForm("john.doe@mail.com", "aaaaaAAAAAA");

    expect(result.email.error).toBeNull();
    expect(result.password.error).toBeNull();

    const expectedPasswordRules = [...allInvalidPasswordRules];
    expectedPasswordRules[0].valid = true;
    expectedPasswordRules[1].valid = true;
    expectedPasswordRules[2].valid = true;

    expect(result.passwordRules).toEqual(expectedPasswordRules);
    expect(result.valid).toBeFalsy();
  });

  it("valid email, password meets minimum length, contains lowercase, uppercase and digit", () => {
    const result = validateLoginForm("john.doe@mail.com", "aaaaaAAAAAA123");

    expect(result.email.error).toBeNull();
    expect(result.password.error).toBeNull();

    const expectedPasswordRules = [...allInvalidPasswordRules];
    expectedPasswordRules[0].valid = true;
    expectedPasswordRules[1].valid = true;
    expectedPasswordRules[2].valid = true;
    expectedPasswordRules[3].valid = true;

    expect(result.passwordRules).toEqual(expectedPasswordRules);
    expect(result.valid).toBeTruthy();
  });
});
