import { RenderResult, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Timestamp } from "firebase/firestore";
import { isValidElement } from "react";
import { act } from "react-dom/test-utils";

import { Strings } from "../../../../../resources/Strings";
import { useUserDocument } from "../../../../../services/UserDocumentService";
import { detectBrowser } from "../../../../../utils/BrowserDetector";
import { BrowserType } from "../../../../../utils/BrowserType";
import { AddStudyView } from "../AddStudyView";
import { useStudy } from "../StudyDataContext";
import { StudyTitle } from "../StudyTitle";

jest.mock("../../../../../services/UserDocumentService");
jest.mock("../../../../../utils/BrowserDetector");
jest.mock("../StudyDataContext");
jest.mock("../StudyTitle");

const strings = Strings.components.pages.studies.studyCard.addStudy;

describe("AddStudyView tests", () => {
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

    (useUserDocument as jest.Mock).mockReturnValue({ updateUserDocument });
    (detectBrowser as jest.Mock).mockReturnValue(BrowserType.Chrome);
  });

  it("does not display modal when no enrollment is in progress", () => {
    setupStudy(false, false);

    const root = renderView();
    assertModalNotVisible(root);
  });

  it("does not display model when user is enrolled", () => {
    setupStudy(true, true);

    const root = renderView();
    assertModalNotVisible(root);
  });

  it("displays modal when user is not enrolled and enrollment is in progress", () => {
    setupStudy(false, true);

    const root = renderView();

    assertModalVisible(root);
  });

  it("dismisses enrollment upon background click", async () => {
    setupStudy(false, true);

    userEvent.setup();

    const root = renderView();

    assertModalVisible(root);

    jest.resetAllMocks();

    await act(async () => {
      await userEvent.click(document.querySelector(".modal.fade") as Element);
    });

    expect(endStudyEnrollmentToggle).toHaveBeenCalled();
  });

  it("successfully enrolls the chrome user into the study", async () => {
    setupStudy(false, true);

    userEvent.setup();

    await verifyJoinForBrowser(BrowserType.Chrome);
  });

  it("successfully enrolls the firefox user into the study", async () => {
    setupStudy(false, true);

    userEvent.setup();

    await verifyJoinForBrowser(BrowserType.FireFox);
  });

  it("cancel dismisses the enrollment", async () => {
    setupStudy(false, true);

    userEvent.setup();

    const root = renderView();

    await act(async () => {
      await userEvent.click(root.getByText(strings.cancel) as Element);
    });

    expect(endStudyEnrollmentToggle).toHaveBeenCalled();
  });

  function setupStudy(
    isUserEnrolled: boolean,
    isStudyEnrollmentInProgress: boolean
  ) {
    (useStudy as jest.Mock).mockReturnValue({
      endStudyEnrollmentToggle,
      isStudyEnrollmentInProgress,
      isUserEnrolled,
      study,
    });
  }

  function renderView() {
    const root = render(<AddStudyView />);

    expect(useStudy).toHaveBeenCalled();
    expect(useUserDocument).toHaveBeenCalled();
    expect(detectBrowser).toHaveBeenCalled();

    return root;
  }

  function assertModalNotVisible(root: RenderResult) {
    expect(root.container.firstChild).toBeNull();

    expect(StudyTitle).not.toHaveBeenCalled();
    expect(endStudyEnrollmentToggle).not.toHaveBeenCalled();
  }

  function assertModalVisible(root: RenderResult) {
    expect(StudyTitle).toHaveBeenCalled();
    expect(isValidElement(strings.enrollText)).toBeTruthy();
    expect(root.getByText(strings.addExtension)).toBeInTheDocument();
    expect(root.getByText(strings.cancel)).toBeInTheDocument();
  }

  async function verifyJoinForBrowser(browser: BrowserType) {
    (detectBrowser as jest.Mock).mockReset().mockReturnValue(browser);

    const root = renderView();

    const windowOpen = jest.fn();
    jest.spyOn(window, "open").mockImplementation(windowOpen);

    const addStudyButton = root.getByText(
      strings.addExtension
    ) as HTMLButtonElement;

    expect(addStudyButton).toBeInTheDocument();

    (detectBrowser as jest.Mock).mockReturnValue(browser);

    await act(async () => {
      await userEvent.click(addStudyButton);
    });

    expect(updateUserDocument).toHaveBeenCalledWith({
      studies: {
        [study.studyId]: {
          studyId: study.studyId,
          enrolled: true,
          joinedOn: Timestamp.now(),
        },
      },
    });

    expect(endStudyEnrollmentToggle).toHaveBeenCalled();

    expect(windowOpen).toHaveBeenCalledWith(
      browser === BrowserType.Chrome
        ? study.downloadLink.chrome
        : study.downloadLink.firefox,
      "_blank"
    );
  }
});
