import { useEffect, useState } from "react";
import { alpha } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import IconButton from "../../../common/utils/IconButton";
import Menu from "../../../common/utils/Menu";

import useDimension from "../../../common/hooks/useDimensions";

import { entr_ } from "../../utils/utils";

export default function Filter({ column, filterValues, onChange, columns }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState([]);
  const [max_scroll, setMaxScroll] = useState(50);
  const [values, setValues] = useState([]);

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

  const final = equal_arrays(selected, values)
    ? []
    : searched.filter((s) => selected.includes(s));

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
    onChange(column, final);

    handleClose();
  };

  const handleScroll = (e) => {
    const el = e.target;
    const totalScroll = Math.round(el.scrollTop + el.clientHeight + 10);
    if (totalScroll > el.scrollHeight) setMaxScroll(max_scroll + 5);
  };

  useEffect(() => {
    if (open) {
      setValues(filterValues.map((v) => String(v)));
      setSelected(final);
      setMaxScroll(50);
    }
  }, [open]);

  return (
    <Menu
      open={open}
      backdrop_color={alpha(t.palette.background.paper, 0.5)}
      onClose={handleClose}
      Clickable={(props) => (
        <IconButton
          Icon={FilterAltIcon}
          title="Filter"
          size="small"
          sx={{ visibility: final.length === 0 ? "hidden" : "visible" }}
          iprop={{ sx: { width: 20, height: 20, color: "text.secondary" } }}
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
          placeholder={`Search ${entr_(columns)[column].label}...`}
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
