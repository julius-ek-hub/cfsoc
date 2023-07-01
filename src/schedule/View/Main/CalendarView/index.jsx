import { Fragment, useState, useEffect } from "react";

import dayjs from "dayjs";

import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";

import Edit from "@mui/icons-material/Edit";
import Close from "@mui/icons-material/Close";
import CommentIcon from "@mui/icons-material/Comment";

import { DateCalendar } from "../../../../common/utils/form/uncontrolled/PickerWithNoInput.jsx";

import Worker from "../Editor/Worker";
import Menu from "../../../../common/utils/Menu";
import Middle from "../../../../common/utils/Middle";
import IconButton from "../../../../common/utils/IconButton";
import Accordion from "../../../../common/utils/Accordion";

import useActiveSchedule from "../../../hooks/useSchedules/active";
import useSchedules from "../../../hooks/useSchedules";
import useDimension from "../../../../common/hooks/useDimensions";
import useCommonSettings from "../../../../common/hooks/useSettings";

import {
  staffs_in_shift,
  int_to_time as itt,
  schedule_date_range_ui,
  has_comments,
} from "../../../utils/utils";

const CalendarView = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState([]);
  const { active, active_assiduity, active_by } = useActiveSchedule();
  const { shifts, statuses } = useSchedules();
  const { getName } = useCommonSettings();
  const { up, t } = useDimension();

  const handleChange = ({ $d }) => {
    setSelected(new Date($d).toLocaleDateString("en-US"));
    setChecked([]);
  };

  const handleCheck = (v) => {
    const c = [...checked];
    if (c.find((s) => s.staff === v.staff))
      return setChecked(c.filter((c) => c.staff !== v.staff));
    c.push(v);
    setChecked(c);
  };

  const handleClose = () => {
    setOpen(false);
    setChecked([]);
  };

  const closeDrawer = () => {
    handleClose();
    setSelected(null);
  };

  const selectedStaffs = ({ from, to }) => {
    return active_assiduity
      .filter(({ dates }) =>
        dates.some(
          (d) =>
            d.date === selected && d.shift.from === from && d.shift.to === to
        )
      )
      .map(({ staff, dates }) => ({
        staff,
        name: getName(staff).split(" ")[0],
        status: dates.find((d) => d.date === selected).status,
        dateIndex: dates.findIndex((d) => d.date === selected),
        comments: dates.find((d) => d.date === selected).comments,
      }));
  };

  useEffect(() => {
    closeDrawer();
  }, [active_by]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        userSelect: "none",
        overflow: "auto",
        overflowX: "hidden",
        width: "100%",
        display: "flex",
      }}
    >
      <Box flexGrow={1}>
        <DateCalendar
          minDate={dayjs(active.from)}
          maxDate={dayjs(active.to)}
          onChange={handleChange}
          sx={{
            "&.MuiDateCalendar-root": {
              width: "100%",
              maxHeight: "unset",
              height: "100%",
              display: "flex",
              overflow: "auto",
              "& .MuiPickersCalendarHeader-root": {
                ml: 9,
                mr: 9,
                mb: 4,
              },
              "& .MuiYearCalendar-root": {
                width: "100%",
                maxHeight: "50%",
              },
              "& .MuiDayCalendar-weekContainer, & .MuiDayCalendar-header": {
                justifyContent: "space-around",
              },
              "& .MuiPickersFadeTransitionGroup-root": {
                flexGrow: 1,
                "& > div": {
                  height: "100%",
                  "& > div": {
                    height: "100%",
                  },
                  "& .MuiPickersSlideTransition-root": {
                    height: "100%",
                  },
                  "& .MuiDayCalendar-monthContainer": {
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                  },
                  "& .MuiDayCalendar-weekContainer": {
                    height: 60,
                  },
                  "& .MuiPickersDay-root": {
                    height: 60,
                    width: 60,
                    fontSize: "1em",
                  },
                },
              },
            },
          }}
        />
      </Box>
      <Drawer open={Boolean(selected)} anchor="right" onClose={closeDrawer}>
        <Box
          width={up.sm ? 400 : 300}
          height="100%"
          overflow="auto"
          borderLeft={`1px solid ${t.palette.divider}`}
        >
          <Box
            py={1}
            position="sticky"
            top={0}
            bgcolor="background.paper"
            zIndex={20}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              m={2}
            >
              {schedule_date_range_ui(selected)[0]}
              <Box>
                {checked.length > 0 && (
                  <Menu
                    open={open}
                    onClose={handleClose}
                    Clickable={(props) => (
                      <IconButton
                        Icon={Edit}
                        size="small"
                        sx={{ mr: 2 }}
                        onClick={(e) => {
                          props.onClick(e);
                          setOpen(true);
                        }}
                      />
                    )}
                  >
                    <Worker
                      onClose={handleClose}
                      selected={checked.map(({ dateIndex, staff }) => ({
                        dateIndex,
                        staff,
                      }))}
                    />
                  </Menu>
                )}
                <IconButton Icon={Close} onClick={closeDrawer} />
              </Box>
            </Box>
          </Box>
          {shifts.map((shift, i) => {
            const ass = staffs_in_shift(shift, active_assiduity);
            const staffs = selectedStaffs(shift);
            return (
              ass.length > 0 &&
              staffs.length > 0 && (
                <Fragment key={shift.from + shift.to}>
                  <Box
                    display="flex"
                    alignItems="center"
                    bgcolor="primary.main"
                    color="common.white"
                    p={1}
                    mt={1}
                    position="sticky"
                    top={85}
                    zIndex={90}
                  >
                    {itt(shift.from)}
                    <Typography px={1}>&#8212;</Typography>
                    {itt(shift.to)}
                    <Typography ml={2}>{shift.label}</Typography>
                  </Box>
                  {staffs.map((ss) => {
                    const st = statuses.find((s) => s.name === ss.status);
                    const comm = Object.entries(ss.comments);
                    return (
                      <Fragment key={ss.staff}>
                        <MenuItem onClick={() => handleCheck(ss)}>
                          <Checkbox
                            checked={Boolean(
                              checked.find((c) => c.staff === ss.staff)
                            )}
                          />
                          {ss.name}
                          <Typography px={1}>&#8212;</Typography>
                          <Middle
                            height={15}
                            width={15}
                            bgcolor={st.color}
                            title={st.name}
                            mr={1}
                            borderRadius={7.5}
                            border={(t) => `1px solid ${t.palette.divider}`}
                            fontSize={8}
                          >
                            {st.label}
                          </Middle>
                        </MenuItem>
                        {has_comments(ss.comments) && (
                          <Box
                            borderLeft={`2px solid ${t.palette.divider}`}
                            ml={4.5}
                          >
                            <Accordion
                              TitltIcon={CommentIcon}
                              title={
                                <>
                                  Comments &#8212;{" "}
                                  {comm.filter(([k, v]) => v).length}
                                </>
                              }
                              sx={{ mt: 0 }}
                              no_divider
                            >
                              {comm.map(
                                ([k, v]) =>
                                  v && (
                                    <Box
                                      key={k}
                                      border={`1px solid ${t.palette.divider}`}
                                      p={1.5}
                                      borderRadius={2}
                                      mb={1}
                                    >
                                      <Box
                                        display="flex"
                                        alignItems="center"
                                        gap={1}
                                        mb={1}
                                      >
                                        <Avatar
                                          sx={{ height: 20, width: 20 }}
                                        />{" "}
                                        {getName(k).split(" ")[0]}
                                      </Box>
                                      <Typography>{v}</Typography>
                                    </Box>
                                  )
                              )}
                            </Accordion>
                          </Box>
                        )}
                      </Fragment>
                    );
                  })}
                </Fragment>
              )
            );
          })}
        </Box>
      </Drawer>
    </Box>
  );
};

export default CalendarView;
