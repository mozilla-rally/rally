import { fireEvent, render } from "@testing-library/react";

import { LoginButton } from "../LoginButton";

describe("LoginButton tests", () => {
  it("zero state", () => {
    const root = render(<LoginButton>Hello World</LoginButton>);

    expect(root.getByText("Hello World")).toBeInTheDocument();
    expect(document.querySelector("img")).not.toBeInTheDocument();
  });

  it("custom class and icon", () => {
    const root = render(
      <LoginButton className="test-button" icon="img/test-image.svg">
        Hello World
      </LoginButton>
    );

    expect(root.getByText("Hello World")).toBeInTheDocument();
    expect(document.querySelector(".test-button")).toBeInTheDocument();
    expect(
      document.querySelector("img[src='img/test-image.svg']")
    ).toBeInTheDocument();
  });

  it("attaches all button props", () => {
    let buttonClicked = false;

    render(
      <LoginButton
        onClick={() => {
          buttonClicked = true;
        }}
      >
        Hello World
      </LoginButton>
    );

    const button = document.querySelector("button") as HTMLButtonElement;

    expect(button).toBeInTheDocument();

    fireEvent(
      button,
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      })
    );

    expect(buttonClicked).toBeTruthy();
  });
});
