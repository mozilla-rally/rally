import { render } from "@testing-library/react";

import { LoginCardFactory } from "../LoginCardFactory";
import {
  LoginState,
  LoginStateProvider,
  useLoginDataContext,
} from "../LoginDataContext";
import { LoginPageContent } from "../LoginPageContent";

jest.mock("../LoginCardFactory");
jest.mock("../LoginDataContext");

describe("LoginPageContent tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (LoginStateProvider as jest.Mock).mockImplementation(
      (props) => props.children
    );
    (useLoginDataContext as jest.Mock).mockImplementation(() => ({
      loginState: LoginState.Initial,
    }));
  });

  it("renders state correctly", () => {
    render(<LoginPageContent />);

    expect(useLoginDataContext).toHaveBeenCalled();
    expect(LoginCardFactory).toHaveBeenCalled();
  });
});
