import { render } from "@testing-library/react";

import { Strings } from "../../../../resources/Strings";
import { PrivacyPolicyDataCollectionTypes } from "../PrivacyPolicyDataCollectionTypes";
import { StandardPrivacyPolicySection } from "../StandardPrivacyPolicySection";

jest.mock("../StandardPrivacyPolicySection");

const strings = Strings.components.pages.privacyPolicy.dataCollectionTypes;

describe("PrivacyPolicyDataCollectionTypes tests", () => {
  it("renders correctly", () => {
    render(<PrivacyPolicyDataCollectionTypes />);

    expect(StandardPrivacyPolicySection).toHaveBeenCalledWith(strings, {});
  });
});
