import { InputHTMLAttributes } from "react";

import { Spacing } from "../styles/Spacing";

export interface InputControlProps
  extends InputHTMLAttributes<HTMLInputElement> {
  title: string;
}

export function InputControl({
  value,
  title,
  id,
  ...others
}: InputControlProps) {
  // Generate an id for the input control and associate label
  // with the id using htmlFor attribute so when users click on
  // the label, it focuses on the corresponding input control.

  const idValue = (id || `${title}_${value}`).replace(" ", "_");
  return (
    <div role="button" className="d-flex align-items-center">
      <input
        value={value}
        id={idValue}
        style={{ height: Spacing.xLarge, width: Spacing.xLarge }}
        role="button"
        {...others}
      />
      <label htmlFor={idValue} role="button">
        {title}
      </label>
    </div>
  );
}
