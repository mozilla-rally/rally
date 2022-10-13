import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { logEvent } from "firebase/analytics";
import { Timestamp } from "firebase/firestore";

import { Strings } from "../../../../../resources/Strings";
import { useFirebase } from "../../../../../services/FirebaseService";
import { useUserDocument } from "../../../../../services/UserDocumentService";
import { useStudy } from "../StudyDataContext";
import { StudyTitle } from "../StudyTitle";
import { StudyTopDetails } from "../StudyTopDetails";

jest.mock("firebase/analytics");
jest.mock("../../../../../services/FirebaseService");
jest.mock("../../../../../services/UserDocumentService");
jest.mock("../StudyDataContext");
jest.mock("../StudyTitle");

const strings = Strings.components.pages.studies.studyCard.topDetails;

describe("StudyTopDetails tests", () => {
  const updateUserDocument = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    (useFirebase as jest.Mock).mockReturnValue({ analytics: "analytics" });
  });

  it("user not enrolled, study not enrolled", () => {
    (useUserDocument as jest.Mock).mockReturnValue({
      userDocument: {
        enrolled: false,
        updateUserDocument,
      },
    });

    (useStudy as jest.Mock).mockReturnValue({
      isUserEnrolled: false,
      study: {
        name: "Study-1",
        studyId: "study-1",
        authors: {
          name: "Test author",
        },
        endDate: "Ongoing",
      },
    });

    render(<StudyTopDetails />);

    expect(StudyTitle).toHaveBeenCalled();

    expect(document.querySelector(".join-button")).not.toBeInTheDocument();
  });

  it("study not enrolled, no icon available, date ongoing", () => {
    (useUserDocument as jest.Mock).mockReturnValue({
      userDocument: {
        enrolled: true,
        updateUserDocument,
      },
    });

    (useStudy as jest.Mock).mockReturnValue({
      isUserEnrolled: false,
      study: {
        name: "Study-1",
        studyId: "study-1",
        authors: {
          name: "Test author",
        },
        endDate: "Ongoing",
      },
    });

    render(<StudyTopDetails />);

    expect(StudyTitle).toHaveBeenCalled();

    const joinButton = document.querySelector(".join-button");

    expect(joinButton).toBeInTheDocument();

    expect(joinButton?.innerHTML).toBe(strings.reactivateStudy);
  });

  it("study not enrolled, custom icon, expiry date", () => {
    (useUserDocument as jest.Mock).mockReturnValue({
      userDocument: {
        enrolled: true,
        updateUserDocument,
      },
    });

    (useStudy as jest.Mock).mockReturnValue({
      isUserEnrolled: false,
      study: {
        name: "Study-1",
        studyId: "study-1",
        authors: {
          name: "Test author",
        },
        icons: {
          64: "img/custom-icon.png",
        },
        endDate: "2020-01-06",
      },
    });

    render(<StudyTopDetails />);

    expect(StudyTitle).toHaveBeenCalled();

    const joinButton = document.querySelector(".join-button");

    expect(joinButton).toBeInTheDocument();

    expect(joinButton?.innerHTML).toBe(strings.reactivateStudy);
  });

  it("user enrolled in study", () => {
    (useUserDocument as jest.Mock).mockReturnValue({
      userDocument: {
        enrolled: true,
      },
      updateUserDocument,
    });

    (useStudy as jest.Mock).mockReturnValue({
      isUserEnrolled: true,
      study: {
        name: "Study-1",
        studyId: "study-1",
        authors: {
          name: "Test author",
        },
        icons: {
          64: "img/custom-icon.png",
        },
        endDate: "2020-01-06",
      },
    });

    render(<StudyTopDetails />);

    expect(StudyTitle).toHaveBeenCalled();

    expect(document.querySelector(".join-button")).not.toBeInTheDocument();
  });

  it("clicking the reactivate button triggers the study enrollment toggle", async () => {
    const study = {
      studyId: "study-1",
      version: "1.0",
    };

    (useUserDocument as jest.Mock).mockReturnValue({
      userDocument: {
        enrolled: true,
      },
      updateUserDocument,
    });

    (useStudy as jest.Mock).mockReturnValue({
      isUserEnrolled: false,
      study,
    });

    (useFirebase as jest.Mock).mockReturnValue({ analytics: "analytics" });

    userEvent.setup();

    const root = render(<StudyTopDetails />);

    await act(async () => {
      await userEvent.click(root.getByText(strings.reactivateStudy));
    });

    expect(updateUserDocument).toHaveBeenCalledWith({
      studies: {
        [study.studyId]: {
          studyId: study.studyId,
          version: study.version,
          enrolled: true,
          joinedOn: Timestamp.now(),
        },
      },
    });

    expect(logEvent).toHaveBeenCalledWith("analytics", "select_content", {
      content_type: `reactivate_study`,
    });
  });
});
