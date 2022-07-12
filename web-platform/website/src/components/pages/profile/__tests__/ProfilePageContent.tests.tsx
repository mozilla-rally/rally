import { render } from "@testing-library/react";

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
  it("renders all components within data provider", () => {
    (ProfileDataProvider as jest.Mock).mockImplementation(
      ({ children }) => children
    );

    render(<ProfilePageContent />);

    expect(ProfileDataProvider).toHaveBeenCalled();
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
