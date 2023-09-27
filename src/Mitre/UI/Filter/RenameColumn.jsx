import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";

import IconButton from "../../../common/utils/IconButton";
import Menu from "../../../common/utils/Menu";

import { _l, field_separator as fs } from "../../utils/utils";

import useSheet from "../../hooks/useSheet";
import useFetch from "../../../common/hooks/useFetch";
import useToasts from "../../../common/hooks/useToast";

const _entr = (o) => Object.entries(o);

function RenameColumn({ column }) {
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const { active_sheet, updateSheet } = useSheet();
  const { patch } = useFetch("/ucm");
  const { push } = useToasts();

  const { key, columns, content } = active_sheet;

  const exists = _entr(columns)
    .filter(([k, v]) => k !== column)
    .find(([k, v]) => _l(v.label) === _l(newName));

  const same = _l(newName) === _l(columns[column].label);

  const save = async () => {
    if (!newName || exists || same) return;

    const { json } = await patch(`/update-structure`, [
      [
        key,
        {
          [`columns.${column}.label`]: newName,
        },
      ],
    ]);
    if (json.error) return push({ message: json.error, severity: "error" });

    updateSheet(`${key + fs}columns${fs + column + fs}label`, newName);
    push({ message: "Column renamed", severity: "success" });

    setOpen(false);
  };

  useEffect(() => {
    if (open) setNewName(columns[column].label);
  }, [open]);

  return (
    <Box visibility="hidden">
      <Menu
        open={open}
        onClose={() => setOpen(false)}
        Clickable={(props) => (
          <IconButton
            title="Rename Column"
            Icon={DriveFileRenameOutlineIcon}
            size="small"
            sx={{ ml: 0.5 }}
            onClick={(e) => {
              setOpen(true);
              props.onClick(e);
            }}
          />
        )}
      >
        <Box p={2} display="flex" gap={1}>
          <TextField
            size="small"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            {...(exists && {
              error: true,
              helperText: "Column name exists",
            })}
          />
          {newName && !exists && !same && <Button onClick={save}>Save</Button>}
        </Box>
      </Menu>
    </Box>
  );
}

export default RenameColumn;
