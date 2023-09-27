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

import IconButton from "../../common/utils/IconButton";

import Pagination from "../utils/Pagination";
import MyMenu from "../../common/utils/Menu";

import useSheet from "../hooks/useSheet";
import useFetch from "../../common/hooks/useFetch";

import { field_separator as fs, _entr } from "./utils";
import useSettings from "../hooks/useSettings";

const Menu = ({ sheet }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const {
    updateSheet,
    deleteSheet,
    sheet_names_except_current,
    sheet_names,
    sheets,
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

  const repositionSheet = (direction = 1) => {
    const _sheets = _entr(sheets);
    const len = _sheets.length;
    let newPos = sheets[sheet.key].location + direction;
    if (newPos < 0) newPos = len - 1;
    else if (newPos >= len) newPos = 0;
    updateSheet(`${sheet.key + fs}location`, newPos);
  };

  const beginRepositoning = (dir) => {
    repositionSheet(dir);
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
            <Button
              size="small"
              color="error"
              sx={{ justifyContent: "start" }}
              onClick={handleDelete}
            >
              Delete
            </Button>
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

  const { search } = useLocation();

  const handleChange = (_, newSection) => {
    navigate("/use-case-management/" + newSection + search);
  };

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
    });

    navigate("/use-case-management/" + sheet.key + search);
  };

  return (
    <Box display="flex" alignItems="center" pr={6} position="relative">
      {sheet_names.length > 0 && (
        <Tabs
          variant="scrollable"
          onChange={handleChange}
          value={active_sheet ? active_sheet.key : ""}
          scrollButtons={true}
          sx={{ "& .MuiTab-root": { minHeight: "unset" } }}
        >
          {sheet_names.map(({ key, name, location }, index) => (
            <Tab
              label={name}
              value={key}
              key={key}
              icon={<Menu sheet={{ key, name, location, index }} />}
              iconPosition="end"
              sx={{
                "&:hover > div": {
                  visibility: "visible",
                },
              }}
            />
          ))}
        </Tabs>
      )}
      <Button
        sx={{ whiteSpace: "nowrap", ...(sheet_names.length === 0 && { m: 3 }) }}
        color="inherit"
        endIcon={<AddIcon />}
        size="small"
        onClick={addBlanc}
      >
        Add New
      </Button>
      {active_sheet && (
        <Pagination
          __key={`${active_sheet.key + fs}content`}
          content={active_content}
        />
      )}
    </Box>
  );
};

export default Sections;
