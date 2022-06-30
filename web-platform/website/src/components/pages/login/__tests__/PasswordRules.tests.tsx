import { render } from "@testing-library/react";

import { PasswordRule } from "../LoginFormValidator";
import { PasswordRules } from "../PasswordRules";

describe("PasswordRules tests", () => {
  it("should not render when rules are empty", () => {
    render(<PasswordRules rules={[]} />);
    expect(document.querySelector("ul")).not.toBeInTheDocument();
  });

  it("renders rules correctly", () => {
    const passwordRules: PasswordRule[] = [
      { title: "Rule-1", valid: true },
      { title: "Rule-2", valid: false },
      { title: "Rule-3", valid: true },
      { title: "Rule-4", valid: false },
    ];

    render(<PasswordRules rules={passwordRules} className="list-root" />);

    const rules = document.querySelectorAll("ul.list-root > li");

    expect(rules.length).toBe(passwordRules.length);

    rules.forEach((rule, i) => {
      const violation = passwordRules[i];

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
