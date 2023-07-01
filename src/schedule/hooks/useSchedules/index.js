import { useDispatch, useSelector } from "react-redux";

import {
  addSchedule as as,
  addShift as ash,
  addStatus as ass,
  setActive,
} from "../../store/schedules";

import useFetch from "../../../common/hooks/useFetch";
import useLoading from "../../../common/hooks/useLoading";

const useSchedules = () => {
  const { schedules, shifts, statuses } = useSelector(
    ({ schedules }) => schedules
  );
  const dispatch = useDispatch();
  const { get, post } = useFetch();
  const { update } = useLoading();

  const addShift = (shift) => dispatch(ash(shift));
  const addStatus = (status) => dispatch(ass(status));
  const addSchedule = (sh) => dispatch(as(sh));

  const loadSchedules = async () => {
    const { json: sch } = await get("/dates", "dates");
    addSchedule({ value: sch.error ? [] : sch });

    const { json: shifts } = await get("/shifts", "shifts");
    const { json: st } = await get("/statuses", "statuses");
    addStatus(st.error ? [] : st);
    addShift(shifts.error ? [] : shifts);
  };

  const nextSchedule = async () => {
    const prev_range = schedules[0];
    if (!prev_range) return;
    const { json } = await post("/next");
    if (!json.error) addSchedule({ value: json });
  };

  const setFirstSchedule = async (from) => {
    const { json } = await post("/start", { from });
    if (!json.error) {
      addSchedule({ value: { from: json.from, to: json.to } });
      dispatch(setActive(json));
    }
    return json;
  };

  return {
    shifts,
    schedules,
    statuses,
    setFirstSchedule,
    nextSchedule,
    loadSchedules,
    addShift,
    addStatus,
  };
};

export default useSchedules;
