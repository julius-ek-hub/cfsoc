import { useEffect, useMemo, useState } from "react";

import { useNavigate, useLocation } from "react-router-dom";

import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import CloseIcon from "@mui/icons-material/Close";

import IconButton from "../../common/utils/IconButton";
import Confirm from "../../common/utils/Comfirm";
import Pagination from "../utils/Pagination";
import MyMenu from "../../common/utils/Menu";
import TextField from "../../common/utils/form/uncontrolled/TextField";

import useSheet from "../hooks/useSheet";
import useFetch from "../../common/hooks/useFetch";
import useSettings from "../hooks/useSettings";
import useDimension from "../../common/hooks/useDimensions";
import UseCommonSettings from "../../common/hooks/useSettings";

import { field_separator as fs, _entr, _u } from "./utils";
import { Avatar } from "@mui/material";

const Menu = ({ sheet }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const { updateSheet, deleteSheet, sheet_names_except_current, sheet_names } =
    useSheet();
  const { patch, dlete } = useFetch("/expo-sentinel");

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

    navigate("/expo-sentinel/" + (prevSheet?.key || "") + search);
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
          position="absolute"
          ml={1}
          right={0}
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
          onChange={(e) => setName(e.target.value)}
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
  const { post } = useFetch("/expo-sentinel");
  const [open, setOpen] = useState(false);
  const { up } = useDimension();
  const { uname, getName } = UseCommonSettings();
  const navigate = useNavigate();
  const { updateSheet } = useSheet();

  const { key, num_rows = 0 } = active_sheet || {};

  const handleChange = (e, newSection) => {
    navigate("/expo-sentinel/" + newSection);
    updateSheet(`${newSection + fs}filters`, {});
  };

  const shouldDraw = useMemo(() => {
    if (up.lg) return false;
    if (up.md && num_rows <= 5000) return false;
    return true;
  }, [up]);

  const handleClose = () => setOpen(false);

  const addBlanc = async () => {
    let max = sheet_names.map((sh, i) => {
      const last_num = sh.key.split("_").at(-1);
      return Number(isNaN(last_num) ? i : last_num);
    });

    if (max.length === 0) max = [0];

    const { json } = await post(`/sheets?creator=${uname}`, [
      `Sheet ${Math.max(...max) + 1}`,
    ]);

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
      creator: uname,
      date_created: new Date().toUTCString(),
    });

    navigate("/expo-sentinel/" + sheet.key);
  };

  const Sheets = ({ orientation = "horizontal" }) => (
    <>
      {sheet_names.length > 0 && (
        <Tabs
          variant="scrollable"
          onChange={handleChange}
          value={active_sheet ? key : ""}
          scrollButtons={true}
          orientation={orientation}
        >
          {sheet_names.map((sn, index) => (
            <Tab
              label={
                <>
                  {sn.name}
                  <Avatar
                    title={`Created by ${getName(sn.creator)}`}
                    sx={{
                      height: 18,
                      width: 18,
                      ml: 0.5,
                      fontSize: "x-small",
                    }}
                  >
                    {getName(sn.creator)
                      .split(" ")
                      .map((n) => _u(n[0]))
                      .join("")}
                  </Avatar>
                </>
              }
              value={sn.key}
              key={sn.key}
              sx={{
                "&:hover > div": {
                  visibility: "visible",
                },
                position: "relative",
                ...(orientation === "vertical" && {
                  alignItems: "start!important",
                  justifyContent: "start!important",
                  ml: 1,
                }),
              }}
              iconPosition="end"
              {...((sn.creator === uname || uname === "system") && {
                icon: (
                  <Menu
                    sheet={{
                      ...sn,
                      index,
                    }}
                  />
                ),
              })}
            />
          ))}
        </Tabs>
      )}
      {uname !== "guest" && (
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
      )}
    </>
  );

  return (
    <Box display="flex" alignItems="center">
      {shouldDraw ? (
        <>
          <IconButton Icon={MenuOpenIcon} onClick={() => setOpen(true)} />
          <Drawer
            sx={{ ".MuiPaper-root": { width: "30%" } }}
            open={open}
            onClose={handleClose}
          >
            <Box display="flex" justifyContent="end" my={1} mr={2}>
              <IconButton Icon={CloseIcon} onClick={handleClose} />
            </Box>
            <Sheets orientation="vertical" />
          </Drawer>
        </>
      ) : (
        <Sheets />
      )}
      {active_sheet && (
        <Pagination __key={`${key + fs}content`} content={active_content} />
      )}
    </Box>
  );
};

export default Sections;
