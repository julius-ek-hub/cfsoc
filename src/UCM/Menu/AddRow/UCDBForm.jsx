import { useState, Fragment, useEffect } from "react";

import { useFormikContext } from "formik";

import MuiButton from "@mui/material/Button";

import Dialog from "../../../common/utils/Dialogue";
import AutoComplete from "../../../common/utils/form/controlled/AutoComplete";
import SubmitButton from "../../../common/utils/form/controlled/SubmitButton";
import TextField from "../../../common/utils/form/controlled/TextField";
import Form from "../../../common/utils/form/controlled/Form";

import useSheet from "../../hooks/useSheet";

import useAddModify from "../../hooks/useAddModify";

const UCDBForm = ({ Button, edit }) => {
  const [open, setOpen] = useState(false);
  const { cols, for_edit, save, uc_db_schema } = useAddModify();

  const { sheets, active_content } = useSheet();

  const df = for_edit(edit);

  const handleClose = () => setOpen(false);

  const l1_uc_identifiers = sheets.l1_uc.content.map(
    ({ name, identifier }) => ({
      name: name.value,
      id: identifier.value,
    })
  );

  let df_l1 =
    l1_uc_identifiers.filter((id) =>
      (df.l1_uc_identifiers?.value || []).includes(id.id)
    ) || [];

  const exists = ($new) => {
    return active_content
      .filter((d) => d._id.value !== edit)
      .find(
        (ac) =>
          ac.use_case.value === $new.use_case &&
          $new.l1_uc_identifiers.every((cuc) =>
            ac.l1_uc_identifiers.value.includes(cuc)
          )
      );
  };

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
            k === "l1_uc_identifiers" ? df_l1 : df[k]?.value || "",
          ])
        )}
        onSubmit={(d, f) => {
          let $new = { ...d };
          $new.l1_uc_identifiers = $new.l1_uc_identifiers.map((l1) => l1.id);

          if (exists($new))
            return f.setFieldError(
              `use_case`,
              `A use case with exactly the same info below, exists.`
            );

          save($new, edit, handleClose);
        }}
        validationSchema={uc_db_schema}
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
              {k === "l1_uc_identifiers" ? (
                <AutoComplete
                  name="l1_uc_identifiers"
                  isOptionEqualToValue={(op, va) => op.id === va.id}
                  getOptionLabel={(op) =>
                    op?.name ? `${op.name} (${op.id})` : ""
                  }
                  options={l1_uc_identifiers}
                  label={v.label}
                />
              ) : (
                <TextField
                  enterButton
                  multiline={k === "description"}
                  fullWidth
                  name={k}
                  margin="dense"
                  hidden
                  label={v.label}
                />
              )}
            </Fragment>
          ))}
        </Dialog>
      </Form>
    </>
  );
};

export default UCDBForm;
