import { Study } from "@mozilla/rally-shared-types/dist";
import { act, render } from "@testing-library/react";

import { useStudies } from "../../../../../services/StudiesService";
import { useUserDocument } from "../../../../../services/UserDocumentService";
import { StudyDataContext, StudyProvider, useStudy } from "../StudyDataContext";

jest.mock("../../../../../services/StudiesService");
jest.mock("../../../../../services/UserDocumentService");

const study = {
  studyId: "studyId",
  description: "Study description",
  dataCollectionDetails: ["data collection 1", "data collection 2"],
  studyDetailsLink: "http://example.com",
  tags: ["tag1, tag2, tag3"],
};

describe("StudyDataContext tests", () => {
  it("nothing installed, not enrolled", async () => {
    (useStudies as jest.Mock).mockReturnValue({ installedStudyIds: [] });
    (useUserDocument as jest.Mock).mockReturnValue({ userDocument: null });

    let studyContext: StudyDataContext = null as unknown as StudyDataContext;

    await renderStudyContext((context) => (studyContext = context));

    expect(studyContext).toEqual({
      study,
      isInstalledLocally: false,
      isUserEnrolled: false,
    });
  });

  it("not installed, not enrolled", async () => {
    (useStudies as jest.Mock).mockReturnValue({
      installedStudyIds: ["studyId1"],
    });
    (useUserDocument as jest.Mock).mockReturnValue({ userDocument: null });

    let studyContext: StudyDataContext = null as unknown as StudyDataContext;

    await renderStudyContext((context) => (studyContext = context));

    expect(studyContext).toEqual({
      study,
      isInstalledLocally: false,
      isUserEnrolled: false,
    });
  });

  it("installed, not enrolled", async () => {
    (useStudies as jest.Mock).mockReturnValue({
      installedStudyIds: [study.studyId],
    });
    (useUserDocument as jest.Mock).mockReturnValue({
      userDocument: { studies: [] },
    });

    let studyContext: StudyDataContext = null as unknown as StudyDataContext;

    await renderStudyContext((context) => (studyContext = context));

    expect(studyContext).toEqual({
      study,
      isInstalledLocally: true,
      isUserEnrolled: false,
    });
  });

  it("not installed, but enrolled", async () => {
    (useStudies as jest.Mock).mockReturnValue({
      installedStudyIds: ["studyId1"],
    });

    (useUserDocument as jest.Mock).mockReturnValue({
      userDocument: { studies: { [study.studyId]: { enrolled: true } } },
    });

    let studyContext: StudyDataContext = null as unknown as StudyDataContext;

    await renderStudyContext((context) => (studyContext = context));

    expect(studyContext).toEqual({
      study,
      isInstalledLocally: false,
      isUserEnrolled: true,
    });
  });

  it("installed and enrolled", async () => {
    (useStudies as jest.Mock).mockReturnValue({
      installedStudyIds: [study.studyId],
    });

    (useUserDocument as jest.Mock).mockReturnValue({
      userDocument: { studies: { [study.studyId]: { enrolled: true } } },
    });

    let studyContext: StudyDataContext = null as unknown as StudyDataContext;

    await renderStudyContext((context) => (studyContext = context));

    expect(studyContext).toEqual({
      study,
      isInstalledLocally: true,
      isUserEnrolled: true,
    });
  });

  async function renderStudyContext(
    onStudyDataContext: (studyContext: StudyDataContext) => void
  ) {
    function Component() {
      const dataContext = useStudy();
      onStudyDataContext(dataContext);
      return null;
    }

    const renderedComponent = (
      <StudyProvider study={study as Study}>
        <Component />
      </StudyProvider>
    );

    await act(async () => {
      render(renderedComponent);
    });
  }
});
