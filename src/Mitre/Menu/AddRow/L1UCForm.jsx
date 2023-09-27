import { Fragment, useEffect, useState } from "react";

import MuiButton from "@mui/material/Button";

import Dialog from "../../../common/utils/Dialogue";
import AutoComplete from "../../../common/utils/form/controlled/AutoComplete";
import SubmitButton from "../../../common/utils/form/controlled/SubmitButton";
import TextField from "../../../common/utils/form/controlled/TextField";
import Form from "../../../common/utils/form/controlled/Form";

import useSheet from "../../hooks/useSheet";
import useAddModify from "../../hooks/useAddModify";

import { useFormikContext } from "formik";

const L1UCForm = ({ Button, edit }) => {
  const [open, setOpen] = useState(false);

  const { cols, l1_uc_schema, save, for_edit } = useAddModify();

  const { sheets, primary_field } = useSheet();

  const df = for_edit(edit);

  const handleClose = () => setOpen(false);

  const Reset = ({ children }) => {
    const fk = useFormikContext();

    useEffect(() => {
      if (!open) fk.resetForm();
    }, [open]);

    return children;
  };

  const all_l1_l2 = sheets.l1_uc.content
    .map((all) => all.l2_uc_identifiers.value)
    .flat();

  let l2_uc_identifiers = sheets.l2_uc.content.map(({ name, identifier }) => ({
    name: name.value,
    id: identifier.value,
  }));

  let df_l2uc = (df.l2_uc_identifiers?.value || []).map((i) =>
    l2_uc_identifiers.find((id) => id.id === i)
  );

  const not_choosen = (l2_uc_identifiers = l2_uc_identifiers.filter(
    (l2) => !all_l1_l2.includes(l2.id)
  ));

  if (!edit) l2_uc_identifiers = not_choosen;
  else l2_uc_identifiers = [...df_l2uc, ...not_choosen];

  return (
    <>
      <Button onClick={() => setOpen(true)} />
      <Form
        initialValues={Object.fromEntries(
          cols.map(([k, v]) => [
            k,
            k === "l2_uc_identifiers" ? df_l2uc : df[k]?.value || "",
          ])
        )}
        onSubmit={(d) => {
          let go = { ...d };
          go.l2_uc_identifiers = d.l2_uc_identifiers.map((_d) => _d.id);
          save(go, edit, handleClose);
        }}
        validationSchema={l1_uc_schema}
      >
        <Reset />
        <Dialog
          open={open}
          onXClose={handleClose}
          fullWidth
          title={edit ? "Edit L1 Use Case" : "Add new L1 UC"}
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
              {k === "l2_uc_identifiers" ? (
                <AutoComplete
                  name="l2_uc_identifiers"
                  isOptionEqualToValue={(op, va) => op.id === va.id}
                  getOptionLabel={(op) => `${op.name} (${op.id})`}
                  options={l2_uc_identifiers}
                  label={v.label}
                />
              ) : (
                <TextField
                  fullWidth
                  name={k}
                  margin="dense"
                  label={v.label}
                  {...(edit &&
                    k === primary_field && {
                      onChange: () => false,
                      disabled: true,
                      helperText: `Can't edit primary field`,
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

export default L1UCForm;
