import { render } from "@testing-library/react";

import { Strings } from "../../../../resources/Strings";
import { PrivacyPolicyYourContributions } from "../PrivacyPolicyYourContributions";
import { StandardPrivacyPolicySection } from "../StandardPrivacyPolicySection";

jest.mock("../StandardPrivacyPolicySection");

const strings = Strings.components.pages.privacyPolicy.yourContributions;

describe("PrivacyPolicyYourContributions tests", () => {
  it("renders correctly", () => {
    render(<PrivacyPolicyYourContributions />);

    expect(StandardPrivacyPolicySection).toHaveBeenCalledWith(strings, {});
  });
});
