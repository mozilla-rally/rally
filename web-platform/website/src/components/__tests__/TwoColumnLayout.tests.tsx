import { render } from "@testing-library/react";

import { Footer } from "../Footer";
import { TwoColumnLayout } from "../TwoColumnLayout";
import { NavigationBar } from "../navigation-bar";

jest.mock("../Footer");
jest.mock("../navigation-bar");

describe("TwoColumnLayout tests", () => {
  it("displays zero content", () => {
    render(<TwoColumnLayout />);

    expect(NavigationBar).toHaveBeenCalled();
    expect(Footer).toHaveBeenCalled();
  });

  it("displays left content", () => {
    const root = render(
      <TwoColumnLayout>
        <TwoColumnLayout.LeftContent>
          <div>Left Content</div>
        </TwoColumnLayout.LeftContent>
      </TwoColumnLayout>
    );

    expect(root.getByText("Left Content")).toBeInTheDocument();
    expect(NavigationBar).toHaveBeenCalled();
    expect(Footer).toHaveBeenCalled();
  });

  it("displays right content", () => {
    const root = render(
      <TwoColumnLayout>
        <TwoColumnLayout.RightContent>
          <div>Right Content</div>
        </TwoColumnLayout.RightContent>
      </TwoColumnLayout>
    );

    expect(root.getByText("Right Content")).toBeInTheDocument();
    expect(NavigationBar).toHaveBeenCalled();
    expect(Footer).toHaveBeenCalled();
  });

  it("displays both left and right content", () => {
    const root = render(
      <TwoColumnLayout>
        <TwoColumnLayout.LeftContent>
          <div>Left Content</div>
        </TwoColumnLayout.LeftContent>
        <TwoColumnLayout.RightContent>
          <div>Right Content</div>
        </TwoColumnLayout.RightContent>
      </TwoColumnLayout>
    );

    expect(root.getByText("Left Content")).toBeInTheDocument();
    expect(root.getByText("Right Content")).toBeInTheDocument();
    expect(NavigationBar).toHaveBeenCalled();
    expect(Footer).toHaveBeenCalled();
  });
});
