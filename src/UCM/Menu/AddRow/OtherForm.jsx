import { useState, useEffect } from "react";

import MuiButton from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import TextField from "../../../common/utils/form/uncontrolled/TextField";
import Dialog from "../../../common/utils/Dialogue";

import useAddModify from "../../hooks/useAddModify";

const OtherForm = ({ Button, edit }) => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({});
  const [error, setError] = useState(null);

  const { cols, save, for_edit } = useAddModify();

  const df = for_edit(edit);

  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    setError(null);
    save(values, edit, handleClose);
  };

  useEffect(() => {
    setValues(
      Object.fromEntries(
        cols.map(([k, v]) => {
          const _v = df[k];
          return [k, (_v || {}).hasOwnProperty("value") ? _v : { value: "" }];
        })
      )
    );
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
              onClick={handleSubmit}
            >
              Save
            </MuiButton>
          </>
        }
      >
        {error && (
          <Typography color="error" mb={1}>
            {error}
          </Typography>
        )}
        {cols.map(([k, v]) => {
          const _v = values[k];
          return (
            <TextField
              multiline
              fullWidth
              onChange={(e) =>
                setValues({
                  ...values,
                  [k]: { ...values[k], value: e.target.value },
                })
              }
              key={k}
              value={_v?.value || ""}
              margin="dense"
              label={v.label}
              placeholder={v.label}
              {...(_v?.image && {
                disabled: true,
                value: _v.image,
                helperText: "Can't change image",
                onChange: () => false,
              })}
            />
          );
        })}
      </Dialog>
    </>
  );
};

export default OtherForm;
