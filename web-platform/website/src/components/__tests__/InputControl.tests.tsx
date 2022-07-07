import { render } from "@testing-library/react";

import { InputControl } from "../InputControl";

describe("InputControl tests", () => {
  it("zero state", () => {
    const title = "Some title";

    const root = render(<InputControl title={title} />);

    const input: HTMLInputElement = document.querySelector(
      "input"
    ) as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("");

    const id = `${title}_undefined`.replace(" ", "_");
    expect(input.getAttribute("id")).toBe(id);
    expect(input.getAttribute("role")).toBe("button");

    const titleElement: HTMLElement = root.getByText(title);
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.getAttribute("for")).toBe(id);
    expect(titleElement.getAttribute("role")).toBe("button");
  });

  it("applies input props correctly", () => {
    const title = "Some title";

    render(
      <InputControl
        title={title}
        type="checkbox"
        checked={true}
        onChange={() => {}} // eslint-disable-line  @typescript-eslint/no-empty-function
      />
    );

    const input: HTMLInputElement = document.querySelector(
      "input"
    ) as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.type).toBe("checkbox");
    expect(input.checked).toBe(true);
  });
});
