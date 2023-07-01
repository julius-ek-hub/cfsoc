import { lighten, darken } from "@mui/material/styles";

import { Link } from "react-router-dom";

import List from "@mui/material/List";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import ListItemMUI from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";

import HistoryIcon from "@mui/icons-material/EventRepeat";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditIcon from "@mui/icons-material/Edit";

import NoHistory from "./NoHistory";
import LoadingHistory from "./LoadingHistory";

import useSchedules from "../../hooks/useSchedules";
import useDimension from "../../../common/hooks/useDimensions";
import useActiveSchedule from "../../hooks/useSchedules/active";
import useSettings from "../../hooks/useSettings";
import useLoading from "../../../common/hooks/useLoading";
import useCommonSettings from "../../../common/hooks/useSettings";

import { schedule_date_range_ui, next_or_current } from "../../utils/utils";

const Sticky = ({ label, icon }) => (
  <Toolbar
    sx={{
      position: "sticky",
      top: 0,
      bgcolor: "background.paper",
      zIndex: 2,
      alignItems: "center",
      gap: 1,
      borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
    }}
  >
    <Box display="flex">{icon}</Box> {label}
  </Toolbar>
);

const ListItem = ({ icon, label, sx, to, ...rest }) => {
  const comp = (
    <ListItemMUI disablePadding sx={sx} {...rest}>
      <ListItemButton>
        <ListItemIcon sx={{ minWidth: "33px" }}>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItemMUI>
  );
  return to ? <Link to={to}>{comp}</Link> : comp;
};

function History() {
  const { schedules, nextSchedule } = useSchedules();
  const { active } = useActiveSchedule();
  const { t } = useDimension();
  const { max_days } = useSettings();
  const { admin } = useCommonSettings();
  const { loading } = useLoading();

  const url_b = "/schedules/";

  const openTo = (to) => {
    return ["next", "current"].includes(to)
      ? `${url_b + to}`
      : `${url_b + to.replaceAll("/", "-")}`;
  };

  const find = (what) => {
    return schedules.find((s) => next_or_current(s.from, s.to, max_days)[what]);
  };

  const has_next = find("next");
  const current = find("current");

  const DAY = 1000 * 60 * 60 * 24;

  let remaining = null;

  if (current && !has_next) {
    const day_t = new Date(current.to).getTime() / DAY;
    remaining = Math.floor(day_t - new Date().getTime() / DAY);
  }

  return (
    <>
      <MenuItem
        sx={{ py: 2, flexWrap: "wrap", justifyContent: "space-between" }}
      >
        {!has_next && schedules.length > 0 && (
          <>
            Next schedule in {remaining} days
            {admin && (
              <Button variant="contained" onClick={nextSchedule}>
                Generate now
              </Button>
            )}
          </>
        )}
      </MenuItem>
      <Sticky label="Schedules" icon={<HistoryIcon />} />
      <List>
        {schedules.map(({ to, from, type, draft }) => {
          const ss = schedule_date_range_ui(from, to);
          const nc = next_or_current(from, to);
          return (
            <ListItem
              to={!draft && openTo(`${from}_${to}`)}
              {...(active &&
                active.from === from &&
                active.to === to && {
                  sx: {
                    bgcolor: (t.palette.mode === "light" ? darken : lighten)(
                      t.palette.background.paper,
                      0.1
                    ),
                  },
                })}
              key={from + to + type}
              icon={nc.editable ? <EditIcon /> : <CalendarMonthIcon />}
              label={
                <>
                  {ss[0]} &#8212; {ss[1]}{" "}
                  {(nc.next || nc.current) && (
                    <Chip
                      label={nc.next ? "Next" : "Current"}
                      size="small"
                      color="primary"
                      sx={{ ml: 1 }}
                    />
                  )}
                </>
              }
            />
          );
        })}
      </List>
      {loading.dates ? <LoadingHistory /> : <NoHistory />}
    </>
  );
}

export default History;
