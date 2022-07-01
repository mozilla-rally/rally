import { render } from "@testing-library/react";

import { Strings } from "../../../../resources/Strings";
import { PrivacyPolicyIntroduction } from "../PrivacyPolicyIntroduction";
import { StandardPrivacyPolicySection } from "../StandardPrivacyPolicySection";

jest.mock("../StandardPrivacyPolicySection");

const strings = Strings.components.pages.privacyPolicy.introduction;

describe("PrivacyPolicyIntroduction tests", () => {
  it("renders correctly", () => {
    render(<PrivacyPolicyIntroduction />);

    expect(StandardPrivacyPolicySection).toHaveBeenCalledWith(strings, {});
  });
});
