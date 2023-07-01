import { useEffect } from "react";

import Box from "@mui/material/Box";

import T from "./T";
import CalendarView from "./CalendarView";
import ToolBar from "./ToolBar";
import OwnerNav from "./OwnerNav";
import NoSchedule from "./NoSchedule";
import ScheduleLoading from "./ScheduleLoading";

import useActiveSchedule from "../../hooks/useSchedules/active";
import useSettings from "../../hooks/useSettings";
import useLoading from "../../../common/hooks/useLoading";

const Main = () => {
  const { loadSchedule, active, active_by, date_param } = useActiveSchedule();
  const { view } = useSettings();
  const { loading } = useLoading();

  let error;
  const e1 = (active?.suggestions || {})[active_by];
  if (e1?.error) error = e1;
  if (active?.error) error = active;

  useEffect(() => {
    loadSchedule();
  }, [date_param]);

  if (!active) return null;

  return (
    <Box flexGrow={1} display="flex" flexDirection="column" overflow="hidden">
      {loading.schedule ? (
        <ScheduleLoading />
      ) : (
        <>
          <ToolBar />
          {error ? (
            <NoSchedule error={error} />
          ) : view === "calendar" ? (
            <CalendarView />
          ) : (
            <T />
          )}
          <OwnerNav />
        </>
      )}
    </Box>
  );
};

export default Main;
