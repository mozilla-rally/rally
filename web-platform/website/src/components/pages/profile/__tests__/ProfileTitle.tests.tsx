import { render } from "@testing-library/react";

import { Strings } from "../../../../resources/Strings";
import { ProfileTitle } from "../ProfileTitle";

const strings = Strings.components.pages.profile.title;

describe("ProfileTitle tests", () => {
  it("renders correctly", () => {
    const root = render(<ProfileTitle />);

    expect(root.getByText(strings.title)).toBeInTheDocument();
    expect(root.getByText(strings.tagline)).toBeInTheDocument();
  });
});
