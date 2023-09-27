import { useState, useEffect } from "react";

import MuiButton from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import Dialog from "../../../common/utils/Dialogue";

import useAddModify from "../../hooks/useAddModify";

const OtherForm = ({ Button, edit }) => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({});

  const { cols, save, for_edit } = useAddModify();

  const df = for_edit(edit);

  const handleClose = () => setOpen(false);

  useEffect(() => {
    setValues(Object.fromEntries(cols.map(([k, v]) => [k, df[k]?.value])));
  }, [open]);

  return (
    <>
      <Button onClick={() => setOpen(true)} />
      <Dialog
        open={open}
        onXClose={handleClose}
        fullWidth
        title={edit ? `Edit` : `Add new`}
        action={
          <>
            <MuiButton color="inherit" onClick={handleClose}>
              Cancel
            </MuiButton>
            <MuiButton
              color="primary"
              variant="contained"
              onClick={(d) => save(values, edit, handleClose)}
            >
              Save
            </MuiButton>
          </>
        }
      >
        {cols.map(([k, v]) => (
          <TextField
            fullWidth
            onChange={(e) => setValues({ ...values, [k]: e.target.value })}
            key={k}
            value={values[k] || ""}
            margin="dense"
            label={v.label}
            placeholder={v.label}
          />
        ))}
      </Dialog>
    </>
  );
};

export default OtherForm;
