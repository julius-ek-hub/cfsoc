import { useState, Fragment, useEffect } from "react";

import MuiButton from "@mui/material/Button";

import { useFormikContext } from "formik";

import Dialog from "../../../common/utils/Dialogue";
import AutoComplete from "../../../common/utils/form/controlled/AutoComplete";
import SubmitButton from "../../../common/utils/form/controlled/SubmitButton";
import TextField from "../../../common/utils/form/controlled/TextField";
import Form from "../../../common/utils/form/controlled/Form";

import useSheet from "../../hooks/useSheet";
import useAddModify from "../../hooks/useAddModify";

const L2UCForm = ({ Button, edit }) => {
  const [open, setOpen] = useState(false);
  const { cols, save, for_edit, l2_uc_schema } = useAddModify();

  const { sheets } = useSheet();

  const df = for_edit(edit);

  const handleClose = () => setOpen(false);

  const l1_identifier = sheets.l1_uc.content.map(
    ({ identifier }) => identifier.value
  );

  const Reset = ({ children }) => {
    const fk = useFormikContext();

    useEffect(() => {
      if (!open) fk.resetForm();
    }, [open]);

    return children;
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} />
      <Form
        initialValues={Object.fromEntries(
          cols.map(([k, v]) => [k, df[k]?.value || ""])
        )}
        onSubmit={(d) => {
          const dd = { ...d };
          dd.identifier = dd.identifier.trim().toUpperCase();
          save(dd, edit, handleClose);
        }}
        validationSchema={l2_uc_schema}
      >
        <Reset />
        <Dialog
          open={open}
          onXClose={handleClose}
          fullWidth
          title={edit ? "Edit L2 Use Case" : "Add new L2 UC"}
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
              {k === "l1_uc_identifiers" ? (
                <AutoComplete
                  name="l1_uc_identifiers"
                  isOptionEqualToValue={(o, v) => o === v}
                  options={l1_identifier}
                  label={v.label}
                />
              ) : (
                <TextField
                  fullWidth
                  multiline={k === "description"}
                  name={k}
                  margin="dense"
                  label={v.label}
                  {...(edit &&
                    ["identifier", "name", "description"].includes(k) && {
                      onChange: () => false,
                      disabled: true,
                      helperText: `Can't edit this field`,
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

export default L2UCForm;
