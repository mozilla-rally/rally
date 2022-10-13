import { render } from "@testing-library/react";

import { Strings } from "../../../../resources/Strings";
import { StudiesTitle } from "../StudiesTitle";

const strings = Strings.components.pages.studies.title;

describe("StudiesTitle tests", () => {
  it("renders correctly", () => {
    const root = render(<StudiesTitle />);

    expect(root.getByText(strings.title)).toBeInTheDocument();
  });

  it("applies html properties to container", () => {
    const doc = render(
      <StudiesTitle className="hello-world">Hello World</StudiesTitle>
    );

    expect(document.querySelector(".hello-world")).toBeInTheDocument();
    expect(doc.queryByText("Hello World")).not.toBeInTheDocument();
  });
});
