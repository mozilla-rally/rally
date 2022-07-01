import { render } from "@testing-library/react";

import { Strings } from "../../../../resources/Strings";
import { PrivacyPolicyManageData } from "../PrivacyPolicyManageData";
import { StandardPrivacyPolicySection } from "../StandardPrivacyPolicySection";

jest.mock("../StandardPrivacyPolicySection");

const strings = Strings.components.pages.privacyPolicy.manageData;

describe("PrivacyPolicyManageData tests", () => {
  it("renders correctly", () => {
    render(<PrivacyPolicyManageData />);

    expect(StandardPrivacyPolicySection).toHaveBeenCalledWith(strings, {});
  });
});
