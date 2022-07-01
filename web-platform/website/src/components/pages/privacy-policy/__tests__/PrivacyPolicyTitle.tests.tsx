import { render } from "@testing-library/react";

import { Strings } from "../../../../resources/Strings";
import { PrivacyPolicyTitle } from "../PrivacyPolicyTitle";

const strings = Strings.components.pages.privacyPolicy.title;

describe("PrivacyPolicyTitle tests", () => {
  it("Renders title and tagline", () => {
    const root = render(<PrivacyPolicyTitle />);

    expect(root.getByText(strings.title)).toBeInTheDocument();
    expect(root.getByText(strings.tagline)).toBeInTheDocument();
  });
});
