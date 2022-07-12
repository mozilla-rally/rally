import { render } from "@testing-library/react";

import { Layout } from "../../../Layout";
import { StudiesBackground } from "../StudiesBackground";
import { StudiesPageContent } from "../StudiesPageContent";
import { StudiesTitle } from "../StudiesTitle";
import { StudiesTooltip } from "../StudiesTooltip";
import { StudyList } from "../StudyList";

jest.mock("../../../Layout");
jest.mock("../StudiesBackground");
jest.mock("../StudiesTitle");
jest.mock("../StudiesTooltip");
jest.mock("../StudyList");

describe("StudiesPageContent tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    (Layout as jest.Mock).mockImplementation(({ children }) => children);
    (StudiesBackground as jest.Mock).mockImplementation(
      ({ children }) => children
    );
    (StudiesTitle as jest.Mock).mockImplementation(({ children }) => children);
    (StudiesTooltip as jest.Mock).mockImplementation(
      ({ children }) => children
    );
    (StudyList as jest.Mock).mockImplementation(({ children }) => children);
  });

  it("renders content correctly", () => {
    render(<StudiesPageContent />);

    expect(Layout).toHaveBeenCalled();
    expect(StudiesBackground).toHaveBeenCalled();
    expect(StudiesTitle).toHaveBeenCalled();
    expect(StudiesTooltip).toHaveBeenCalled();
    expect(StudyList).toHaveBeenCalled();
  });
});
