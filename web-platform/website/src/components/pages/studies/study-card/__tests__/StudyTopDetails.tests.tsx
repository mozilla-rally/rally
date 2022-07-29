import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Strings } from "../../../../../resources/Strings";
import { useStudy } from "../StudyDataContext";
import { StudyTitle } from "../StudyTitle";
import { StudyTopDetails } from "../StudyTopDetails";

jest.mock("../StudyDataContext");
jest.mock("../StudyTitle");

const strings = Strings.components.pages.studies.studyCard.topDetails;

describe("StudyTopDetails tests", () => {
  it("study not enrolled, no icon available, date ongoing", () => {
    (useStudy as jest.Mock).mockReturnValue({
      isUserEnrolled: false,
      study: {
        name: "Study-1",
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

    expect(joinButton?.innerHTML).toBe(strings.joinStudy);
  });

  it("study not enrolled, custom icon, expiry date", () => {
    (useStudy as jest.Mock).mockReturnValue({
      isUserEnrolled: false,
      study: {
        name: "Study-1",
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

    expect(joinButton?.innerHTML).toBe(strings.joinStudy);
  });

  it("user enrolled", () => {
    (useStudy as jest.Mock).mockReturnValue({
      isUserEnrolled: true,
      study: {
        name: "Study-1",
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

  it("clicking the join button triggers the study enrollment toggle", async () => {
    const startStudyEnrollmentToggle = jest.fn();

    (useStudy as jest.Mock).mockReturnValue({
      isUserEnrolled: false,
      startStudyEnrollmentToggle,
    });

    userEvent.setup();

    const root = render(<StudyTopDetails />);

    await act(async () => {
      await userEvent.click(root.getByText(strings.joinStudy));
    });

    expect(startStudyEnrollmentToggle).toHaveBeenCalled();
  });
});
