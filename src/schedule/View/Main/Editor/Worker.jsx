import { useState } from "react";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";

import Edit from "@mui/icons-material/Edit";
import MessageIcon from "@mui/icons-material/Message";

import {
  int_to_time as itt,
  schedule_date_range_ui as sdru,
} from "../../../utils/utils";
import { u } from "../../../../common/utils/utils";

import useSchedules from "../../../hooks/useSchedules";
import useActiveSchedule from "../../../hooks/useSchedules/active";
import useSelection from "../../../hooks/useSelection";
import useCommonSettings from "../../../../common/hooks/useSettings";
import useSettings from "../../../hooks/useSettings";

const Sel = ({ options, label, value, id, onSelect }) => {
  const handleChange = (e) => onSelect(id, e.target.value);

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select value={value} label={label} onChange={handleChange} size="small">
        {options.map((op, i) => (
          <MenuItem value={i} key={op}>
            {op}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const Ta = ({ staffs, comments, onChange }) => {
  const [show, setShow] = useState(0);
  const { uname } = useCommonSettings();
  const handleChange = (event, newValue) => {
    setShow(newValue);
  };
  const handleTextChange = (e, i) => {
    const val = [...comments];
    val[i] = e.target.value;
    onChange(
      "comments",
      Object.fromEntries(staffs.map((staff, i) => [staff, val[i]]))
    );
  };
  return (
    <Box overflow="auto" width="100%">
      <FormLabel>
        Comments <Edit fontSize="small" />
      </FormLabel>
      <Tabs
        onChange={handleChange}
        allowScrollButtonsMobile
        variant="scrollable"
        scrollButtons
        value={show}
        sx={{
          mt: 1,
          minHeight: "unset",
          ".MuiButtonBase-root": {
            p: 0.6,
            minHeight: "unset",
          },
        }}
      >
        {staffs.map((k, i) => (
          <Tab
            label={k === uname ? "You" : u(k.split(".")[0])}
            key={k}
            iconPosition="start"
            {...(comments[i] && {
              icon: <MessageIcon fontSize="small" />,
            })}
          />
        ))}
      </Tabs>
      {staffs.map((staff, i) => (
        <FormControl
          key={staff}
          fullWidth
          margin="dense"
          sx={{ display: show === i ? "flex" : "none" }}
        >
          <TextField
            multiline
            placeholder={staff === uname ? "Type here" : "[Read-Only]"}
            disabled={staff !== uname}
            minRows={5}
            maxRows={10}
            onChange={(e) => handleTextChange(e, i)}
            value={comments[i]}
          />
        </FormControl>
      ))}
    </Box>
  );
};

const Worker = ({ onClose, selected }) => {
  const { shifts: s, statuses: ss } = useSchedules();
  const { view } = useSettings();
  const { uname } = useCommonSettings();
  const { active_by, active, updateSuggestions } = useActiveSchedule();
  const { unselectAll } = useSelection();
  const statuses = ["None", ...ss.map((s) => s.name)];

  let shifts = [
    "None",
    ...s.map(
      ({ from, to, label }) =>
        itt(from) + " - " + itt(to) + (label ? " (" + label + ")" : "")
    ),
  ];

  const ass = active.suggestions[active_by].assiduity;

  const all = selected.map(({ dateIndex, staff }) => {
    const assIndex = ass.findIndex((a) => a.staff === staff);
    const date = ass[assIndex].dates[dateIndex];
    const shift = date.shift;
    const shiftIndex = s.findIndex(
      (i) => i.from === shift.from && i.to === shift.to
    );
    return {
      assIndex,
      dateIndex,
      date: date.date,
      status: date.status,
      shift: shift,
      staff,
      comments: date.comments,
      shiftIndex,
    };
  });

  let comments = all[0]?.comments;
  let selected_date = sdru(all[0]?.date || "12/09/1998")[0].split(",")[0];
  let selected_staff = u(all[0] ? all[0].staff.split(".")[0] : "--");

  const same_shift = new Set(all.map((a) => a.shiftIndex)).size === 1;

  if ([...new Set(all.map((d) => d.date))].length > 1)
    selected_date = "Selected dates";

  if (all.length > 1) selected_staff = "Selected staffs";

  const [state, _setState] = useState({
    status: 0,
    shift: 0,
    comments,
  });

  if (all.length === 0) return null;

  const __setState = (key, value) => _setState({ ...state, [key]: value });

  const onChange = () => {
    const all_updates = all
      .map((each) => {
        const updates = {};
        const dateIndex = each.dateIndex;
        const ind = ass.findIndex((a) => a.staff === each.staff);
        const mainKey = `suggestions@${active_by}@assiduity@${ind}@dates@${dateIndex}`;
        const _newStatus = statuses[state.status];
        const _newComments = state.comments;
        const _newShift = s[state.shift - 1];

        if (state.comments[uname] !== each.comments[uname])
          updates[`${mainKey}@comments`] = _newComments;
        if (state.shift !== each.shiftIndex && same_shift && state.shift !== 0)
          updates.shift = { assIndex: ind, dateIndex, shift: _newShift };
        if (_newStatus !== each.status && state.status !== 0)
          updates[`${mainKey}@status`] = _newStatus;

        return Object.keys(updates).length > 0 ? updates : undefined;
      })
      .filter((u) => u);

    if (all_updates.length > 0) updateSuggestions(all_updates);
    view === "table" && unselectAll();
    onClose();
  };

  return (
    <Box
      minWidth={340}
      maxWidth={350}
      minHeight={400}
      p={2}
      display="flex"
      flexDirection="column"
      gap={2}
    >
      <Typography sx={{ wordBreak: "normal", mb: 1 }}>
        Apply the following changes to selected dates/staffs
      </Typography>
      {active_by === uname && (
        <>
          <Sel
            options={statuses}
            label="Status"
            id="status"
            value={state.status}
            onSelect={__setState}
          />
          {same_shift && (
            <Sel
              id="shift"
              value={state.shift}
              onSelect={__setState}
              options={shifts}
              label={`From ${selected_date}, Move ${selected_staff} to:`}
            />
          )}
        </>
      )}
      <Ta
        staffs={Object.keys(state.comments)}
        comments={Object.values(state.comments)}
        onChange={__setState}
      />
      <Stack direction="row" justifyContent="flex-end" mt="auto">
        <Button onClick={onClose}>Cencel</Button>
        <Button onClick={onChange}>Apply</Button>
      </Stack>
    </Box>
  );
};

export default Worker;
