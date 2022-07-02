import { render } from "@testing-library/react";

import { PrivacyPolicyButtons } from "../PrivacyPolicyButtons";
import { PrivacyPolicyDataCollectionTypes } from "../PrivacyPolicyDataCollectionTypes";
import { PrivacyPolicyInformationUse } from "../PrivacyPolicyInformationUse";
import { PrivacyPolicyIntroduction } from "../PrivacyPolicyIntroduction";
import { PrivacyPolicyManageData } from "../PrivacyPolicyManageData";
import { PrivacyPolicyPageContent } from "../PrivacyPolicyPageContent";
import { PrivacyPolicySharing } from "../PrivacyPolicySharing";
import { PrivacyPolicyTitle } from "../PrivacyPolicyTitle";

jest.mock("../PrivacyPolicyButtons");
jest.mock("../PrivacyPolicyDataCollectionTypes");
jest.mock("../PrivacyPolicyInformationUse");
jest.mock("../PrivacyPolicyIntroduction");
jest.mock("../PrivacyPolicyManageData");
jest.mock("../PrivacyPolicySharing");
jest.mock("../PrivacyPolicyTitle");

describe("PrivacyPolicyPageContent tests", () => {
  it("renders content correctly", () => {
    render(<PrivacyPolicyPageContent />);
    assertRendersContent();
  });

  function assertRendersContent() {
    const { container } = render(<PrivacyPolicyPageContent />);

    expect(container.firstChild).not.toBeNull();

    expect(PrivacyPolicyButtons).toHaveBeenCalled();
    expect(PrivacyPolicyDataCollectionTypes).toHaveBeenCalled();
    expect(PrivacyPolicyInformationUse).toHaveBeenCalled();
    expect(PrivacyPolicyIntroduction).toHaveBeenCalled();
    expect(PrivacyPolicyManageData).toHaveBeenCalled();
    expect(PrivacyPolicySharing).toHaveBeenCalled();
    expect(PrivacyPolicyTitle).toHaveBeenCalled();
  }
});
