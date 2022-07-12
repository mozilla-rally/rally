import { render } from "@testing-library/react";

import { useStudies } from "../../../../services/StudiesService";
import { StudyList } from "../StudyList";
import { StudyCard } from "../study-card/StudyCard";
import { StudyProvider } from "../study-card/StudyDataContext";

jest.mock("../../../../services/StudiesService");
jest.mock("../study-card/StudyCard");
jest.mock("../study-card/StudyDataContext");

describe("StudyList tests", () => {
  it("renders null when study is not loaded yet", () => {
    (useStudies as jest.Mock).mockReturnValue({
      isLoaded: false,
      allStudies: undefined,
    });

    const root = render(<StudyList />);

    expect(root.container.firstChild).toBeNull();

    expect(StudyProvider).not.toBeCalled();
    expect(StudyCard).not.toBeCalled();
  });

  it("renders empty container when there are no studies", () => {
    (useStudies as jest.Mock).mockReturnValue({
      isLoaded: true,
      allStudies: [],
    });

    render(<StudyList className="hello-world" />);

    expect(document.querySelector(".hello-world")).toBeInTheDocument();

    expect(StudyProvider).not.toBeCalled();
    expect(StudyCard).not.toBeCalled();
  });

  it("renders all studies", () => {
    (StudyProvider as jest.Mock).mockImplementation(({ children }) => children);

    const allStudies = [
      { studyId: "studyId-1", data: "data-1" },
      { studyId: "studyId-2", data: "data-2" },
    ];

    (useStudies as jest.Mock).mockReturnValue({
      isLoaded: true,
      allStudies,
    });

    render(<StudyList className="hello-world" />);

    expect(document.querySelector(".hello-world")).toBeInTheDocument();

    allStudies.forEach((s) => {
      expect(StudyProvider).toHaveBeenCalledWith(
        { study: s, children: expect.anything() },
        {}
      );
    });

    expect(StudyCard).toHaveBeenCalledTimes(allStudies.length);
  });
});
