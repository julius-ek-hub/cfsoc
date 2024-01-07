import { useDispatch, useSelector } from "react-redux";

import { update as u } from "../../store/settings";
import useLocalStorage from "../useLocalStorage";
import useFetch from "../useFetch";

import { u as uc } from "../../utils/utils";

const useCommonSettings = () => {
  const { user, theme, primary_color, staffs, push_notification, apps } =
    useSelector(({ common_settings }) => common_settings);
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

  const getUser = async () => {
    const { json } = await get("/user?token=" + lget("x-auth-token"), "user");
    !json.error && update("user", json, false);
  };

  const logout = async () => {
    const was = user.username;
    [
      "user",
      "x-auth-token",
      "max_days",
      "show_profile",
      "theme",
      "primary_color",
      "view",
      "sheets_by",
      "case_sensitive_search",
    ].map((k) => {
      update(k, k === "theme" ? "system" : undefined);
    });
    was !== "default.account" && window.location.reload();
  };

  const initializeCommonSettings = async () => {
    const t = lget("theme");
    const tc = lget("primary_color");
    const a = lget("alarm");
    const pn = lget("push_notification");
    update("theme", t || "system");
    update("primary_color", tc || "#ff4713");
    update("alarm", a);
    update("push_notification", pn, false);
    await getUser();
    await getStaffs();
  };

  return {
    theme,
    apps,
    user,
    guest: !user?.username || user?.username === "default.account",
    primary_color,
    staffs,
    uname: user?.username,
    admin: Boolean(user?.admin),
    getName(username = user?.username) {
      if (!username || !staffs) return "";
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
    push_notification,
    primary_colors: ["#ff4713", "#1D6F42", "#005b96"],
  };
};

export default useCommonSettings;
