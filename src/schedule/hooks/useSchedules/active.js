import { useDispatch, useSelector } from "react-redux";

import { useSearchParams, useParams } from "react-router-dom";

import {
  setActive,
  updateLike,
  setActiveBy,
  updateSuggestions as us,
  setSelected as ss,
  setHistory as sh,
  removeSuggestion,
} from "../../store/schedules";
import useCommonSettings from "../../../common/hooks/useSettings";

import useFetch from "../../../common/hooks/useFetch";

import { next_or_current } from "../../utils/utils";

const useActiveSchedule = () => {
  const { active, selected, historyLevel, history, active_by } = useSelector(
    ({ schedules }) => schedules
  );
  const dispatch = useDispatch();
  const { get, post, dlete } = useFetch();
  const { uname, admin, user } = useCommonSettings();
  const { date: date_param } = useParams();
  const [sp, setSp] = useSearchParams();

  let active_assiduity = [];
  if (Object.keys(active?.suggestions || {}).length > 0 && active_by) {
    if (!uname)
      active_assiduity = Object.values(active.suggestions)[0].assiduity;
    else active_assiduity = active.suggestions[active_by]?.assiduity || [];
  }

  const set_active_by = (by) => {
    dispatch(setActiveBy(by));
    setSp({ by });
  };

  const updateSuggestions = (k_v) => dispatch(us(k_v));
  const setHistory = (k_v) => dispatch(sh(k_v));
  const setSelected = (v) => dispatch(ss(v));

  const generateSchedule = async (copy) => {
    if (!user) return;
    const { json } = await get(
      `/generate?from=${active.from}&to=${active.to}&by=${uname}${
        copy ? `&copy=${active_by}` : ""
      }`
    );

    updateSuggestions({ [`suggestions@${uname}`]: json });
    set_active_by(uname);
  };

  const may_create_own = () => {
    return (
      !active.suggestions[uname] &&
      !Object.values(active.suggestions).some((sug) =>
        sug.votes.includes(uname)
      ) &&
      !active.locked &&
      user &&
      next_or_current(active.from, active.to).editable
    );
  };

  const loadSchedule = async () => {
    if (!date_param) return;
    const { json } = await get(`/${date_param}`, "schedule");
    dispatch(setActive(json));
    set_active_by(sp.get("by") || "sys");
  };
  const downloadSchedule = async (by) => {
    const { json } = await get(
      `/download?from=${active.from}&to=${active.to}&by=${by.join("_")}`
    );
  };

  const emailSchedule = async (body) => {
    const { json } = await post("/email", body);
    console.log(json);
  };

  const saveSchedule = async () => {
    if (!user) return;
    await post("/suggestions", {
      $new: active.suggestions[active_by],
      from: active.from,
      to: active.to,
      by: active_by,
    });
  };

  const remSchedule = async () => {
    if (active_by !== uname && !admin) return;
    const { json } = await dlete(
      `/suggestions?from=${active.from}&to=${active.to}&by=${active_by}`
    );

    if (json.errorCode === 404) {
      dispatch(setActive(json));
      dispatch(setActiveBy("sys"));
    }
    dispatch(removeSuggestion(active_by));
  };

  const update_like = async () => {
    if (active_by === uname || !user || active?.suggestions[uname]) return;
    const { json } = await post("/like", {
      from: active.from,
      to: active.to,
      by: active_by,
      liker: uname,
    });
    dispatch(updateLike({ by: active_by, newVotes: json }));
  };

  const update_lock = async () => {
    if (!admin) return;
    const { json } = await post("/lock", {
      from: active.from,
      to: active.to,
    });
    updateSuggestions({ locked: json.locked });
  };

  const approve_suggestion = async () => {
    if (!admin) return;
    const { json } = await post("/approve", {
      from: active.from,
      to: active.to,
      by: active_by,
    });

    updateSuggestions({ locked: json.locked });
    updateSuggestions({
      [`suggestions@${active_by}@approved`]: json.approved,
    });
  };

  return {
    selected,
    active,
    active_by,
    date_param,
    active_assiduity,
    historyLevel,
    history,
    downloadSchedule,
    setHistory,
    update_lock,
    may_create_own,
    generateSchedule,
    updateSuggestions,
    set_active_by,
    saveSchedule,
    loadSchedule,
    remSchedule,
    update_like,
    setSelected,
    emailSchedule,
    approve_suggestion,
  };
};

export default useActiveSchedule;
