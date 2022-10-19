import { render } from "@testing-library/react";

import { PrivacyPolicyButtons } from "../PrivacyPolicyButtons";
import { PrivacyPolicyDataCollectionTypes } from "../PrivacyPolicyDataCollectionTypes";
import { PrivacyPolicyHowDataIsUsed } from "../PrivacyPolicyHowDataIsUsed";
import { PrivacyPolicyInformationUse } from "../PrivacyPolicyInformationUse";
import { PrivacyPolicyIntroduction } from "../PrivacyPolicyIntroduction";
import { PrivacyPolicyManageData } from "../PrivacyPolicyManageData";
import { PrivacyPolicyPageContent } from "../PrivacyPolicyPageContent";
import { PrivacyPolicyReadyToRally } from "../PrivacyPolicyReadyToRally";
import { PrivacyPolicySharing } from "../PrivacyPolicySharing";
import { PrivacyPolicyTitle } from "../PrivacyPolicyTitle";
import { PrivacyPolicyYourContributions } from "../PrivacyPolicyYourContributions";

jest.mock("../PrivacyPolicyButtons");
jest.mock("../PrivacyPolicyDataCollectionTypes");
jest.mock("../PrivacyPolicyHowDataIsUsed");
jest.mock("../PrivacyPolicyInformationUse");
jest.mock("../PrivacyPolicyIntroduction");
jest.mock("../PrivacyPolicyManageData");
jest.mock("../PrivacyPolicyReadyToRally");
jest.mock("../PrivacyPolicySharing");
jest.mock("../PrivacyPolicyTitle");
jest.mock("../PrivacyPolicyYourContributions");

describe("PrivacyPolicyPageContent tests", () => {
  it("renders content correctly in read only mode", () => {
    assertRendersContent(true);
  });

  it("renders content correctly non read only mode", () => {
    assertRendersContent(false);
  });

  function assertRendersContent(readOnly: boolean) {
    const { container } = render(
      <PrivacyPolicyPageContent readOnly={readOnly} />
    );

    expect(container.firstChild).not.toBeNull();

    if (readOnly) {
      expect(PrivacyPolicyButtons).not.toHaveBeenCalled();
    } else {
      expect(PrivacyPolicyButtons).toHaveBeenCalled();
    }

    expect(PrivacyPolicyTitle).toHaveBeenCalled();
    expect(PrivacyPolicyIntroduction).toHaveBeenCalled();
    expect(PrivacyPolicyHowDataIsUsed).toHaveBeenCalled();
    expect(PrivacyPolicyYourContributions).toHaveBeenCalled();
    expect(PrivacyPolicyDataCollectionTypes).toHaveBeenCalled();
    expect(PrivacyPolicyInformationUse).toHaveBeenCalled();
    expect(PrivacyPolicySharing).toHaveBeenCalled();
    expect(PrivacyPolicyManageData).toHaveBeenCalled();
    expect(PrivacyPolicyReadyToRally).toHaveBeenCalled();
  }
});
