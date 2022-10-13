import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { logEvent } from "firebase/analytics";
import { act } from "react-dom/test-utils";

import { Strings } from "../../../../../resources/Strings";
import { useFirebase } from "../../../../../services/FirebaseService";
import { useUserDocument } from "../../../../../services/UserDocumentService";
import { StudyCardHeader } from "../StudyCardHeader";
import { useStudy } from "../StudyDataContext";

jest.mock("firebase/analytics");
jest.mock("../../../../../services/FirebaseService");
jest.mock("../../../../../services/UserDocumentService");
jest.mock("../StudyDataContext");

const strings = Strings.components.pages.studies.studyCard.header;

describe("StudyCardHeader tests", () => {
  const updateUserDocument = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    (useFirebase as jest.Mock).mockReturnValue({ analytics: "analytics" });
    (useUserDocument as jest.Mock).mockReturnValue({
      userDocument: {
        enrolled: true,
      },
      updateUserDocument,
    });
  });

  it("not enrolle, not installed", () => {
    (useStudy as jest.Mock).mockReturnValue({
      isInstalledLocally: false,
      isUserEnrolled: false,
      study: { studyId: "studyId-1" },
    });

    const root = render(<StudyCardHeader />);

    expect(
      root.findByText((container) => {
        return container.includes(strings.notParticipatingYet);
      })
    ).toBeDefined();

    expect(root.queryByText(strings.menus.leaveStudy)).not.toBeInTheDocument();
  });

  it("enrolled but not installed", () => {
    (useStudy as jest.Mock).mockReturnValue({
      isInstalledLocally: false,
      isUserEnrolled: true,
      study: { studyId: "studyId-1" },
    });

    const root = render(<StudyCardHeader />);

    expect(
      root.findByText((container) => {
        return container.includes(strings.notParticipatingYet);
      })
    ).toBeDefined();

    expect(root.queryByText(strings.menus.leaveStudy)).not.toBeInTheDocument();
  });

  it("not enrolled but installed", () => {
    (useStudy as jest.Mock).mockReturnValue({
      isInstalledLocally: true,
      isUserEnrolled: false,
      study: { studyId: "studyId-1", downloadLink: { chrome: "download.com" } },
    });

    const root = render(<StudyCardHeader />);

    expect(
      root.findByText((container) => {
        return container.includes(strings.notParticipatingYet);
      })
    ).toBeDefined();

    expect(root.queryByText(strings.menus.leaveStudy)).not.toBeInTheDocument();
  });

  it("enrolled and installed", () => {
    (useStudy as jest.Mock).mockReturnValue({
      isInstalledLocally: true,
      isUserEnrolled: true,
      study: { studyId: "studyId-1" },
    });

    const root = render(<StudyCardHeader />);

    expect(root.getByText(strings.participating)).toBeInTheDocument();

    expect(root.getByText(strings.menus.leaveStudy)).toBeInTheDocument();
  });

  it("leave study triggers the study unenrollment", async () => {
    const study = {
      studyId: "study-1",
    };

    (useStudy as jest.Mock).mockReturnValue({
      isInstalledLocally: true,
      isUserEnrolled: true,
      study,
    });

    userEvent.setup();
    const root = render(<StudyCardHeader />);

    await act(async () => {
      await userEvent.click(root.getByText(strings.menus.leaveStudy));
    });

    expect(updateUserDocument).toHaveBeenCalledWith({
      studies: {
        [study.studyId]: {
          studyId: study.studyId,
          enrolled: false,
        },
      },
    });

    expect(logEvent).toHaveBeenCalledWith("analytics", "select_content", {
      content_type: `leave_study`,
    });
  });
});
