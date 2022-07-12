import { render } from "@testing-library/react";

import { StudyDescription } from "../StudyDescription";
import { StudyDetails } from "../StudyDetails";
import { StudyTopDetails } from "../StudyTopDetails";

jest.mock("../StudyDescription");
jest.mock("../StudyTopDetails");

describe("StudyDetails tests", () => {
  it("renders correctly", () => {
    render(<StudyDetails />);

    expect(StudyDescription).toHaveBeenCalled();
    expect(StudyTopDetails).toHaveBeenCalled();
  });
});
