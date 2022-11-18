import { useEffect, useState } from "react";

import { Strings } from "../../../resources/Strings";
import { useAuthentication } from "../../../services/AuthenticationService";
import { useStudies } from "../../../services/StudiesService";
import { detectBrowser } from "../../../utils/BrowserDetector";
import { BrowserType } from "../../../utils/BrowserType";
import { ToastComponent } from "./study-card/ToastComponent";

const extensionStrings = Strings.components.pages.home.alerts.addExtension;

export function AddExtensionToast() {
  const [showAddExtensionToast, setShowAddExtenionToast] =
    useState<boolean>(false);
  const [browserType] = useState(detectBrowser());
  const { reloadUser } = useAuthentication();
  const { installedStudyIds, rallyExtensionStudy } = useStudies();

  useEffect(() => {
    reloadUser();
  }, []);

  useEffect(() => {
    setShowAddExtenionToast(
      !installedStudyIds.includes(rallyExtensionStudy?.studyId || "")
    );
  }, [installedStudyIds, rallyExtensionStudy]);

  return (
    <>
      <ToastComponent
        {...extensionStrings}
        isShown={showAddExtensionToast}
        link={
          browserType === BrowserType.Chrome
            ? rallyExtensionStudy?.downloadLink.chrome
            : rallyExtensionStudy?.downloadLink.firefox
        }
      />
    </>
  );
}
