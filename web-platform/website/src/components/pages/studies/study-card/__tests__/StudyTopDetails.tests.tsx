import { render } from "@testing-library/react";

import { Strings } from "../../../../../resources/Strings";
import { useStudy } from "../StudyDataContext";
import { StudyTopDetails } from "../StudyTopDetails";

jest.mock("../StudyDataContext");

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

    const root = render(<StudyTopDetails />);

    expect(root.getByText("Study-1")).toBeInTheDocument();

    expect(
      document.querySelector(`img[src="img/default-study-icon.png"]`)
    ).toBeInTheDocument();

    expect(root.getByText("Test author | Ongoing")).toBeInTheDocument();

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

    const root = render(<StudyTopDetails />);

    expect(root.getByText("Study-1")).toBeInTheDocument();

    expect(
      document.querySelector(`img[src="img/custom-icon.png"]`)
    ).toBeInTheDocument();

    expect(
      root.getByText("Test author | Ends: Mon Jan 06 2020")
    ).toBeInTheDocument();

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

    const root = render(<StudyTopDetails />);

    expect(root.getByText("Study-1")).toBeInTheDocument();

    expect(
      document.querySelector(`img[src="img/custom-icon.png"]`)
    ).toBeInTheDocument();

    expect(
      root.getByText("Test author | Ends: Mon Jan 06 2020")
    ).toBeInTheDocument();

    expect(document.querySelector(".join-button")).not.toBeInTheDocument();
  });
});
