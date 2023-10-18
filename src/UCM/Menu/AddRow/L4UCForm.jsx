import { useState, Fragment, useEffect } from "react";

import MuiButton from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";

import Dialog from "../../../common/utils/Dialogue";
import AutoComplete from "../../../common/utils/form/controlled/AutoComplete";
import SubmitButton from "../../../common/utils/form/controlled/SubmitButton";
import TextField from "../../../common/utils/form/controlled/TextField";
import Form from "../../../common/utils/form/controlled/Form";

import useSheet from "../../hooks/useSheet";
import useAddModify from "../../hooks/useAddModify";

import { useFormikContext } from "formik";

import { fix_percent } from "../../utils/utils";

const L4UCForm = ({ Button, edit }) => {
  const [open, setOpen] = useState(false);
  const { cols, for_edit, save, l4_uc_schema } = useAddModify();

  const { sheets } = useSheet();

  const df = for_edit(edit);

  const no_edit = ["identifier", "technique", "l3_uc_identifier"];

  const handleClose = () => setOpen(false);

  const l3_uc_identifiers = sheets.l3_uc.content.map(
    ({ name, identifier }) => ({
      name: name.value,
      id: identifier.value,
    })
  );

  let df_l2uc =
    l3_uc_identifiers.find((id) => id.id === df.l3_uc_identifier?.value) || "";

  const Reset = ({ children }) => {
    const fk = useFormikContext();

    useEffect(() => {
      if (!open) fk.resetForm();
    }, [open]);

    return children;
  };

  return (
    <>
      <Button onClick={(e) => setOpen(true)} />
      <Form
        initialValues={Object.fromEntries(
          cols.map(([k, v]) => [
            k,
            k === "l3_uc_identifier"
              ? df_l2uc
              : ["coverage", "effectiveness"].includes(k)
              ? fix_percent(df[k]?.value)
              : df[k]?.value || "",
          ])
        )}
        onSubmit={(d, f) => {
          let go = { ...d };
          go.l3_uc_identifier = go.l3_uc_identifier.id;
          go.identifier = go.identifier.toUpperCase();

          if (go.identifier.split(".")[0] !== go.l3_uc_identifier)
            return f.setFieldError(
              `identifier`,
              `The Technique from this Sub-Technique ID doesn't match the technique selected`
            );

          save(go, edit, handleClose);
        }}
        validationSchema={l4_uc_schema}
      >
        <Reset />
        <Dialog
          open={open}
          onXClose={handleClose}
          fullWidth
          title={edit ? "Edit L4 Use Case" : "Add new L4 UC"}
          action={
            <>
              <MuiButton color="inherit" onClick={handleClose}>
                Cancel
              </MuiButton>
              <SubmitButton color="primary" variant="contained">
                Save
              </SubmitButton>
            </>
          }
        >
          {cols.map(([k, v]) => (
            <Fragment key={k}>
              {k === "l3_uc_identifier" ? (
                <AutoComplete
                  name="l3_uc_identifier"
                  multiple={false}
                  isOptionEqualToValue={(op, va) => op.id === va.id}
                  getOptionLabel={(op) =>
                    op?.name ? `${op.name} (${op.id})` : ""
                  }
                  options={l3_uc_identifiers}
                  label={v.label}
                  {...(edit && {
                    onChange: () => false,
                    disabled: true,
                    helperText: `Can't edit this field`,
                  })}
                />
              ) : (
                <TextField
                  fullWidth
                  name={k}
                  margin="dense"
                  multiline={k === "description"}
                  hidden
                  label={v.label}
                  {...(edit &&
                    no_edit.includes(k) && {
                      onChange: () => false,
                      disabled: true,
                      helperText: `Can't edit this field`,
                    })}
                  {...(["coverage", "effectiveness"].includes(k) && {
                    type: "number",
                    InputProps: {
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    },
                  })}
                />
              )}
            </Fragment>
          ))}
        </Dialog>
      </Form>
    </>
  );
};

export default L4UCForm;
