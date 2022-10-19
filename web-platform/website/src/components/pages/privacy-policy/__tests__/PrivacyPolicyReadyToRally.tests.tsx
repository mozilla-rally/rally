import { render } from "@testing-library/react";

import { Strings } from "../../../../resources/Strings";
import { PrivacyPolicyReadyToRally } from "../PrivacyPolicyReadyToRally";
import { StandardPrivacyPolicySection } from "../StandardPrivacyPolicySection";

jest.mock("../StandardPrivacyPolicySection");

const strings = Strings.components.pages.privacyPolicy.readyToRally;

describe("PrivacyPolicyReadyToRally tests", () => {
  it("renders correctly", () => {
    render(<PrivacyPolicyReadyToRally />);

    expect(StandardPrivacyPolicySection).toHaveBeenCalledWith(strings, {});
  });
});
