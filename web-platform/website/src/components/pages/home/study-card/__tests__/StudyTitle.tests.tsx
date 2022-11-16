import { render } from "@testing-library/react";

import { useStudy } from "../StudyDataContext";
import { StudyTitle } from "../StudyTitle";

jest.mock("../StudyDataContext");

describe("StudyTitle tests", () => {
  it("no icon available, date ongoing", () => {
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

    const root = render(<StudyTitle />);

    expect(root.getByText("Study-1")).toBeInTheDocument();

    expect(
      document.querySelector(`img[src="img/default-study-icon.png"]`)
    ).toBeInTheDocument();

    expect(root.getByText("Ongoing")).toBeInTheDocument();
  });

  it("custom icon, expiry date", () => {
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

    const root = render(<StudyTitle />);

    expect(root.getByText("Study-1")).toBeInTheDocument();

    expect(
      document.querySelector(`img[src="img/custom-icon.png"]`)
    ).toBeInTheDocument();

    expect(root.getByText("Ends: Mon Jan 06 2020")).toBeInTheDocument();
  });
});
