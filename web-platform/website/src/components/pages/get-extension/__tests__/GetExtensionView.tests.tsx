import { render } from "@testing-library/react";
import { useRouter } from "next/router";

import { Strings } from "../../../../resources/Strings";
import { useStudies } from "../../../../services/StudiesService";
import { Highlighter } from "../../../Highlighter";
import { GetExtensionView } from "../GetExtensionView";

jest.mock("next/router");
jest.mock("../../../../services/StudiesService");
jest.mock("../../../Highlighter");
jest.mock("../../../../services/FlagService");

const strings = Strings.components.pages.login.getExtensionView;

describe("GetExtensionView tests", () => {
  beforeEach(() => {
    (Highlighter as jest.Mock).mockImplementation(({ children }) => children);

    (useStudies as jest.Mock).mockReturnValue({
      allStudies: [],
    });
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
  });
});
