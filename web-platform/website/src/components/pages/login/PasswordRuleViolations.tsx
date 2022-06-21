import { HTMLAttributes } from "react";
import { style } from "typestyle";

import { FontSize } from "../../../styles/Fonts";
import { LoginFormValidationResult } from "./LoginFormValidator";

export interface PasswordRuleViolationsProps
  extends HTMLAttributes<HTMLUListElement> {
  validationResult?: LoginFormValidationResult;
}

export function PasswordRuleViolations({
  validationResult,
  className,
  ...otherProps
}: PasswordRuleViolationsProps) {
  // Only display validation rule iff there is a violation and password is valid
  // If password is invalid (empty) we display another error message
  if (
    !validationResult ||
    validationResult.valid ||
    (validationResult.password && validationResult.password.error)
  ) {
    return null;
  }

  if (!validationResult.passwordRules.find((rule) => !rule.valid)) {
    return null;
  }

  return (
    <ul className={`${styles.container} ${className}`} {...otherProps}>
      {validationResult.passwordRules.map((rule) => {
        return (
          <li key={rule.title}>
            {rule.valid ? (
              <del className="text-muted">{rule.title}</del>
            ) : (
              rule.title
            )}
          </li>
        );
      })}
    </ul>
  );
}

const styles = {
  container: style({
    fontSize: FontSize.Small,
    fontWeight: 400,
  }),
};
