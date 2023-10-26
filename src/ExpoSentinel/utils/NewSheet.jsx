import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import AddIcon from "@mui/icons-material/Add";

import TextField from "../../common/utils/form/uncontrolled/TextField";
import Dialog from "../../common/utils/Dialogue";

import useSheet from "../hooks/useSheet";
import useFetch from "../../common/hooks/useFetch";
import useToasts from "../../common/hooks/useToast";
import useCommonSettings from "../../common/hooks/useSettings";

function NewSheet() {
  const [open, setOpen] = useState(false);
  const [newSheet, setNewName] = useState("");
  const [description, setDescription] = useState("");
  const { sheet_names, addSheet } = useSheet();
  const { post } = useFetch("/expo-sentinel");
  const { push } = useToasts();
  const { uname } = useCommonSettings();
  const navigate = useNavigate();

  const invalid = newSheet && !newSheet.match(/[0-9a-z _]+/gi);

  const handleClose = () => setOpen(false);

  const addBlanc = async () => {
    let max = sheet_names.map((sh, i) => {
      const last_num = sh.key.split("_").at(-1);
      return Number(isNaN(last_num) ? i : last_num);
    });

    if (max.length === 0) max = [0];

    const { json } = await post(`/sheets?creator=${uname}`, [
      { sheet: newSheet, description },
    ]);

    if (json.error) return;

    const sheet = json[0];
    if (sheet.error) return;

    handleClose();

    addSheet({
      ...sheet,
      content: [],
      pagination: {},
      filters: {},
      description,
      excluded_columns: [],
      selected: [],
      columns: {},
      creator: uname,
      date_created: new Date().toUTCString(),
    });

    navigate("/expo-sentinel/" + sheet.key);
    push({ message: `${newSheet} added`, severity: "success" });
  };

  useEffect(() => {
    if (!open) {
      setNewName("");
      setDescription("");
    } else {
      let max = sheet_names.map((sh, i) => {
        const last_num = sh.key.split("_").at(-1);
        return Number(isNaN(last_num) ? i : last_num);
      });

      if (max.length === 0) max = [0];
      setNewName(`Sheet ${Math.max(...max) + 1}`);
    }
  }, [open]);

  return (
    <>
      <Button
        size="small"
        variant="contained"
        sx={{
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
        onClick={(e) => {
          setOpen(true);
        }}
        endIcon={<AddIcon />}
      >
        Create New
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        onXClose={handleClose}
        fullWidth
        title="Add new sheet"
        {...(newSheet &&
          !invalid && {
            action: (
              <Button variant="contained" onClick={addBlanc} sx={{ mt: 1 }}>
                Save
              </Button>
            ),
          })}
      >
        <Box p={2}>
          <TextField
            margin="dense"
            fullWidth
            size="small"
            value={newSheet}
            label="Sheet name"
            placeholder="Sheet name"
            onChange={(e) => setNewName(e.target.value)}
            {...(invalid && {
              error: true,
              helperText: "Use only characters from a-z, 0-9, _ and space",
            })}
          />

          <TextField
            multiline
            minRows={4}
            fullWidth
            size="small"
            margin="dense"
            label="Description"
            placeholder="Description"
            helperText="Optional"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>
      </Dialog>
    </>
  );
}

export default NewSheet;
