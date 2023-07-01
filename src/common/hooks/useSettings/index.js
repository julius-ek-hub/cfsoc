import { useDispatch, useSelector } from "react-redux";

import { update as u } from "../../store/settings";
import useLocalStorage from "../useLocalStorage";
import useFetch from "../useFetch";

import { u as uc } from "../../utils/utils";

const useCommonSettings = () => {
  const { user, theme, staffs, alarm } = useSelector(
    ({ common_settings }) => common_settings
  );
  const dispatch = useDispatch();
  const { get: lget, set, remove } = useLocalStorage();
  const { get } = useFetch();

  const update = (key, value) => {
    dispatch(u({ key, value }));
    value ? set(key, value) : remove(key);
  };

  const getStaffs = async () => {
    if (staffs) return;
    const { json } = await get("/staffs", "staffs");
    !json.error && update("staffs", json);
  };

  const logout = async () => {
    [
      "user",
      "x-auth-token",
      "max_days",
      "show_profile",
      "theme",
      "view",
      "alarm",
    ].map((k) => {
      update(k, k === "theme" ? "system" : undefined);
    });
  };

  const initializeCommonSettings = async () => {
    const t = lget("theme");
    const u = lget("user");
    const a = lget("alarm");
    update("theme", t || "system");
    update("user", u);
    update("alarm", a);
    await getStaffs();
  };

  return {
    theme,
    user,
    staffs,
    alarm,
    uname: user?.username,
    admin: Boolean(user?.admin),
    guest: (user?.username || "guest") === "guest",
    getName(username = user?.username) {
      if (!username || !staffs) return "guest";
      return (
        staffs[username] || {
          name: username,
        }
      ).name
        .split(".")
        .map(uc)
        .join(" ");
    },
    update,
    logout,
    initializeCommonSettings,
  };
};

export default useCommonSettings;
