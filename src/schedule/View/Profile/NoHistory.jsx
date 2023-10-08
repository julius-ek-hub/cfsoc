import { useState } from "react";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Slide from "@mui/material/Slide";

import EventBusyIcon from "@mui/icons-material/EventBusy";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

import dayjs from "dayjs";

import Middle from "../../../common/utils/Middle";
import PickerWithNoInput from "../../../common/utils/form/uncontrolled/PickerWithNoInput.jsx";
import Dialog from "../../../common/utils/Dialogue";

import useSchedules from "../../hooks/useSchedules";
import useSettings from "../../hooks/useSettings";
import useLoading from "../../../common/hooks/useLoading";
import useCommonSettings from "../../../common/hooks/useSettings";

const NoHistory = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const { loading } = useLoading();
  const { setFirstSchedule, schedules } = useSchedules();
  const { max_days } = useSettings();
  const { admin } = useCommonSettings();
  if (schedules.length > 0 || loading.dates) return null;

  const handleOpe = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onAcceptDate = async (d) => {
    if (!d) return;
    const { error: err } = await setFirstSchedule(
      d.$d.toLocaleDateString("en-US")
    );
    setError(err);
  };

  return (
    <Middle mt={10}>
      <EventBusyIcon />
      <Typography my={1}>No Record</Typography>
      {error && (
        <Middle>
          <ReportProblemIcon color="error" />
          <Typography
            my={1}
            mx={4}
            color="error"
            textAlign="center"
            sx={{ wordBreak: "normal" }}
          >
            {error}
          </Typography>
        </Middle>
      )}
      {admin && (
        <>
          <Button sx={{ mb: 4 }} onClick={handleOpe}>
            Generate First Schedule
          </Button>
          <Dialog
            TransitionProps={{ direction: "right" }}
            TransitionComponent={Slide}
            open={open}
            onClose={handleClose}
          >
            <Typography p={2} variant="h6">
              Choose Start Date
            </Typography>
            <Divider />
            <Typography
              p={2}
              fontSize="large"
              color="text.secondary"
              sx={{ wordBreak: "normal" }}
            >
              From this date, every subsequent schedule will automatically begin
              from where the previous ended, with maximum 30 days difference.
            </Typography>
            <Typography p={2} fontSize="large" sx={{ wordBreak: "normal" }}>
              Make sure to be OK with the current schedule interval, {max_days}{" "}
              days. Otherwise go to settings and change before generating.
            </Typography>
            <Typography p={2} fontSize="large" sx={{ wordBreak: "normal" }}>
              You may need to make a lot of changes on the first schedule since
              it's completely random.
            </Typography>
            <PickerWithNoInput
              onAccept={onAcceptDate}
              onClose={handleClose}
              defaultValue={dayjs(new Date())}
            />
          </Dialog>
        </>
      )}
    </Middle>
  );
};

export default NoHistory;
