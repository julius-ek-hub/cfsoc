import { useState, useEffect } from "react";

import MuiButton from "@mui/material/Button";

import Dialog from "../../../common/utils/Dialogue";
import AutoComplete from "../../../common/utils/form/controlled/AutoComplete";
import SubmitButton from "../../../common/utils/form/controlled/SubmitButton";
import Form from "../../../common/utils/form/controlled/Form";
import TextField from "../../../common/utils/form/controlled/TextField";

import useAddModify from "../../hooks/useAddModify";
import useSheet from "../../hooks/useSheet";

import { useFormikContext } from "formik";

import { _l } from "../../utils/utils";

const AllUCForm = ({ Button, edit }) => {
  const [open, setOpen] = useState(false);
  const { cols, for_edit, save, all_uc_schema } = useAddModify();

  const { sheets, active_sheet } = useSheet();

  const df = for_edit(edit);

  const handleClose = () => setOpen(false);

  const l1_uc_identifiers = sheets.l1_uc.content.map(
    ({ name, identifier }) => ({
      name: name.value,
      id: identifier.value,
    })
  );

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

  const l4_uc_identifiers = sheets.l4_uc.content.map(
    ({ name, identifier }) => ({
      name: name.value,
      id: identifier.value,
    })
  );

  const drops = {
    l1_uc_identifiers,
    l2_uc_identifiers,
    l3_uc_identifiers,
    l4_uc_identifiers,
  };

  let df_l1uc =
    l1_uc_identifiers.filter((id) =>
      (df.l1_uc_identifiers?.value || []).includes(id.id)
    ) || [];

  let df_l2uc =
    l2_uc_identifiers.filter((id) =>
      (df.l2_uc_identifiers?.value || []).includes(id.id)
    ) || [];

  let df_l3uc =
    l3_uc_identifiers.filter((id) =>
      (df.l3_uc_identifiers?.value || []).includes(id.id)
    ) || [];

  let df_l4uc =
    l4_uc_identifiers.filter((id) =>
      (df.l4_uc_identifiers?.value || []).includes(id.id)
    ) || [];

  const dfs = {
    name: df.name?.value || "",
    identifier: df.identifier?.value || "",
    source: df.source?.value || "",
    description: df.description?.value || "",
    url: df.url?.value || "",
    l1_uc_identifiers: df_l1uc,
    l2_uc_identifiers: df_l2uc,
    l3_uc_identifiers: df_l3uc,
    l4_uc_identifiers: df_l4uc,
  };

  const Reset = ({ children }) => {
    const fk = useFormikContext();

    useEffect(() => {
      if (!open) fk.resetForm();
    }, [open, fk.values]);

    return children;
  };

  return (
    <>
      <Button onClick={(e) => setOpen(true)} />
      <Form
        initialValues={Object.fromEntries(cols.map(([k, v]) => [k, dfs[k]]))}
        onSubmit={(d) => {
          let $new = { ...d };
          $new.l1_uc_identifiers = $new.l1_uc_identifiers.map((l1) => l1.id);
          $new.l2_uc_identifiers = $new.l2_uc_identifiers.map((l2) => l2.id);
          $new.l3_uc_identifiers = $new.l3_uc_identifiers.map((l3) => l3.id);
          $new.l4_uc_identifiers = $new.l4_uc_identifiers.map((l4) => l4.id);
          save($new, edit, handleClose, false);
        }}
        validationSchema={all_uc_schema}
      >
        <Reset />
        <Dialog
          open={open}
          onXClose={handleClose}
          fullWidth
          title={
            edit ? "Edit " + active_sheet.name : "Add new " + active_sheet.name
          }
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
          {cols.map(([k, v]) =>
            [
              "l1_uc_identifiers",
              "l2_uc_identifiers",
              "l3_uc_identifiers",
              "l4_uc_identifiers",
            ].includes(k) ? (
              <AutoComplete
                key={k}
                name={k}
                multiple
                isOptionEqualToValue={(op, va) => op.id === va.id}
                getOptionLabel={(op) =>
                  op?.name ? `${op.name} (${op.id})` : ""
                }
                options={drops[k]}
                label={v.label}
              />
            ) : (
              <TextField
                fullWidth
                name={k}
                key={k}
                margin="dense"
                multiline={k === "description"}
                hidden
                label={v.label}
              />
            )
          )}
        </Dialog>
      </Form>
    </>
  );
};

export default AllUCForm;