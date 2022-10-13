import { render } from "@testing-library/react";

import { StandardPrivacyPolicySection } from "../StandardPrivacyPolicySection";

describe("StandardPrivacyPolicySection tests", () => {
  it("renders title and tagline along with empty sections", () => {
    const root = render(
      <StandardPrivacyPolicySection
        title="Title"
        tagline="Tagline"
        sections={[]}
      />
    );

    expect(root.getByText("Title")).toBeInTheDocument();
    expect(root.getByText("Tagline")).toBeInTheDocument();
    expect(document.querySelector("img")).not.toBeInTheDocument();
  });

  it("renders all elements", () => {
    const sections = [
      {
        text: "Test 1",
      },
      {
        text: "Test 2",
      },
    ];

    const root = render(
      <StandardPrivacyPolicySection
        title="Title"
        tagline="Tagline"
        sections={sections}
      />
    );

    expect(root.getByText("Title")).toBeInTheDocument();
    expect(root.getByText("Tagline")).toBeInTheDocument();

    sections.forEach(({ text }) => {
      expect(root.queryByText(text)).toBeInTheDocument();
    });
  });
});
