import { HTMLAttributes } from "react";

import { FontSize } from "../../../styles/Fonts";
import { PasswordRule } from "./LoginFormValidator";

export interface PasswordRules extends HTMLAttributes<HTMLUListElement> {
  rules: PasswordRule[];
}

export function PasswordRules({
  rules,
  className,
  ...otherProps
}: PasswordRules) {
  if (!rules || !rules.length) {
    return null;
  }

  return (
    <ul
      className={`${FontSize.Small} fw-weight-normal ${className}`}
      {...otherProps}
    >
      {rules.map((rule) => {
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
