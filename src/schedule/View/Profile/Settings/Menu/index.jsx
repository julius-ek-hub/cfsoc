import Shifts from "./Shifts";
import ShiftsStatuses from "./Statuses";
import Settings from "./Settings";

import useSettings from "../../../../hooks/useSettings";
import useCommonSettings from "../../../../../common/hooks/useSettings";
import UserInfo from "../../../../../common/utils/UserInfo";

function SettingsMenu() {
  const { max_days } = useSettings();
  const { user } = useCommonSettings();
  if (!user) return null;

  return (
    <>
      <UserInfo />

      {max_days && <Settings />}
      <Shifts />
      <ShiftsStatuses />
    </>
  );
}

export default SettingsMenu;
