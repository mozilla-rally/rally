import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { StandardProfileSection } from "../StandardProfileSection";

describe("StandardProfileSection tests", () => {
  it("zero state with no items, no value set", () => {
    const title = "Sample Title";
    const onDataCleared = jest.fn();

    const root = render(
      <StandardProfileSection
        title={title}
        isValuePresent={false}
        onDataCleared={onDataCleared}
        enableTwoColumnLayout={false}
      />
    );

    expect(root.getByText(title)).toBeInTheDocument();

    const button = document.querySelector("button");
    expect(button).toBeInTheDocument();

    expect(button?.classList).toContain("invisible");

    expect(onDataCleared).not.toHaveBeenCalled();
  });

  it("zero state with no items, but value is set", async () => {
    const title = "Sample Title";
    const onDataCleared = jest.fn();

    userEvent.setup();

    const root = render(
      <StandardProfileSection
        title={title}
        isValuePresent={true}
        onDataCleared={onDataCleared}
        enableTwoColumnLayout={false}
      />
    );

    expect(root.getByText(title)).toBeInTheDocument();

    const button = document.querySelector("button") as HTMLButtonElement;
    expect(button).toBeInTheDocument();

    expect(button?.classList).not.toContain("invisible");

    expect(onDataCleared).not.toHaveBeenCalled();

    await userEvent.click(button);

    expect(onDataCleared).toHaveBeenCalled();
  });

  it("single child", () => {
    const title = "Sample Title";
    const onDataCleared = jest.fn();

    userEvent.setup();

    const root = render(
      <StandardProfileSection
        title={title}
        isValuePresent={true}
        onDataCleared={onDataCleared}
        enableTwoColumnLayout={true}
      >
        <span>Child Element</span>
      </StandardProfileSection>
    );

    expect(root.getByText("Child Element")).toBeInTheDocument();
  });

  it("multiple children", () => {
    const title = "Sample Title";
    const onDataCleared = jest.fn();

    userEvent.setup();

    const root = render(
      <StandardProfileSection
        title={title}
        isValuePresent={true}
        onDataCleared={onDataCleared}
        enableTwoColumnLayout={false}
      >
        {["1", "2", "3"].map((i) => (
          <span key={i}>Child Element {i}</span>
        ))}
      </StandardProfileSection>
    );

    ["1", "2", "3"].forEach((i) => {
      expect(root.getByText(`Child Element ${i}`)).toBeInTheDocument();
    });
  });
});
