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
import { _l } from "../../utils/utils";

const ExpoUCForm = ({ Button, edit }) => {
  const [open, setOpen] = useState(false);
  const { cols, for_edit, save, expo_uc_schema } = useAddModify();

  const { sheets } = useSheet();

  const df = for_edit(edit);

  const handleClose = () => setOpen(false);

  const l2_uc_identifiers = sheets.l2_uc.content.map(
    ({ name, identifier }) => ({
      name: name.value,
      id: identifier.value,
    })
  );

  const l3_uc_identifiers = sheets.l3_uc.content.map(
    ({ name, identifier }) => ({
      name: name.value,
      id: identifier.value,
    })
  );

  let df_l2 =
    l2_uc_identifiers.filter((id) =>
      (df.l2_uc_identifiers?.value || []).includes(
        _l(id.name).split(" ").join("-")
      )
    ) || [];

  let df_l3 =
    l3_uc_identifiers.filter((id) =>
      (df.l3_uc_identifiers?.value || []).includes(id.id)
    ) || [];

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
            k === "l2_uc_identifiers"
              ? df_l2
              : k === "l3_uc_identifiers"
              ? df_l3
              : df[k]?.value || "",
          ])
        )}
        onSubmit={(d, f) => {
          let $new = { ...d };
          $new.l2_uc_identifiers = $new.l2_uc_identifiers.map((l2) =>
            _l(l2.name).split(" ").join("-")
          );
          $new.l3_uc_identifiers = $new.l3_uc_identifiers.map((l3) => l3.id);

          save($new, edit, handleClose);
        }}
        validationSchema={expo_uc_schema}
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
              {["l2_uc_identifiers", "l3_uc_identifiers"].includes(k) ? (
                <AutoComplete
                  name={k}
                  isOptionEqualToValue={(op, va) => op.id === va.id}
                  getOptionLabel={(op) =>
                    op?.name ? `${op.name} (${op.id})` : ""
                  }
                  options={
                    k === "l2_uc_identifiers"
                      ? l2_uc_identifiers
                      : l3_uc_identifiers
                  }
                  label={v.label}
                />
              ) : (
                <TextField
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

export default ExpoUCForm;
