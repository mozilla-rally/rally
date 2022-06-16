import { RenderResult, render } from "@testing-library/react";

import { Strings } from "../../../../resources/Strings";
import { Highlighter } from "../../../Highlighter";
import { InitialLoginView } from "../InitialLoginView";

jest.mock("../../../Highlighter");

const strings = Strings.components.pages.login.initialLoginView;

describe("InitialLoginView tests", () => {
  beforeEach(() => {
    (Highlighter as jest.Mock).mockImplementation((props) => (
      <>{props.children}</>
    ));
  });

  it("renders all components correctly", () => {
    const root = render(<InitialLoginView />);

    assertTitlePresent(root);
    assertSignupWithGooglePresent(root);
    assertSignupWithEmailPresent(root);
  });

  function assertTitlePresent(root: RenderResult) {
    expect(Highlighter).toHaveBeenCalled();
    expect(root.getByText(strings.title)).toBeInTheDocument();
  }

  function assertSignupWithGooglePresent(root: any) {
    expect(root.getByText(strings.signInWithGoogle)).toBeInTheDocument();
    expect(
      document.querySelector(`img[src="/img/icon-logo-google.svg"]`)
    ).toBeInTheDocument();
  }

  function assertSignupWithEmailPresent(root: any) {
    expect(root.getByText(strings.signInWithEmail)).toBeInTheDocument();
    expect(
      document.querySelector(`img[src="/img/icon-email.svg"]`)
    ).toBeInTheDocument();
  }
});
