import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import TextField from "../../../common/utils/form/uncontrolled/TextField";

import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";

import AutoComplete from "../../../common/utils/form/uncontrolled/AutoComplete";
import IconButton from "../../../common/utils/IconButton";
import Menu from "../../../common/utils/Menu";

import {
  _l,
  field_separator as fs,
  default_styles,
  entr_,
  _entr,
  objectExcept,
} from "../../utils/utils";

import useSheet from "../../hooks/useSheet";
import useFetch from "../../../common/hooks/useFetch";
import useToasts from "../../../common/hooks/useToast";

function RenameColumn({ column }) {
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [styles, setStyles] = useState({});
  const [applyAll, setApplyAll] = useState(false);
  const { active_sheet, updateSheet } = useSheet();
  const { patch } = useFetch("/expo-sentinel");
  const { push } = useToasts();

  const { key, columns } = active_sheet;
  const __styles = objectExcept({ ...default_styles }, [
    "verticalAlign",
    "textAlign",
  ]);

  const exists = _entr(columns)
    .filter(([k, v]) => k !== column)
    .find(([k, v]) => _l(v.label) === _l(newName));

  const revert = () => {
    setStyles(entr_(_entr({ ...__styles }).map(([k, v]) => [k, v.default])));
  };

  const save = async () => {
    if (!newName || exists) return;

    const { json: j1 } = await patch(`/update-structure`, [
      [key, { [`columns.${column}.label`]: newName }],
    ]);
    let for_stlying = [column];
    if (applyAll) for_stlying = Object.keys(columns);

    const { json: j2 } = await patch(`/update-structure`, [
      [key, entr_(for_stlying.map((fs) => [`columns.${fs}.sx`, styles]))],
    ]);

    if (j1.error || j2.error)
      return push({ message: json.error, severity: "error" });

    updateSheet(`${key + fs}columns${fs + column + fs}label`, newName);
    for_stlying.map((fs_) => {
      updateSheet(`${key + fs}columns${fs + fs_ + fs}sx`, styles);
    });
    push({ message: "Changes applied", severity: "success" });

    setOpen(false);
  };

  const handleStyleChange = (k, v) => {
    setStyles({ ...styles, [k]: v || __styles[k].default });
  };

  useEffect(() => {
    if (open) {
      setNewName(columns[column].label);
      const sx = columns[column].sx || {};
      setStyles(
        entr_(_entr({ ...__styles }).map(([k, v]) => [k, sx[k] || v.default]))
      );
    }
  }, [open]);

  return (
    <Box visibility="hidden">
      <Menu
        open={open}
        no_tip
        onClose={() => setOpen(false)}
        Clickable={(props) => (
          <IconButton
            title="Edit Column"
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
        <Box p={2} width={300}>
          <TextField
            fullWidth
            size="small"
            margin="dense"
            label="Column Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            {...(exists && {
              error: true,
              helperText: "Column name exists",
            })}
          />
          <InputLabel
            sx={{
              mt: 3,
              mb: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            Style:
            <IconButton
              Icon={SettingsBackupRestoreIcon}
              title="Revert to original"
              onClick={revert}
            />
          </InputLabel>
          {_entr(__styles).map(([k, v]) =>
            v.type === "list" ? (
              <AutoComplete
                sx={{ my: 2 }}
                key={k}
                size="small"
                options={v.value}
                value={styles[k] || ""}
                multiple={false}
                label={v.label}
                onChange={(e, value) => handleStyleChange(k, value)}
              />
            ) : (
              <TextField
                fullWidth
                onChange={(e) => handleStyleChange(k, e.target.value)}
                key={k}
                size="small"
                value={styles[k] || ""}
                margin="dense"
                type={v.type}
                label={v.label}
              />
            )
          )}
          <Checkbox checked={applyAll} onChange={(e, v) => setApplyAll(v)} />{" "}
          Apply style to all columns
          <Box display="flex" justifyContent="end" mt={1}>
            {newName && !exists && <Button onClick={save}>Save</Button>}
          </Box>
        </Box>
      </Menu>
    </Box>
  );
}

export default RenameColumn;
