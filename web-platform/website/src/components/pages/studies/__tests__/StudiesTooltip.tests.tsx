import { render } from "@testing-library/react";
import React from "react";

import { Strings } from "../../../../resources/Strings";
import { StudiesTooltip } from "../StudiesTooltip";

const strings = Strings.components.pages.studies.tooltip;

describe("StudiesTooltip tests", () => {
  it("renders content correctly", () => {
    const root = render(<StudiesTooltip />);

    expect(root.getByText(strings.title)).toBeInTheDocument();

    strings.sections.forEach(({ text, title }) => {
      if (typeof text === "string") {
        expect(root.getByText(text)).toBeInTheDocument();
      } else {
        expect(React.isValidElement(text)).toBeTruthy();
      }

      expect(root.getByText(title)).toBeInTheDocument();
    });
  });

  it("applies html properties to container", () => {
    const doc = render(
      <StudiesTooltip className="hello-world">Hello World</StudiesTooltip>
    );

    expect(document.querySelector(".hello-world")).toBeInTheDocument();
    expect(doc.queryByText("Hello World")).not.toBeInTheDocument();
  });
});
