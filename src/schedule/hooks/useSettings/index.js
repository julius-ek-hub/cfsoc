import { useDispatch, useSelector } from "react-redux";

import { updateSettings } from "../../store/settings";

import useFetch from "../../../common/hooks/useFetch";
import useLocalStorage from "../../../common/hooks/useLocalStorage";

const useSettings = () => {
  const { show_profile, max_days, view } = useSelector(
    ({ schedule_settings }) => schedule_settings
  );
  const dispatch = useDispatch();
  const { get } = useFetch();
  const { get: lget, set, remove } = useLocalStorage();

  const update = (key, value) => {
    dispatch(updateSettings({ key, value }));
    value ? set(key, value) : remove(key);
  };

  const initializeSchedule = async () => {
    const v = lget("view");
    const show_profile = lget("show_profile");
    update("view", v || "table");
    update("show_profile", show_profile);

    const { json: mx } = await get("/max_days", "max_days");
    update("max_days", mx.max_days || 15);
  };

  return {
    show_profile,
    max_days,
    view,
    update,
    initializeSchedule,
  };
};

export default useSettings;
