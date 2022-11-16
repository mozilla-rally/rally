import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";

import { HomePageBackground } from "../HomePageBackground";

describe("HomeBackground tests", () => {
  it("renders content and handles scroll event", async () => {
    jest.spyOn(window, "addEventListener");

    const doc = render(<HomePageBackground>Hello World</HomePageBackground>);

    expect(doc.getByText("Hello World")).toBeInTheDocument();

    expect(window.addEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.anything()
    );

    const onScroll = (window.addEventListener as jest.Mock).mock.calls[0][1];

    await act(async () => onScroll());

    const backgroundContainer = doc.container.childNodes[0] as HTMLDivElement;

    const cssStyles = backgroundContainer.style as CSSStyleDeclaration;

    expect(cssStyles.getPropertyValue("--o1")).toBe("0.2");
    expect(cssStyles.getPropertyValue("--data1")).toBe("0px");
    expect(cssStyles.getPropertyValue("--data2")).toBe("0px");
    expect(cssStyles.getPropertyValue("--card1")).toBe("0px");
    expect(cssStyles.getPropertyValue("--card2")).toBe("0px");
  });

  it("applies html properties to container", () => {
    render(
      <HomePageBackground className="hello-world">
        Hello World
      </HomePageBackground>
    );

    expect(document.querySelector(".hello-world")).toBeInTheDocument();
  });
});
