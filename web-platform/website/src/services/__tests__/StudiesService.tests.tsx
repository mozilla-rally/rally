import { RenderResult, act, render } from "@testing-library/react";
import { collection, getDocs } from "firebase/firestore";

import { dispose, initializeExtensionEvents } from "../ExtensionsEventService";
import { useFirebase } from "../FirebaseService";
import {
  StudiesDataContext,
  StudiesProvider,
  useStudies,
} from "../StudiesService";

jest.mock("firebase/firestore");
jest.mock("../ExtensionsEventService");
jest.mock("../FirebaseService");

const studies = [{ studyId: "study-1" }, { studyId: "study-2" }];

const rawDocs = {
  docs: [
    {
      data: () => studies[0],
    },
    {
      data: () => studies[1],
    },
  ],
};

describe("StudiesService tests", () => {
  it("loads the studies correctly", async () => {
    const db = { db: "db" };
    (useFirebase as jest.Mock).mockReturnValue({ db });

    const collectionResult = { collection: "studies" };
    (collection as jest.Mock).mockReturnValue(collectionResult);

    (getDocs as jest.Mock).mockReturnValue(rawDocs);

    let studiesContext: StudiesDataContext =
      null as unknown as StudiesDataContext;

    function Component() {
      studiesContext = useStudies();
      return null;
    }

    const renderedComponent = (
      <StudiesProvider>
        <Component />
      </StudiesProvider>
    );

    let root = null as unknown as RenderResult;

    await act(async () => {
      root = render(renderedComponent);
    });

    expect(studiesContext).not.toBeNull();

    expect(studiesContext.allStudies).toEqual(studies);
    expect(studiesContext.installedStudyIds).toEqual([]);
    expect(studiesContext.isLoaded).toBeTruthy();

    expect(initializeExtensionEvents).toHaveBeenCalled();

    const onStudyInstalled = (initializeExtensionEvents as jest.Mock).mock
      .calls[0][0].onStudyInstalled;

    await act(async () => {
      onStudyInstalled(studies[0].studyId);
    });

    expect(studiesContext.installedStudyIds).toEqual([studies[0].studyId]);

    await act(async () => {
      onStudyInstalled(studies[0].studyId);
    });

    expect(studiesContext.installedStudyIds).toEqual([studies[0].studyId]);

    await act(async () => {
      onStudyInstalled(studies[1].studyId);
    });

    expect(studiesContext.installedStudyIds).toEqual([
      studies[0].studyId,
      studies[1].studyId,
    ]);

    expect(dispose).not.toHaveBeenCalled();

    await act(async () => {
      root.unmount();
    });

    expect(dispose).toHaveBeenCalled();
  });
});
