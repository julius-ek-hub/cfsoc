import { useDispatch, useSelector } from "react-redux";
import { useLocation, useSearchParams } from "react-router-dom";

import {
  addAlert as aa,
  updateAlert as ua,
  updateClient as uc,
  setAccount as sa,
} from "../store/splunk";

import useFetch from "../../common/hooks/useFetch";
import useLocalStorage from "../../common/hooks/useLocalStorage";
import useCommonSettings from "../../common/hooks/useSettings";

const useAlerts = () => {
  const { alerts, show_splunk_info, account, interacted } = useSelector(
    ({ splunk }) => splunk
  );
  const dispatch = useDispatch();
  // const [sp, setSp] = useSearchParams();
  const { get, post, patch } = useFetch("/expocitydubai");
  const l = useLocation();
  const ls = useLocalStorage();
  const { uname } = useCommonSettings();

  const push_registered = (account.push_notification || []).find(
    (p) => p.device === window.navigator.userAgent.toLocaleLowerCase()
  );

  const alarm = (account.enabled_notifications || []).includes("sound");

  const addAlert = (alert) => dispatch(aa(alert));
  const setAccount = (acc) => dispatch(sa(acc));
  const updateClient = (key, value) => {
    dispatch(uc({ key, value }));
    value ? ls.set(key, value) : ls.remove(key);
  };

  const loadAlerts = async () => {
    const { json } = await get("/api/splunk-alerts" + l.search, "alerts");
    !json.error && addAlert(json);
  };

  const loadAccount = async () => {
    const { json } = await get("/api/splunk-alerts/account?username=" + uname);
    !json.error && setAccount(json);
  };

  const updateAlert = async (_ids, update) => {
    const { json } = await patch("/api/splunk-alerts/", { _ids, update });
    !json.error && dispatch(ua({ _ids, update }));
  };

  const updateNotify = async (body) => {
    updateClient("interacted", true);
    const { json } = await patch(
      "/api/splunk-alerts/notify",
      { ...body, username: uname },
      "notify"
    );
    !json.error && setAccount(json);
  };
  const enableNotification = async (on, update) => {
    updateClient("interacted", true);
    const { json } = await patch(
      "/api/splunk-alerts/enable-notify",
      { on, update, username: uname },
      "notify"
    );
    !json.error && setAccount(json);
  };

  const checkUnreceivedAlerts = async () => {
    const { json } = await get(
      `/api/splunk-alerts/unreceived${
        l.search + (l.search ? "&" : "?")
      }device=${navigator.userAgent.toLocaleLowerCase()}`,
      "no"
    );
    if (!json.error && json.length > 0) {
      addAlert(json);
      document.querySelector("#splunk-alert-audio").play().catch(console.warn);
    }
  };

  async function subscribeForPushNotifications() {
    updateClient("interacted", true);
    try {
      const register = await navigator.serviceWorker.register("./worker.js", {
        scope: "/",
      });

      const publicVapidKey =
        "BIaHciU-RpHaVUjPhRxcqBIuEQu8aTv_q7StQ4FmEBP6-0qg9WhowTE6IUOcuANuNdS0ssXc-K-YYV-q9OSQLY8";

      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicVapidKey,
      });

      if (push_registered) return;

      const { json } = await post(
        `/api/splunk-alerts/push-subscribe?device=${navigator.userAgent.toLocaleLowerCase()}&username=${uname}`,
        subscription
      );

      !json.error && setAccount(json);
    } catch (error) {
      console.error(error);
    }
  }

  const init = async () => {
    updateClient("alarm", ls.get("alarm"));
    updateClient("show_splunk_info", Boolean(ls.get("show_splunk_info")));
    await loadAccount();
    await loadAlerts();
  };

  return {
    alerts,
    alarm,
    show_splunk_info,
    account,
    push_registered,
    interacted: Boolean(!alarm || (alarm && interacted)),
    enableNotification,
    checkUnreceivedAlerts,
    subscribeForPushNotifications,
    loadAlerts,
    updateClient,
    init,
    updateNotify,
    addAlert,
    updateAlert,
  };
};

export default useAlerts;
