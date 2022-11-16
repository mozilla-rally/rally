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

  it("renders all chrome studies", () => {
    (StudyProvider as jest.Mock).mockImplementation(({ children }) => children);

    setUserAgent("Chrome");

    const allStudies = [
      { studyId: "studyId-1", data: "data-1" },
      {
        studyId: "studyId-2",
        data: "data-2",
        downloadLink: { chrome: "some link" },
      },
      { studyId: "studyId-3", data: "data-2" },
      {
        studyId: "studyId-4",
        data: "data-2",
        downloadLink: { chrome: "some link" },
      },
    ];

    (useStudies as jest.Mock).mockReturnValue({
      isLoaded: true,
      allStudies,
    });

    render(<StudyList className="hello-world" />);

    expect(document.querySelector(".hello-world")).toBeInTheDocument();

    allStudies.forEach((s) => {
      if (!s.downloadLink || !s.downloadLink.chrome) {
        return;
      }

      expect(StudyProvider).toHaveBeenCalledWith(
        { study: s, children: expect.anything() },
        {}
      );
    });

    expect(StudyCard).toHaveBeenCalledTimes(2);
  });

  it("renders all firefox studies", () => {
    (StudyProvider as jest.Mock).mockImplementation(({ children }) => children);

    setUserAgent("Firefox");

    const allStudies = [
      { studyId: "studyId-1", data: "data-1" },
      {
        studyId: "studyId-2",
        data: "data-2",
        downloadLink: { firefox: "some link" },
      },
      { studyId: "studyId-3", data: "data-2" },
      {
        studyId: "studyId-4",
        data: "data-2",
        downloadLink: { firefox: "some link" },
      },
    ];

    (useStudies as jest.Mock).mockReturnValue({
      isLoaded: true,
      allStudies,
    });

    render(<StudyList className="hello-world" />);

    expect(document.querySelector(".hello-world")).toBeInTheDocument();

    allStudies.forEach((s) => {
      if (!s.downloadLink || !s.downloadLink.firefox) {
        return;
      }

      expect(StudyProvider).toHaveBeenCalledWith(
        { study: s, children: expect.anything() },
        {}
      );
    });

    expect(StudyCard).toHaveBeenCalledTimes(2);
  });

  it("filters paused and expired studies", () => {
    (StudyProvider as jest.Mock).mockImplementation(({ children }) => children);

    setUserAgent("Chrome");

    const allStudies = [
      {
        studyId: "studyId-1",
        data: "data-1",
        downloadLink: { chrome: "some link" },
      },
      {
        studyId: "studyId-2",
        data: "data-2",
        downloadLink: { chrome: "some link" },
        studyEnded: true,
      },
      {
        studyId: "studyId-3",
        data: "data-2",
        downloadLink: { chrome: "some link" },
        studyPaused: true,
      },
      {
        studyId: "studyId-4",
        data: "data-2",
        downloadLink: { firefox: "some link" },
      },
    ];

    (useStudies as jest.Mock).mockReturnValue({
      isLoaded: true,
      allStudies,
    });

    render(<StudyList className="hello-world" />);

    expect(document.querySelector(".hello-world")).toBeInTheDocument();

    expect(StudyProvider).toHaveBeenCalledWith(
      { study: allStudies[0], children: expect.anything() },
      {}
    );

    expect(StudyCard).toHaveBeenCalledTimes(1);
  });

  let userAgentStr = "";
  function setUserAgent(userAgent: string) {
    if (userAgent !== userAgentStr) {
      userAgentStr = userAgent;

      const userAgentProp = {
        get: function () {
          return userAgentStr;
        },
      };

      try {
        Object.defineProperty(window.navigator, "userAgent", userAgentProp);
      } catch (e) {
        window.navigator = Object.create(navigator, {
          userAgent: userAgentProp,
        });
      }
    }
  }
});
