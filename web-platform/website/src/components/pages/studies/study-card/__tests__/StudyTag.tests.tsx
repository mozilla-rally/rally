import { render } from "@testing-library/react";

import { StudyTag } from "../StudyTag";

describe("StudyTag tests", () => {
  it("renders recognized tag", () => {
    const root = render(<StudyTag>social media</StudyTag>);
    expect(root.getByText("social media")).toBeInTheDocument();
  });

  it("renders unrecognized tag", () => {
    const root = render(<StudyTag>web 3.0</StudyTag>);
    expect(root.getByText("web 3.0")).toBeInTheDocument();
  });
});
