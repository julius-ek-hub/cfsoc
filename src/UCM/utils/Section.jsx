import { useEffect, useState } from "react";

import { useNavigate, useLocation } from "react-router-dom";

import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";

import IconButton from "../../common/utils/IconButton";

import Pagination from "../utils/Pagination";
import MyMenu from "../../common/utils/Menu";

import useSheet from "../hooks/useSheet";
import useFetch from "../../common/hooks/useFetch";

import { field_separator as fs, _entr } from "./utils";
import useSettings from "../hooks/useSettings";
import Confirm from "../../common/utils/Comfirm";

const Menu = ({ sheet }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const {
    updateSheet,
    deleteSheet,
    sheet_names_except_current,
    sheet_names,
    important_sheets,
  } = useSheet();
  const { patch, dlete } = useFetch("/ucm");

  const navigate = useNavigate();
  const { search } = useLocation();
  const { updateSettings } = useSettings();

  const name_exists = sheet_names_except_current.some((s) => s.name === name);

  let prevSheet = sheet_names[sheet.index - 1];
  if (!prevSheet) prevSheet = sheet_names.at(-1);

  const hanldeClose = () => {
    setOpen(false);
    setName(sheet.name);
  };

  const handleChange = async () => {
    if (sheet.name !== name && !name_exists && name) {
      const { json } = await patch("/sheets", {
        key: sheet.key,
        update: { name },
      });

      if (!json.error) updateSheet(`${sheet.key + fs}name`, name);
    }

    hanldeClose();
  };

  const handleDelete = async () => {
    const { json } = await dlete(`/sheets/${sheet.key}`);

    navigate("/use-case-management/" + (prevSheet?.key || "") + search);
    !json.error && deleteSheet(sheet.key);

    setOpen(false);
  };

  const repositionColumn = (dir = 1) => {
    const entr = [...sheet_names].map((sn, index) => {
      const _v = { ...sn };
      _v.location = index;
      return _v;
    });
    const getInd = (ind) =>
      ind > entr.length - 1 ? 0 : ind < 0 ? entr.length - 1 : ind;

    const _col = entr.findIndex((e) => e.key === sheet.key);
    const op1 = entr[_col].location;
    const _next_ind = getInd(_col + dir);
    const op2 = entr[_next_ind].location;
    entr[_col].location = getInd(op1 + dir);
    entr[_next_ind].location = getInd(op2 - dir);

    entr.map((e) => updateSheet(`${e.key + fs}location`, e.location));
  };

  const beginRepositoning = (dir) => {
    repositionColumn(dir);
    updateSettings("changed", true);
    hanldeClose();
  };

  useEffect(() => {
    setName(sheet.name);
  }, [sheet]);

  return (
    <MyMenu
      no_tip
      open={open}
      onClose={hanldeClose}
      Clickable={(props) => (
        <Box
          color="inherit"
          visibility="hidden"
          onClick={(e) => {
            setOpen(true);
            props.onClick(e);
          }}
        >
          <MoreVertIcon />
        </Box>
      )}
    >
      <Box width={250} p={2}>
        <TextField
          label="Rename sheet"
          value={name}
          onChange={(e) => {
            e.stopPropagation();
            setName(e.target.value);
          }}
          fullWidth
          size="small"
          margin="dense"
          {...(name_exists && {
            helperText: "Sheet name exists",
            error: true,
          })}
        />
        {sheet_names.length > 1 && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mt={1}
          >
            <IconButton
              Icon={KeyboardArrowLeftIcon}
              title="to the left"
              onClick={() => beginRepositoning(-1)}
            />
            Move sheet
            <IconButton
              Icon={KeyboardArrowRightIcon}
              title="to the right"
              onClick={() => beginRepositoning(1)}
            />
          </Box>
        )}

        <Box display="flex" justifyContent="end" mt={2} gap={1}>
          {!important_sheets.includes(sheet.key) && (
            <Confirm
              onConfirm={handleDelete}
              ok_color="error"
              ok_text="Yes"
              Clickable={(props) => (
                <Button
                  size="small"
                  color="error"
                  sx={{ justifyContent: "start" }}
                  {...props}
                >
                  Delete
                </Button>
              )}
            >
              Delete {name}?
            </Confirm>
          )}
          <Button
            disabled={name_exists}
            onClick={handleChange}
            size="small"
            variant="contained"
            sx={{ justifyContent: "start" }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </MyMenu>
  );
};

const Sections = () => {
  const { sheet_names, addSheet, active_sheet, active_content } = useSheet();
  const { post } = useFetch("/ucm");

  const navigate = useNavigate();
  const { updateSheet } = useSheet();

  const handleChange = (_, newSection) => {
    navigate("/use-case-management/" + newSection);
    updateSheet(`${newSection + fs}filters`, {});
  };

  const { key } = active_sheet || {};

  const addBlanc = async () => {
    let max = sheet_names.map((sh, i) => {
      const last_num = sh.key.split("_").at(-1);
      return Number(isNaN(last_num) ? i : last_num);
    });

    if (max.length === 0) max = [0];

    const { json } = await post("/sheets", [`Sheet ${Math.max(...max) + 1}`]);

    if (json.error) return;

    const sheet = json[0];
    if (sheet.error) return;

    addSheet({
      ...sheet,
      content: [],
      pagination: {},
      filters: {},
      excluded_columns: [],
      selected: [],
      columns: {},
      user_added: true,
    });

    navigate("/use-case-management/" + sheet.key);
  };

  return (
    <Box display="flex" alignItems="center" pr={6} position="relative">
      {sheet_names.length > 0 && (
        <Tabs
          variant="scrollable"
          onChange={handleChange}
          value={active_sheet ? key : ""}
          scrollButtons={true}
          sx={{ "& .MuiTab-root": { minHeight: "unset" } }}
        >
          {sheet_names.map(
            ({ key, name, location, locked, user_added }, index) => (
              <Tab
                label={name}
                value={key}
                key={key}
                {...(!locked && {
                  icon: (
                    <Menu sheet={{ key, name, location, index, user_added }} />
                  ),
                  iconPosition: "end",
                  sx: {
                    "&:hover > div": {
                      visibility: "visible",
                    },
                  },
                })}
              />
            )
          )}
        </Tabs>
      )}
      <HorizontalRuleIcon sx={{ transform: "rotate(90deg)" }} />
      <Button
        sx={{
          whiteSpace: "nowrap",
          flexShrink: 0,
          ...(sheet_names.length === 0 && { m: 3 }),
        }}
        color="inherit"
        endIcon={<AddIcon />}
        size="small"
        onClick={addBlanc}
      >
        Add New
      </Button>
      {active_sheet && (
        <>
          <HorizontalRuleIcon sx={{ transform: "rotate(90deg)" }} />
          <Pagination __key={`${key + fs}content`} content={active_content} />
        </>
      )}
    </Box>
  );
};

export default Sections;
