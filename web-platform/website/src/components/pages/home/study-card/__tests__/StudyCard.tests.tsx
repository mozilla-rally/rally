import { render } from "@testing-library/react";

import { StudyCard } from "../StudyCard";
import { StudyCardHeader } from "../StudyCardHeader";
import { StudyDetails } from "../StudyDetails";

jest.mock("../StudyCardHeader");
jest.mock("../StudyDetails");

describe("StudyCard tests", () => {
  it("renders all components", () => {
    render(<StudyCard />);

    expect(StudyCardHeader).toHaveBeenCalled();
    expect(StudyDetails).toHaveBeenCalled();
  });
});
