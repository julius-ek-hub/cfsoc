import { useDispatch, useSelector } from "react-redux";

import { update as u } from "../../store/settings";
import useLocalStorage from "../useLocalStorage";
import useFetch from "../useFetch";

import { u as uc } from "../../utils/utils";

const useCommonSettings = () => {
  const { user, theme, staffs } = useSelector(
    ({ common_settings }) => common_settings
  );
  const dispatch = useDispatch();
  const { get: lget, set, remove } = useLocalStorage();
  const { get } = useFetch("/auth");

  const update = (key, value, localSave = true) => {
    dispatch(u({ key, value }));
    value && localSave ? set(key, value) : remove(key);
  };

  const getStaffs = async () => {
    const { json } = await get("/staffs", "staffs");
    !json.error && update("staffs", json, false);
  };

  const logout = async () => {
    ["user", "x-auth-token", "max_days", "show_profile", "theme", "view"].map(
      (k) => {
        update(k, k === "theme" ? "system" : undefined);
      }
    );
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
