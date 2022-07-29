import { render } from "@testing-library/react";

import { AddStudyView } from "../AddStudyView";
import { LeaveStudyView } from "../LeaveStudyView";
import { StudyCard } from "../StudyCard";
import { StudyCardHeader } from "../StudyCardHeader";
import { StudyDetails } from "../StudyDetails";

jest.mock("../AddStudyView");
jest.mock("../LeaveStudyView");
jest.mock("../StudyCardHeader");
jest.mock("../StudyDetails");

describe("StudyCard tests", () => {
  it("renders all components", () => {
    render(<StudyCard />);

    expect(StudyCardHeader).toHaveBeenCalled();
    expect(StudyDetails).toHaveBeenCalled();
    expect(AddStudyView).toHaveBeenCalled();
    expect(LeaveStudyView).toHaveBeenCalled();
  });
});
