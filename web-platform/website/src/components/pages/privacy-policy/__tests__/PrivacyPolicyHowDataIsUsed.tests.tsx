import { render } from "@testing-library/react";

import { Strings } from "../../../../resources/Strings";
import { PrivacyPolicyHowDataIsUsed } from "../PrivacyPolicyHowDataIsUsed";
import { StandardPrivacyPolicySection } from "../StandardPrivacyPolicySection";

jest.mock("../StandardPrivacyPolicySection");

const strings = Strings.components.pages.privacyPolicy.howDataIsUsed;

describe("PrivacyPolicyHowDataIsUsed tests", () => {
  it("renders correctly", () => {
    render(<PrivacyPolicyHowDataIsUsed />);

    expect(StandardPrivacyPolicySection).toHaveBeenCalledWith(strings, {});
  });
});
