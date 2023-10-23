import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import MuiButton from "@mui/material/Button";

import TextField from "../../../../common/utils/form/uncontrolled/TextField";
import Menu from "../../../../common/utils/Menu";

import { _l, field_separator as fs } from "../../../utils/utils";

import useSheet from "../../../hooks/useSheet";
import useFetch from "../../../../common/hooks/useFetch";
import useToasts from "../../../../common/hooks/useToast";

const _entr = (o) => Object.entries(o);

function NewColumn({ Button }) {
  const [open, setOpen] = useState(false);
  const [newCol, setNewName] = useState("");
  const [newVal, setNewVal] = useState("");
  const { active_sheet, updateSheet } = useSheet();
  const { patch } = useFetch("/expo-sentinel");
  const { push } = useToasts();

  const { key, columns, content } = active_sheet;

  const exists = _entr(columns).find(([k, v]) => _l(v.label) === _l(newCol));
  const invalid = newCol && !newCol.match(/[0-9a-z _]+/gi);

  const save = async () => {
    if (!newCol || exists || invalid) return;
    const newContent = [];
    const _key = _l(newCol).split(" ").join("_");
    const _columns = {
      ...columns,
      [_key]: {
        label: newCol,
        default_value: newVal,
        key: _key,
        position: Object.keys(columns).length,
        user_added: true,
      },
    };

    const { json } = await patch(
      `/update-structure?add_column_${key}=${_key}`,
      [
        [
          key,
          {
            columns: _columns,
          },
        ],
      ]
    );

    if (json.error) return push({ message: json.error, severity: "error" });

    content.map((c) => newContent.push({ ...c, [_key]: { value: newVal } }));

    updateSheet(`${key + fs}columns`, _columns);
    updateSheet(`${key + fs}content`, newContent);
    push({ message: "Column added", severity: "success" });

    setOpen(false);
  };
  useEffect(() => {
    if (!open) {
      setNewName("");
      setNewVal("");
    }
  }, [open]);

  return (
    <Menu
      open={open}
      onClose={() => setOpen(false)}
      Clickable={(props) => (
        <Button
          onClick={(e) => {
            setOpen(true);
            props.onClick(e);
          }}
        />
      )}
    >
      <Box width={300} p={2}>
        <TextField
          onEnterButtonPressed={save}
          margin="dense"
          fullWidth
          size="small"
          value={newCol}
          label="Column name"
          placeholder="Columns name"
          onChange={(e) => setNewName(e.target.value)}
          {...(exists && {
            error: true,
            helperText: "Column name exists",
          })}
          {...(invalid && {
            error: true,
            helperText: "Use only characters from a-z, 0-9, _ and space",
          })}
        />

        <TextField
          onEnterButtonPressed={save}
          fullWidth
          size="small"
          margin="dense"
          label="Default value"
          placeholder="Default value"
          helperText="This would be applied automatically to all existing Use cases"
          value={newVal}
          onChange={(e) => setNewVal(e.target.value)}
        />
        {newCol && !exists && !invalid && (
          <MuiButton onClick={save} sx={{ mt: 1 }}>
            Save
          </MuiButton>
        )}
      </Box>
    </Menu>
  );
}

export default NewColumn;
