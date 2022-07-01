import { render } from "@testing-library/react";

import { Strings } from "../../../../resources/Strings";
import { PrivacyPolicyInformationUse } from "../PrivacyPolicyInformationUse";
import { StandardPrivacyPolicySection } from "../StandardPrivacyPolicySection";

jest.mock("../StandardPrivacyPolicySection");

const strings = Strings.components.pages.privacyPolicy.informationUse;

describe("PrivacyPolicyInformationUse tests", () => {
  it("renders correctly", () => {
    render(<PrivacyPolicyInformationUse />);

    expect(StandardPrivacyPolicySection).toHaveBeenCalledWith(strings, {});
  });
});
