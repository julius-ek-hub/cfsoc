import { useEffect } from "react";

import Box from "@mui/material/Box";

import Profile from "./View/Profile";
import Main from "./View/Main";
import Nav from "../common/utils/Nav";

import useSettings from "./hooks/useSettings";
import useSchedules from "./hooks/useSchedules";
import useCommonSettings from "../common/hooks/useSettings";

const Schedule = () => {
  const { initializeSchedule } = useSettings();
  const { user, staffs } = useCommonSettings();
  const { loadSchedules } = useSchedules();

  const initialize = async () => {
    await initializeSchedule();
    await loadSchedules();
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    user &&
    staffs && (
      <>
        <Nav app="Schedules" />
        <Box display="flex" width="100%" flexGrow={1} overflow="hidden">
          <Profile />
          <Main />
        </Box>
      </>
    )
  );
};

export default Schedule;
