export interface Study {
  studyId: string;
  name: string;
  version: string;
  description: string;
  studyDetailsLink: string;
  authors: {
    name: string;
  };
  icons: Record<string, string>;
  firefoxAddonId: string;
  chromeExtensionId: string;
  schemaNamespace: string;
  downloadLink: {
    chrome: string;
    firefox: string;
  };
  endDate: string | "Ongoing";
  studyEnded: boolean;
  studyPaused: boolean;
  dataCollectionDetails: string[];
  tags: string[];
}
