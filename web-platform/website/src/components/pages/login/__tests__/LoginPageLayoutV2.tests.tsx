import { render } from "@testing-library/react";

import { Footer } from "../../../Footer";
import { NavigationBar } from "../../../navigation-bar";
import { LoginPageLayoutV2 } from "../LoginPageLayoutV2";

jest.mock("../../../Footer");
jest.mock("../../../navigation-bar");

describe("LoginPageLayoutV2 tests", () => {
  it("displays zero content", () => {
    render(<LoginPageLayoutV2 />);

    expect(NavigationBar).toHaveBeenCalled();
    expect(Footer).toHaveBeenCalled();
  });

  it("displays left content", () => {
    const root = render(
      <LoginPageLayoutV2>
        <LoginPageLayoutV2.LeftContent>
          <div>Left Content</div>
        </LoginPageLayoutV2.LeftContent>
      </LoginPageLayoutV2>
    );

    expect(root.getByText("Left Content")).toBeInTheDocument();
    expect(NavigationBar).toHaveBeenCalled();
    expect(Footer).toHaveBeenCalled();
  });

  it("displays right content", () => {
    const root = render(
      <LoginPageLayoutV2>
        <LoginPageLayoutV2.RightContent>
          <div>Right Content</div>
        </LoginPageLayoutV2.RightContent>
      </LoginPageLayoutV2>
    );

    expect(root.getByText("Right Content")).toBeInTheDocument();
    expect(NavigationBar).toHaveBeenCalled();
    expect(Footer).toHaveBeenCalled();
  });

  it("displays both left and right content", () => {
    const root = render(
      <LoginPageLayoutV2>
        <LoginPageLayoutV2.LeftContent>
          <div>Left Content</div>
        </LoginPageLayoutV2.LeftContent>
        <LoginPageLayoutV2.RightContent>
          <div>Right Content</div>
        </LoginPageLayoutV2.RightContent>
      </LoginPageLayoutV2>
    );

    expect(root.getByText("Left Content")).toBeInTheDocument();
    expect(root.getByText("Right Content")).toBeInTheDocument();
    expect(NavigationBar).toHaveBeenCalled();
    expect(Footer).toHaveBeenCalled();
  });
});
