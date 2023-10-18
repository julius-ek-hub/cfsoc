import { useEffect, useState } from "react";
import { alpha } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Typography from "@mui/material/Typography";

import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

import IconButton from "../../../common/utils/IconButton";
import Menu from "../../../common/utils/Menu";

import useDimension from "../../../common/hooks/useDimensions";
import useSheet from "../../hooks/useSheet";

import { field_separator } from "../../utils/utils";
import useFilter from "../../hooks/useFilter";

export default function Filter({ column }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState([]);
  const [max_scroll, setMaxScroll] = useState(50);
  const [values, setValues] = useState([]);

  const { unfiltered } = useFilter();

  const { active_sheet, updateSheet } = useSheet();

  const { key, filters, columns } = active_sheet;

  const { t } = useDimension();

  const handleClose = () => setOpen(!open);

  const isMatch = (value) => {
    return value.toLowerCase().indexOf(input.toLocaleLowerCase()) !== -1;
  };

  const equal_arrays = (a, b) => {
    return a.every((_a) => b.includes(_a)) && b.every((_b) => a.includes(_b));
  };

  const searched = values.filter(isMatch);

  const scrollValues = searched.slice(0, max_scroll);

  const filter = filters[column] || searched;

  const handleTextInput = (e) => setInput(e.target.value);

  const hasSelected = (v) => selected.includes(v);

  const handleSelect = (value) => {
    if (hasSelected(value))
      return setSelected(selected.filter((v) => v != value));
    setSelected([...selected, value]);
  };

  const handleSelectAll = () => {
    if (equal_arrays(selected, searched)) setSelected([]);
    else setSelected(searched);
  };

  const handleSave = () => {
    updateSheet(`${key + field_separator}filters`, {
      ...active_sheet.filters,
      [column]: equal_arrays(selected, values)
        ? undefined
        : searched.filter((s) => selected.includes(s)),
    });

    handleClose();
  };

  const handleScroll = (e) => {
    const el = e.target;
    const totalScroll = Math.round(el.scrollTop + el.clientHeight + 10);
    if (totalScroll > el.scrollHeight) setMaxScroll(max_scroll + 5);
  };

  useEffect(() => {
    if (open) {
      setValues([
        ...new Set(unfiltered.map((d) => String(d[column]?.value || ""))),
      ]);
      setSelected(filter);
      setMaxScroll(50);
    }
  }, [open]);

  return (
    <Menu
      no_tip
      open={open}
      backdrop_color={alpha(t.palette.background.paper, 0.5)}
      onClose={handleClose}
      Clickable={(props) => (
        <IconButton
          Icon={KeyboardArrowDownIcon}
          title="Filter"
          size="small"
          onClick={(e) => {
            handleClose();
            props.onClick(e);
          }}
        />
      )}
    >
      <Box width={300} maxHeight={420} p={2} overflow="auto">
        <Typography mt={1}>Text Filter</Typography>
        <TextField
          value={input}
          onChange={handleTextInput}
          onKeyDown={(e) => e.stopPropagation()}
          fullWidth
          size="small"
          placeholder={`Search ${columns[column].label}...`}
          margin="dense"
        />
        <Box mt={1} maxHeight={200} overflow="auto" onScroll={handleScroll}>
          <Box
            sx={{
              position: "sticky",
              top: 0,
              bgcolor: "background.paper",
              zIndex: 1,
            }}
          >
            {searched.length > 0 ? (
              <Button
                onClick={() => handleSelectAll()}
                startIcon={
                  equal_arrays(selected, searched) ? (
                    <CheckBoxIcon />
                  ) : (
                    <CheckBoxOutlineBlankIcon />
                  )
                }
                color="inherit"
                fullWidth
                sx={{
                  justifyContent: "start",
                  whiteSpace: "nowrap",
                }}
                size="small"
              >
                {`(Select All)`}
              </Button>
            ) : (
              <Typography>{`(No match)`}</Typography>
            )}
          </Box>
          {scrollValues.sort().map((value, j) => (
            <Button
              key={j}
              onClick={() => handleSelect(value)}
              startIcon={
                hasSelected(value) ? (
                  <CheckBoxIcon />
                ) : (
                  <CheckBoxOutlineBlankIcon />
                )
              }
              color="inherit"
              fullWidth
              sx={{ justifyContent: "start", whiteSpace: "nowrap" }}
              size="small"
            >
              {value || `(Blank)`}
            </Button>
          ))}
        </Box>
        <Box display="flex" justifyContent="flex-end" mt={1} gap={1}>
          <Button
            color="inherit"
            onClick={handleSave}
            disabled={selected.length === 0 || searched.length === 0}
          >
            OK
          </Button>
          <Button color="inherit" onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Menu>
  );
}
