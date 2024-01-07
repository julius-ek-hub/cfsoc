import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DeleteIcon from "@mui/icons-material/Delete";

import Menu from "../../common/utils/Menu";
import TextField from "../../common/utils/form/uncontrolled/TextField";
import IconButton from "../../common/utils/IconButton";
import Confirm from "../../common/utils/Comfirm";

import useFetcher from "../hooks/useFetcher";
import useSheet from "../hooks/useSheet";
import useSettings from "../hooks/useSettings";

import { _l } from "../../common/utils/utils";

export default function MainFilterDropdown({ column }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const { addUCFilter, removeUCFilter } = useFetcher();
  const [newVal, setNewVal] = useState("");
  const { sheets, sp_filter, resetSP } = useSheet();
  const { settings } = useSettings();

  const { uc_filter = [] } = settings;

  const target_filter = uc_filter.find((ucf) => ucf.key === column);

  const options = [...target_filter.options];

  const { columns } = sheets.all_uc;

  const label = columns[column].label;

  const __input = options.filter((op) =>
    (sp_filter[column] || options).map((v) => _l(v)).includes(_l(op))
  );

  const handleClose = () => setOpen(!open);

  const equal_arrays = (a, b) => {
    return a.every((_a) => b.includes(_a)) && b.every((_b) => a.includes(_b));
  };

  const all_selected = equal_arrays(selected, options);

  const hasSelected = (v) => selected.includes(v);

  const handleSelect = (value) => {
    if (hasSelected(value))
      return setSelected(selected.filter((v) => v != value));
    setSelected([...selected, value]);
  };

  const handleSelectAll = () => {
    if (equal_arrays(selected, options)) return setSelected([]);
    setSelected(options);
  };

  const handleSave = () => {
    resetSP(
      column,
      equal_arrays(selected, options)
        ? undefined
        : options.filter((s) => selected.includes(s))
    );
    handleClose();
  };

  const handleAdd = () =>
    addUCFilter({ key: column, value: newVal }, () => setNewVal(""));

  const handleRemove = (value) =>
    removeUCFilter({ key: column, value }, () => setNewVal(""));

  useEffect(() => {
    setSelected(__input);
  }, [open, __input.join("")]);

  return (
    <Menu
      open={open}
      alpha={0.5}
      onClose={handleClose}
      Initiator={(props) => (
        <Chip
          label={
            <>
              {label} :{" "}
              <strong>
                {__input.length === 1
                  ? __input[0] || "Blanc"
                  : __input.length === options.length || __input.length === 0
                  ? "All"
                  : `${__input.length} Selected`}
              </strong>
            </>
          }
          variant="outlined"
          color="primary"
          onClick={(e) => {
            handleClose();
            props.onClick(e);
          }}
        />
      )}
    >
      <Box width={260} maxHeight={420} p={2} overflow="auto">
        <Typography mt={1} fontWeight="bold">
          {label}
        </Typography>
        <Box mt={1} maxHeight={250} overflow="auto">
          <Box
            sx={{
              position: "sticky",
              top: 0,
              bgcolor: "background.paper",
              zIndex: 1,
            }}
          >
            <Button
              onClick={() => handleSelectAll()}
              startIcon={
                all_selected ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />
              }
              color="inherit"
              fullWidth
              sx={{
                justifyContent: "start",
                whiteSpace: "nowrap",
                ...(all_selected && {
                  bgcolor: (t) => t.palette.action.hover,
                }),
              }}
              size="small"
            >
              {`(Select All)`}
            </Button>
          </Box>
          {options.sort().map((value, j) => (
            <Box
              key={j}
              whiteSpace="nowrap"
              sx={{
                width: "100%",
                overflow: "hidden",
              }}
            >
              <Button
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
                sx={{
                  justifyContent: "start",
                  whiteSpace: "nowrap",
                  ...(hasSelected(value) && {
                    bgcolor: (t) => t.palette.action.hover,
                  }),
                }}
                size="small"
              >
                {value || `(Blank)`}
              </Button>
            </Box>
          ))}
          <Box display="flex" mt={2} gap={1}>
            <TextField
              placeholder={`Add new..`}
              size="small"
              value={newVal}
              onChange={(e) => setNewVal(e.target.value)}
            />
            <Button color="inherit" onClick={handleAdd} size="small">
              Add
            </Button>
          </Box>
        </Box>
        <Box display="flex" mt={2} gap={1}>
          <Button
            variant="contained"
            sx={{ minWidth: 80 }}
            size="small"
            onClick={handleSave}
            disabled={selected.length === 0 || options.length === 0}
          >
            OK
          </Button>
          <Button color="inherit" onClick={handleClose} size="small">
            Cancel
          </Button>
        </Box>
      </Box>
    </Menu>
  );
}
