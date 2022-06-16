import { render } from "@testing-library/react";

import { Highlighter } from "../Highlighter";

describe("Highlighter tests", () => {
  it("Renders correctly", () => {
    const root = render(
      <Highlighter>
        <h1>Hello World</h1>
      </Highlighter>
    );

    const child = root.getByText("Hello World");

    expect(child).toBeDefined();
    expect(child.nodeName).toBe("H1");

    expect(document.getElementsByClassName("highlight").length).toBe(1);
  });
});
