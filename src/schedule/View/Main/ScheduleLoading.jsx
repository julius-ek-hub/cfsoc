import CircularProgress from "@mui/material/CircularProgress";

import Middle from "../../../common/utils/Middle";

const ScheduleLoading = () => {
  return (
    <Middle flexGrow={1}>
      <CircularProgress />
    </Middle>
  );
};

export default ScheduleLoading;
