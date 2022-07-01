import { render } from "@testing-library/react";

import { Strings } from "../../../../resources/Strings";
import { PrivacyPolicySharing } from "../PrivacyPolicySharing";
import { StandardPrivacyPolicySection } from "../StandardPrivacyPolicySection";

jest.mock("../StandardPrivacyPolicySection");

const strings = Strings.components.pages.privacyPolicy.sharing;

describe("PrivacyPolicySharing tests", () => {
  it("renders correctly", () => {
    render(<PrivacyPolicySharing />);

    expect(StandardPrivacyPolicySection).toHaveBeenCalledWith(strings, {});
  });
});
