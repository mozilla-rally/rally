import { RenderResult, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { isValidElement } from "react";
import { act } from "react-dom/test-utils";

import { Strings } from "../../../../../resources/Strings";
import { useUserDocument } from "../../../../../services/UserDocumentService";
import { LeaveStudyView } from "../LeaveStudyView";
import { useStudy } from "../StudyDataContext";

jest.mock("../../../../../services/UserDocumentService");
jest.mock("../StudyDataContext");

const strings = Strings.components.pages.studies.studyCard.leaveStudy;

describe("LeaveStudyView tests", () => {
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
  });

  it("does not display modal when no enrollment is in progress", () => {
    setupStudy(true, false, true);

    const root = renderView();
    assertModalNotVisible(root);
  });

  it("does not display model when user is not enrolled", () => {
    setupStudy(false, true, true);

    const root = renderView();
    assertModalNotVisible(root);
  });

  it("does not display model when extension is not installed", () => {
    setupStudy(true, true, false);

    const root = renderView();
    assertModalNotVisible(root);
  });

  it("displays modal when user is enrolled, extension is installed and enrollment is in progress", () => {
    setupStudy(true, true, true);

    const root = renderView();

    assertModalVisible(root);
  });

  it("dismisses enrollment upon background click", async () => {
    setupStudy(true, true, true);

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
    setupStudy(true, true, true);

    userEvent.setup();

    await verifyLeave();
  });

  it("cancel dismisses the enrollment", async () => {
    setupStudy(true, true, true);

    userEvent.setup();

    const root = renderView();

    await act(async () => {
      await userEvent.click(root.getByText(strings.cancel) as Element);
    });

    expect(endStudyEnrollmentToggle).toHaveBeenCalled();
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
    const root = render(<LeaveStudyView />);

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
    expect(isValidElement(strings.text)).toBeTruthy();
    expect(root.getByText(strings.leaveStudy)).toBeInTheDocument();
    expect(root.getByText(strings.cancel)).toBeInTheDocument();
  }

  async function verifyLeave() {
    const root = renderView();

    const leaveStudyButton = root.getByText(
      strings.leaveStudy
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
  }
});
