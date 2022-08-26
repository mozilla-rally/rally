import { Card } from "reactstrap";

import { CardStyles } from "../../../styles/Cards";
import { ResetPasswordView } from "../login/ResetPasswordView";

export function AcccountResetPasswordView() {
  return (
    <Card className={`${CardStyles.account.updates} flex-nowrap`}>
      <ResetPasswordView isAccount={true} />
    </Card>
  );
}
