import { render } from "@testing-library/react";

import { useStudies } from "../../../../services/StudiesService";
import { Layout } from "../../../Layout";
import { StudiesBackground } from "../StudiesBackground";
import { StudiesPageContent } from "../StudiesPageContent";
import { StudiesTitle } from "../StudiesTitle";
import { StudyList } from "../StudyList";

jest.mock("../../../Layout");
jest.mock("../StudiesBackground");
jest.mock("../StudiesTitle");
jest.mock("../StudyList");
jest.mock("../../../../services/StudiesService");

describe("StudiesPageContent tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    (Layout as jest.Mock).mockImplementation(({ children }) => children);
    (StudiesBackground as jest.Mock).mockImplementation(
      ({ children }) => children
    );
    (StudiesTitle as jest.Mock).mockImplementation(({ children }) => children);
    (StudyList as jest.Mock).mockImplementation(({ children }) => children);
    (useStudies as jest.Mock).mockReturnValue({
      installedStudyIds: [],
      allStudies: [],
    });
  });

  it("renders content correctly", () => {
    render(<StudiesPageContent />);

    expect(Layout).toHaveBeenCalled();
    expect(StudiesBackground).toHaveBeenCalled();
    expect(StudiesTitle).toHaveBeenCalled();
    expect(StudyList).toHaveBeenCalled();
  });
});
