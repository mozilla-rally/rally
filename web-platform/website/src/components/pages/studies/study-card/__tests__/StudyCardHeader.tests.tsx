import { render } from "@testing-library/react";

import { Strings } from "../../../../../resources/Strings";
import { StudyCardHeader } from "../StudyCardHeader";
import { useStudy } from "../StudyDataContext";

jest.mock("../StudyDataContext");

const strings = Strings.components.pages.studies.studyCard.header;

describe("StudyCardHeader tests", () => {
  it("returns null when user hasn't enrolled in the study and has no extension installed", () => {
    (useStudy as jest.Mock).mockReturnValue({
      isInstalledLocally: false,
      isUserEnrolled: false,
      study: { studyId: "studyId-1" },
    });

    const root = render(<StudyCardHeader />);

    expect(root.container.firstChild).toBeNull();
  });

  it("enrolled but not installed", () => {
    (useStudy as jest.Mock).mockReturnValue({
      isInstalledLocally: false,
      isUserEnrolled: true,
      study: { studyId: "studyId-1", downloadLink: "download.com" },
    });

    const root = render(<StudyCardHeader />);

    expect(
      root.findByText((container) => {
        return container.includes(strings.notParticipatingYet);
      })
    ).toBeDefined();

    expect(root.getByText(strings.addExtension)).toBeInTheDocument();

    expect(document.querySelector(`a[href="download.com"]`)?.innerHTML).toBe(
      strings.addExtension
    );

    expect(root.getByText(strings.menus.dontJoinStudy)).toBeInTheDocument();

    expect(root.queryByText(strings.menus.leaveStudy)).not.toBeInTheDocument();
  });

  it("not enrolled but installed", () => {
    (useStudy as jest.Mock).mockReturnValue({
      isInstalledLocally: true,
      isUserEnrolled: false,
      study: { studyId: "studyId-1", downloadLink: "download.com" },
    });

    const root = render(<StudyCardHeader />);

    expect(
      root.findByText((container) => {
        return container.includes(strings.notParticipatingYet);
      })
    ).toBeDefined();

    expect(root.queryByText(strings.addExtension)).not.toBeInTheDocument();

    expect(root.getByText(strings.menus.dontJoinStudy)).toBeInTheDocument();

    expect(root.queryByText(strings.menus.leaveStudy)).not.toBeInTheDocument();
  });

  it("enrolled and installed", () => {
    (useStudy as jest.Mock).mockReturnValue({
      isInstalledLocally: true,
      isUserEnrolled: true,
      study: { studyId: "studyId-1", downloadLink: "download.com" },
    });

    const root = render(<StudyCardHeader />);

    expect(root.getByText(strings.participating)).toBeInTheDocument();

    expect(
      root.queryByText(strings.menus.dontJoinStudy)
    ).not.toBeInTheDocument();

    expect(root.getByText(strings.menus.leaveStudy)).toBeInTheDocument();
  });
});
