import { render } from "@testing-library/react";
import { isValidElement } from "react";

import { Strings } from "../../../../resources/Strings";
import { PrimaryButton } from "../../../../styles/Buttons";
import { Highlighter } from "../../../Highlighter";
import { EmailAccountCreatedView } from "../EmailAccountCreatedView";
import { LoginButton } from "../LoginButton";

jest.mock("../../../Highlighter");
jest.mock("../LoginButton");

const strings = Strings.components.pages.login.emailAccountCreatedView;

describe("EmailAccountCreatedView tests", () => {
  beforeEach(() => {
    (Highlighter as jest.Mock).mockImplementation(({ children }) => children);
    (LoginButton as jest.Mock).mockImplementation(({ children }) => children);
  });

  it("renders all the components correctly", () => {
    const root = render(<EmailAccountCreatedView />);

    expect(root.getByText(strings.title)).toBeInTheDocument();
    expect(root.getByText(strings.message)).toBeInTheDocument();

    expect(LoginButton).toHaveBeenCalledWith(
      { className: PrimaryButton, children: strings.backToSignIn },
      {}
    );

    expect(isValidElement(strings.needHelp)).toBeTruthy();
  });
});
