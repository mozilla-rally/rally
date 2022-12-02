import { Container } from "reactstrap";
import { style } from "typestyle";

import { AddExtensionToast } from "./AddExtensionToast";
import { EmailNotVerifiedToast } from "./EmailNotVerifiedToast";
import { PrivacyToast } from "./PrivacyToast";

export function ProductToasts() {
  const [showEmailNotVerifiedToast, setShowEmailNotVerifiedToast] =
    useState<boolean>(false);
  const [showAddExtensionToast, setShowAddExtenionToast] =
    useState<boolean>(false);
  const [showAddPrivacyToast, setShowAddPrivacyToast] =
    useState<boolean>(false);
  const [showEmailDialog, setShowEmailDialog] = useState<boolean>(false);
  const [showPrivacyDialog, setShowPrivacyDialog] = useState<boolean>(false);
  const [browserType] = useState(detectBrowser());

  const { isUserVerified, reloadUserVerification, sendEmailVerification } =
    useAuthentication();
  const { installedStudyIds, rallyExtensionStudy } = useStudies();
  const { userDocument } = useUserDocument();

  useEffect(() => {
    reloadUserVerification();
  }, []);

  useEffect(() => {
    setShowEmailNotVerifiedToast(!isUserVerified);
  }, [isUserVerified]);

  useEffect(() => {
    setShowAddExtenionToast(
      !installedStudyIds.includes(rallyExtensionStudy?.studyId || "")
    );
  }, [installedStudyIds, rallyExtensionStudy]);

  useEffect(() => {
    setShowAddPrivacyToast((userDocument && !userDocument.enrolled) ?? false);
  }, [userDocument]);

  return (
    <Container className={styles.container}>
      <AddExtensionToast />
      <PrivacyToast />
      <EmailNotVerifiedToast />
    </Container>
  );
}

const styles = {
  container: style({
    width: "100%",
    maxWidth: "unset",
    padding: 0,
  }),
};
