import { render } from "@testing-library/react";

import { Strings } from "../../../../../resources/Strings";
import { useStudy } from "../StudyDataContext";
import { StudyDescription } from "../StudyDescription";
import { StudyTag } from "../StudyTag";

jest.mock("../StudyDataContext");
jest.mock("../StudyTag");

const strings = Strings.components.pages.studies.studyCard.description;

const study = {
  description: "Study description",
  dataCollectionDetails: ["data collection 1", "data collection 2"],
  studyDetailsLink: "http://example.com",
  tags: ["tag1, tag2, tag3"],
};

describe("StudyDescription tests", () => {
  it("renders study correctly when enrolled", () => {
    (useStudy as jest.Mock).mockReturnValue({ study, isUserEnrolled: true });
    (StudyTag as jest.Mock).mockImplementation(({ children }) => children);

    verifyStudyRenderedCorrectly();

    expect(
      document.querySelector("button.accordion-button.collapsed")
    ).toBeInTheDocument();
  });

  it("renders study correctly when not enrolled", () => {
    (useStudy as jest.Mock).mockReturnValue({ study, isUserEnrolled: false });
    (StudyTag as jest.Mock).mockImplementation(({ children }) => children);

    verifyStudyRenderedCorrectly();

    expect(
      document.querySelector("button.accordion-button")
    ).toBeInTheDocument();

    expect(
      document.querySelector("button.accordion-button.collapsed")
    ).not.toBeInTheDocument();
  });

  function verifyStudyRenderedCorrectly() {
    const root = render(<StudyDescription />);

    expect(root.getByText(strings.aboutThisStudy)).toBeInTheDocument();

    expect(root.getByText(study.description)).toBeInTheDocument();

    expect(root.getByText(strings.keyDataCollected)).toBeInTheDocument();

    study.dataCollectionDetails.forEach((d) =>
      expect(root.getByText(d)).toBeInTheDocument()
    );

    expect(root.getByText(strings.viewFullStudyDetails)).toBeInTheDocument();

    study.tags.forEach((t) => expect(root.getByText(t)).toBeInTheDocument());
  }
});
