import { useDispatch, useSelector } from "react-redux";
import { useLocation, useSearchParams } from "react-router-dom";

import {
  addAlert as aa,
  addNotify as an,
  deleteAlert as da,
  deleteNotify as dn,
  updateAlert as ua,
  updateNotify as un,
  updateClient as uc,
} from "../store/splunk";

import useFetch from "../../common/hooks/useFetch";
import useLocalStorage from "../../common/hooks/useLocalStorage";

const useAlerts = () => {
  const { alerts, notify, alarm, show_splunk_info } = useSelector(
    ({ splunk }) => splunk
  );
  const dispatch = useDispatch();
  const [sp, setSp] = useSearchParams();
  const { get, post, patch } = useFetch("/expocitydubai");
  const l = useLocation();
  const ls = useLocalStorage();

  const addAlert = (alert) => dispatch(aa(alert));
  const deleteAlert = (__id) => dispatch(da(__id));
  const updateAlert = (__id, value) => dispatch(ua({ __id, value }));
  const deleteNotify = (contact) => dispatch(dn(contact));
  const addNotify = (contact) => dispatch(an(contact));
  const updateClient = (key, value) => {
    dispatch(uc({ key, value }));
    value ? ls.set(key, value) : ls.remove(key);
  };

  const loadAlerts = async () => {
    const { json } = await get("/api/splunk-alerts" + l.search, "alerts");
    !json.error && addAlert(json);
  };

  const loadNotify = async () => {
    const { json } = await get("/api/splunk-alerts/notify", "notify");
    !json.error && addNotify(json);
  };

  const updateNotify = async (contacts) => {
    const { json } = await patch(
      "/api/splunk-alerts/notify",
      contacts,
      "notify"
    );
    !json.error && dispatch(un(json));
  };

  const newNotify = async (contact) => {
    const { json } = await post(
      "/api/splunk-alerts/notify",
      contact,
      "add_notify"
    );
    if (json.error) return { error: json.error };
    addNotify(json);
    return {};
  };

  const checkUnreceivedAlerts = async () => {
    const { json } = await get(
      "/api/splunk-alerts/unreceived" + l.search,
      "unreceived_alerts"
    );
    if (!json.error && json.length > 0) {
      addAlert(json);
      document.querySelector("#splunk-alert-audio").play().catch(console.warn);
    }
  };

  const init = async () => {
    const a = ls.get("alarm");
    const show_splunk_info = ls.get("show_splunk_info");
    updateClient("alarm", a);
    updateClient("show_splunk_info", Boolean(show_splunk_info));
    await loadAlerts();
    await loadNotify();
  };

  return {
    alerts,
    notify,
    alarm,
    show_splunk_info,
    checkUnreceivedAlerts,
    loadAlerts,
    updateClient,
    init,
    deleteAlert,
    updateNotify,
    addAlert,
    addNotify,
    newNotify,
    updateAlert,
    loadNotify,
    loadNotify,
  };
};

export default useAlerts;
