import { render } from "@testing-library/react";
import { useRouter } from "next/router";

import { Flags } from "../../../../resources/Flags";
import { Strings } from "../../../../resources/Strings";
import { useFlagService } from "../../../../services/FlagService";
import { useStudies } from "../../../../services/StudiesService";
import { detectBrowser } from "../../../../utils/BrowserDetector";
import { BrowserType } from "../../../../utils/BrowserType";
import { Highlighter } from "../../../Highlighter";
import { GetExtensionView } from "../GetExtensionView";

jest.mock("next/router");
jest.mock("../../../../utils/BrowserDetector");
jest.mock("../../../../services/StudiesService");
jest.mock("../../../Highlighter");
jest.mock("../../../../services/FlagService");

const strings = Strings.components.pages.login.getExtensionView;

describe("GetExtensionView tests", () => {
  const isFlagActive = jest.fn();
  (Highlighter as jest.Mock).mockImplementation(({ children }) => children);
  (useStudies as jest.Mock).mockReturnValue({
    allStudies: [],
  });
  beforeEach(() => {
    (useFlagService as jest.Mock).mockReturnValue({
      isFlagActive,
    });
    (detectBrowser as jest.Mock).mockReturnValue(BrowserType.Chrome);
  });

  it("renders the view", () => {
    (useStudies as jest.Mock).mockReturnValue({
      allStudies: [
        {
          authors: {
            name: "Mozilla Rally",
          },
          downloadLink: { chrome: "download.com", firefox: "download.com" },
        },
      ],
    });

    const root = render(<GetExtensionView />);

    expect(Highlighter).toHaveBeenCalled();

    const replace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ isReady: true, replace });

    expect(root.getByText(strings.title)).toBeInTheDocument();

    expect(root.getByText(strings.subTitle)).toBeInTheDocument();

    expect(root.getByText(strings.bulletTitle)).toBeInTheDocument();

    expect(root.getByText(strings.getExt)).toBeInTheDocument();
    expect(useFlagService).toHaveBeenCalled();
    expect(isFlagActive).toHaveBeenCalledWith(Flags.onboardingV2);
  });
});
