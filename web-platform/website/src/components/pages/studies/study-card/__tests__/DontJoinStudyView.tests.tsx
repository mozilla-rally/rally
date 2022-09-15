import { RenderResult, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { logEvent } from "firebase/analytics";
import { act } from "react-dom/test-utils";

import { Strings } from "../../../../../resources/Strings";
import { useFirebase } from "../../../../../services/FirebaseService";
import { useUserDocument } from "../../../../../services/UserDocumentService";
import { detectBrowser } from "../../../../../utils/BrowserDetector";
import { BrowserType } from "../../../../../utils/BrowserType";
import { DontJoinStudyView } from "../DontJoinStudyView";
import { useStudy } from "../StudyDataContext";

jest.mock("../../../../../services/FirebaseService");
jest.mock("../../../../../services/UserDocumentService");
jest.mock("../../../../../utils/BrowserDetector");
jest.mock("../StudyDataContext");

const strings = Strings.components.pages.studies.studyCard.dontJoinStudy;

describe("DontJoinStudyView tests", () => {
  const updateUserDocument = jest.fn();
  const endStudyEnrollmentToggle = jest.fn();
  const study = {
    studyId: "Test Study",
    downloadLink: {
      chrome: "chrome.com",
      firefox: "firefox.com",
    },
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    (useFirebase as jest.Mock).mockReturnValue({ analytics: "analytics" });
    (useUserDocument as jest.Mock).mockReturnValue({ updateUserDocument });
    (detectBrowser as jest.Mock).mockReturnValue(BrowserType.Chrome);
  });

  it("does not display modal when no enrollment is in progress", () => {
    setupStudy(true, false, true);

    const root = renderView();
    assertModalNotVisible(root);
  });

  it("does not display model when user is enrolled", () => {
    setupStudy(true, true, true);

    const root = renderView();
    assertModalNotVisible(root);
  });

  it("does not display model when extension is installed", () => {
    setupStudy(true, true, true);

    const root = renderView();
    assertModalNotVisible(root);
  });

  it("displays modal when user is enrolled, extension is not installed and enrollment is in progress", () => {
    setupStudy(true, true, false);

    const root = renderView();

    assertModalVisible(root);
  });

  it("dismisses enrollment upon background click", async () => {
    setupStudy(true, true, false);

    userEvent.setup();

    const root = renderView();

    assertModalVisible(root);

    jest.resetAllMocks();

    await act(async () => {
      await userEvent.click(document.querySelector(".modal.fade") as Element);
    });

    expect(endStudyEnrollmentToggle).toHaveBeenCalled();
  });

  it("successfully un-enrolls from the study", async () => {
    setupStudy(true, true, false);

    userEvent.setup();

    await verifyLeave();
  });

  it("renders correct chrome extension link", async () => {
    setupStudy(true, true, false);

    (detectBrowser as jest.Mock).mockReturnValue(BrowserType.Chrome);

    userEvent.setup();

    const root = renderView();

    expect(
      document.querySelector(`a[href="${study.downloadLink.chrome}"]`)
    ).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(root.getByText(strings.addStudyExtension));
    });

    expect(endStudyEnrollmentToggle).toHaveBeenCalled();

    expect(logEvent).toHaveBeenCalledWith("analytics", "select_content", {
      content_type: `canceled_leave_study`,
    });
  });

  it("renders correct firefox extension link", async () => {
    setupStudy(true, true, false);

    (detectBrowser as jest.Mock).mockReturnValue(BrowserType.FireFox);

    userEvent.setup();

    const root = renderView();

    expect(
      document.querySelector(`a[href="${study.downloadLink.firefox}"]`)
    ).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(root.getByText(strings.addStudyExtension));
    });

    expect(endStudyEnrollmentToggle).toHaveBeenCalled();

    expect(logEvent).toHaveBeenCalledWith("analytics", "select_content", {
      content_type: `canceled_leave_study`,
    });
  });

  function setupStudy(
    isUserEnrolled: boolean,
    isStudyEnrollmentInProgress: boolean,
    isInstalledLocally: boolean
  ) {
    (useStudy as jest.Mock).mockReturnValue({
      endStudyEnrollmentToggle,
      isInstalledLocally,
      isStudyEnrollmentInProgress,
      isUserEnrolled,
      study,
    });
  }

  function renderView() {
    const root = render(<DontJoinStudyView />);

    expect(useStudy).toHaveBeenCalled();
    expect(useUserDocument).toHaveBeenCalled();

    return root;
  }

  function assertModalNotVisible(root: RenderResult) {
    expect(root.container.firstChild).toBeNull();
    expect(endStudyEnrollmentToggle).not.toHaveBeenCalled();
  }

  function assertModalVisible(root: RenderResult) {
    expect(root.getByText(strings.title)).toBeInTheDocument();
    expect(root.getByText(strings.tagline)).toBeTruthy();
    expect(root.getByText(strings.addStudyExtension)).toBeInTheDocument();
    expect(root.getByText(strings.dontJoinStudy)).toBeInTheDocument();
  }

  async function verifyLeave() {
    const root = renderView();

    const leaveStudyButton = root.getByText(
      strings.dontJoinStudy
    ) as HTMLButtonElement;

    expect(leaveStudyButton).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(leaveStudyButton);
    });

    expect(updateUserDocument).toHaveBeenCalledWith({
      studies: {
        [study.studyId]: {
          studyId: study.studyId,
          enrolled: false,
        },
      },
    });

    expect(endStudyEnrollmentToggle).toHaveBeenCalled();

    expect(logEvent).toHaveBeenCalledWith("analytics", "select_content", {
      content_type: `leave_study`,
    });
  }
});
