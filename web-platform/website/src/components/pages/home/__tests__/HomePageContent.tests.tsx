import { render } from "@testing-library/react";

import { useAuthentication } from "../../../../services/AuthenticationService";
import { useStudies } from "../../../../services/StudiesService";
import { Layout } from "../../../Layout";
import { HomePageBackground } from "../HomePageBackground";
import { HomePageContent } from "../HomePageContent";
import { HomePageTitle } from "../HomePageTitle";
import { StudyList } from "../StudyList";

jest.mock("../../../Layout");
jest.mock("../HomePageBackground");
jest.mock("../HomePageTitle");
jest.mock("../StudyList");
jest.mock("../../../../services/StudiesService");
jest.mock("../../../../services/AuthenticationService");

describe("HomePageContent tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    (Layout as jest.Mock).mockImplementation(({ children }) => children);
    (HomePageBackground as jest.Mock).mockImplementation(
      ({ children }) => children
    );
    (HomePageTitle as jest.Mock).mockImplementation(({ children }) => children);
    (StudyList as jest.Mock).mockImplementation(({ children }) => children);
    (useStudies as jest.Mock).mockReturnValue({
      installedStudyIds: [],
      allStudies: [],
    });
    (useAuthentication as jest.Mock).mockReturnValue({
      reloadUser: jest.fn(),
    });
  });

  it("renders content correctly", () => {
    render(<HomePageContent />);

    expect(Layout).toHaveBeenCalled();
    expect(HomePageBackground).toHaveBeenCalled();
    expect(HomePageTitle).toHaveBeenCalled();
    expect(StudyList).toHaveBeenCalled();
  });
});
