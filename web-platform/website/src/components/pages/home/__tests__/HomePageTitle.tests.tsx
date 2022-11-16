import { render } from "@testing-library/react";

import { Strings } from "../../../../resources/Strings";
import { HomePageTitle } from "../HomePageTitle";

const strings = Strings.components.pages.home.title;

describe("HomePageTitle tests", () => {
  it("renders correctly", () => {
    const root = render(<HomePageTitle />);

    expect(root.getByText(strings.title)).toBeInTheDocument();
  });

  it("applies html properties to container", () => {
    const doc = render(
      <HomePageTitle className="hello-world">Hello World</HomePageTitle>
    );

    expect(document.querySelector(".hello-world")).toBeInTheDocument();
    expect(doc.queryByText("Hello World")).not.toBeInTheDocument();
  });
});
