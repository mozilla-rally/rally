import { render } from "@testing-library/react";

import { LoginFormValidationResult } from "../LoginFormValidator";
import { PasswordRuleViolations } from "../PasswordRuleViolations";

describe("PasswordRuleViolations tests", () => {
  it("should not render when violations are undefined", () => {
    render(<PasswordRuleViolations />);
    expect(document.querySelector("ul")).not.toBeInTheDocument();
  });

  it("should not render when there are no violations", () => {
    render(
      <PasswordRuleViolations
        validationResult={{
          email: {},
          password: {},
          passwordRules: [],
          valid: true,
        }}
      />
    );
    expect(document.querySelector("ul")).not.toBeInTheDocument();
  });

  it("should not render when password is invalid", () => {
    render(
      <PasswordRuleViolations
        validationResult={{
          email: {},
          password: { error: "Invalid password" },
          passwordRules: [{ title: "should not render", valid: false }],
          valid: false,
        }}
      />
    );
    expect(document.querySelector("ul")).not.toBeInTheDocument();
  });

  it("should not render when there all violations validate correctly", () => {
    render(
      <PasswordRuleViolations
        validationResult={{
          email: {},
          password: {},
          passwordRules: [{ title: "should not render", valid: true }],
          valid: false,
        }}
      />
    );

    expect(document.querySelector("ul")).not.toBeInTheDocument();
  });

  it("renders violations correctly", () => {
    const violations: LoginFormValidationResult = {
      email: { error: "This should not matter" },
      password: {},
      passwordRules: [
        { title: "Rule-1", valid: true },
        { title: "Rule-2", valid: false },
        { title: "Rule-3", valid: true },
        { title: "Rule-4", valid: false },
      ],
      valid: false,
    };

    render(
      <PasswordRuleViolations
        validationResult={violations}
        className="list-root"
      />
    );

    const rules = document.querySelectorAll("ul.list-root > li");

    expect(rules.length).toBe(violations.passwordRules.length);

    rules.forEach((rule, i) => {
      const violation = violations.passwordRules[i];

      if (violation.valid) {
        const del = rule.querySelector("del") as HTMLElement;
        expect(del.innerHTML).toBe(violation.title);
        expect(del.className).toBe("text-muted");
      } else {
        expect(rule.innerHTML).toBe(violation.title);
      }
    });
  });
});
