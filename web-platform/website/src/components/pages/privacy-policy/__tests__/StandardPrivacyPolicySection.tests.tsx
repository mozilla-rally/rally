import { render } from "@testing-library/react";

import { Flags } from "../../../../resources/Flags";
import { useFlagService } from "../../../../services/FlagService";
import { StandardPrivacyPolicySection } from "../StandardPrivacyPolicySection";

jest.mock("../../../../services/FlagService");

describe("StandardPrivacyPolicySection tests", () => {
  const isFlagActive = jest.fn();
  beforeEach(() => {
    (useFlagService as jest.Mock).mockReturnValue({
      isFlagActive,
    });
  });
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
    expect(useFlagService).toHaveBeenCalled();
    expect(isFlagActive).toHaveBeenCalledWith(Flags.onboardingV2);
  });

  it("renders all elements", () => {
    const sections = [
      {
        image: {
          url: "/img/image1.png",
          width: 100,
          alt: "alt text 1",
        },
        text: "Test 1",
      },
      {
        image: {
          url: "/img/image2.png",
          width: 150,
          alt: "alt text 2",
        },
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

    sections.forEach(({ image, text }) => {
      const img = document.querySelector(
        `img[src="${image.url}"]`
      ) as HTMLImageElement;
      expect(img).toBeInTheDocument();

      expect(img.width).toBe(image.width);
      expect(img.alt).toBe(image.alt);

      expect(root.queryByText(text)).toBeInTheDocument();
      expect(useFlagService).toHaveBeenCalled();
      expect(isFlagActive).toHaveBeenCalledWith(Flags.onboardingV2);
    });
  });
});
