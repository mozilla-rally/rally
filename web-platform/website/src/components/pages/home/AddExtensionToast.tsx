import { useEffect, useState } from "react";
import { isChrome, isMobile } from "react-device-detect";

import { Strings } from "../../../resources/Strings";
import { useStudies } from "../../../services/StudiesService";
import { ToastComponent } from "./study-card/ToastComponent";

const extensionStrings = Strings.components.pages.home.alerts.addExtension;

export function AddExtensionToast() {
  const [showAddExtensionToast, setShowAddExtenionToast] =
    useState<boolean>(false);
  const { installedStudyIds, rallyExtensionStudy } = useStudies();

  useEffect(() => {
    setShowAddExtenionToast(
      !isMobile &&
        !installedStudyIds.includes(rallyExtensionStudy?.studyId || "")
    );
  }, [installedStudyIds, rallyExtensionStudy]);

  return (
    <ToastComponent
      {...extensionStrings}
      isShown={showAddExtensionToast}
      link={
        isChrome
          ? rallyExtensionStudy?.downloadLink.chrome
          : rallyExtensionStudy?.downloadLink.firefox
      }
    />
  );
}
