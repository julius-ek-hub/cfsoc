import { useState, useEffect } from "react";

import MuiButton from "@mui/material/Button";
import TextField from "../../../common/utils/form/uncontrolled/TextField";
import Typography from "@mui/material/Typography";

import Dialog from "../../../common/utils/Dialogue";

import useAddModify from "../../hooks/useAddModify";
import useSheet from "../../hooks/useSheet";

const Form = ({ Button, edit }) => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const { active_sheet } = useSheet();

  const { cols, save, for_edit } = useAddModify();

  const df = for_edit(edit);
  const pc = active_sheet.primary_column;
  const hasError = Object.values(errors).some((e) => e);

  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    if (hasError) return;
    save(values, edit, handleClose);
  };

  const handleChange = (value, k) => {
    setValues({
      ...values,
      [k]: { ...values[k], value },
    });
    if (
      pc &&
      pc === k &&
      value.trim() &&
      !edit &&
      active_sheet.content.find((c) => c[k].value === value.trim())
    )
      setErrors({ ...errors, [k]: "PRIMARY_KEY_ERROR: This value exists" });
    else setErrors({ ...errors, [k]: null });
  };

  useEffect(() => {
    setValues(
      Object.fromEntries(
        cols.map(([k, v]) => {
          const _v =
            df[k] ||
            (!edit && { value: active_sheet.columns[k].default_value || "" });
          return [k, (_v || {}).hasOwnProperty("value") ? _v : { value: "" }];
        })
      )
    );
    setErrors({});
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
            {!hasError && (
              <MuiButton
                color="primary"
                variant="contained"
                onClick={handleSubmit}
              >
                Save
              </MuiButton>
            )}
          </>
        }
      >
        {cols.map(([k, v]) => {
          const _v = values[k];
          return (
            <TextField
              multiline
              fullWidth
              onChange={(e) => handleChange(e.target.value, k)}
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
              {...(errors[k] && {
                error: true,
                helperText: errors[k],
              })}
            />
          );
        })}
      </Dialog>
    </>
  );
};

export default Form;
