import { render } from "@testing-library/react";

import { useUserDocument } from "../../../../services/UserDocumentService";
import { ProfileAge } from "../ProfileAge";
import { ProfileButtons } from "../ProfileButtons";
import { ProfileDataProvider } from "../ProfileDataContext";
import { ProfileEthnicity } from "../ProfileEthnicity";
import { ProfileGender } from "../ProfileGender";
import { ProfileHispanicBackground } from "../ProfileHispanicBackground";
import { ProfileIncome } from "../ProfileIncome";
import { ProfilePageContent } from "../ProfilePageContent";
import { ProfileSchool } from "../ProfileSchool";
import { ProfileTitle } from "../ProfileTitle";
import { ProfileZipCode } from "../ProfileZipCode";

jest.mock("../../../../services/UserDocumentService");
jest.mock("../ProfileAge");
jest.mock("../ProfileButtons");
jest.mock("../ProfileDataContext");
jest.mock("../ProfileEthnicity");
jest.mock("../ProfileGender");
jest.mock("../ProfileHispanicBackground");
jest.mock("../ProfileIncome");
jest.mock("../ProfileSchool");
jest.mock("../ProfileTitle");
jest.mock("../ProfileZipCode");

describe("ProfilePageContent tests", () => {
  it("renders null when user document has not loaded yet", () => {
    (useUserDocument as jest.Mock).mockReturnValue({
      isDocumentLoaded: false,
      userDocument: undefined,
    });

    const root = render(<ProfilePageContent />);

    expect(root.container.firstChild).toBeNull();
  });

  it("renders all components within data provider", () => {
    (useUserDocument as jest.Mock).mockReturnValue({
      isDocumentLoaded: true,
      userDocument: { demographicsData: { exactIncome: "10000" } },
    });

    (ProfileDataProvider as jest.Mock).mockImplementation(
      ({ children }) => children
    );

    render(<ProfilePageContent />);

    expect(ProfileDataProvider).toHaveBeenCalledWith(
      {
        initialProfileData: { exactIncome: "10000" },
        children: expect.anything(),
      },
      {}
    );

    expect(ProfileTitle).toHaveBeenCalled();
    expect(ProfileAge).toHaveBeenCalled();
    expect(ProfileGender).toHaveBeenCalled();
    expect(ProfileHispanicBackground).toHaveBeenCalled();
    expect(ProfileEthnicity).toHaveBeenCalled();
    expect(ProfileSchool).toHaveBeenCalled();
    expect(ProfileIncome).toHaveBeenCalled();
    expect(ProfileZipCode).toHaveBeenCalled();
    expect(ProfileButtons).toHaveBeenCalled();
  });
});
