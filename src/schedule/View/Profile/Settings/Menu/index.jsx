import Shifts from "./Shifts";
import ShiftsStatuses from "./Statuses";
import Settings from "./Settings";

import useSettings from "../../../../hooks/useSettings";
import useCommonSettings from "../../../../../common/hooks/useSettings";
import UserInfo from "../../../../../common/utils/UserInfo";

function SettingsMenu() {
  const { max_days } = useSettings();
  const { uname, guest } = useCommonSettings();
  if (!uname) return null;

  return (
    <>
      <UserInfo />
      {!guest && (
        <>
          {max_days && <Settings />}
          <Shifts />
          <ShiftsStatuses />
        </>
      )}
    </>
  );
}

export default SettingsMenu;
