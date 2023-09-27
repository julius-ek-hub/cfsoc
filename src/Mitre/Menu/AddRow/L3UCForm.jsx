import { useState, Fragment, useEffect } from "react";

import MuiButton from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";

import Dialog from "../../../common/utils/Dialogue";
import AutoComplete from "../../../common/utils/form/controlled/AutoComplete";
import SubmitButton from "../../../common/utils/form/controlled/SubmitButton";
import TextField from "../../../common/utils/form/controlled/TextField";
import Form from "../../../common/utils/form/controlled/Form";

import useSheet from "../../hooks/useSheet";

import * as Yup from "yup";

import useAddModify from "../../hooks/useAddModify";
import { useFormikContext } from "formik";
import { _l, fix_percent } from "../../utils/utils";

const required = (name, inst = Yup.string()) => {
  return inst.required(`${name} is required.`);
};

const L3UCForm = ({ Button, edit }) => {
  const [open, setOpen] = useState(false);
  const { cols, for_edit, save } = useAddModify();

  const { sheets } = useSheet();

  const df = for_edit(edit);

  const no_edit = ["identifier", "technique", "mitre_url", "l2_uc_identifiers"];

  const schema = Yup.object(
    Object.fromEntries(
      cols.map(([k, v]) => [
        k,
        ["scope", "comments"].includes(k)
          ? Yup.string().label(v.label)
          : ["coverage", "effectiveness"].includes(k)
          ? Yup.number().min(0).max(100).label(v.label)
          : k === "l2_uc_identifiers"
          ? Yup.array().min(1, "Atleast 1 tactic is required")
          : k === "identifier"
          ? Yup.string()
              .matches(/T[0-9]+/i)
              .required()
              .label(v.label)
          : k === "mitre_url"
          ? Yup.string().url().required().label(v.label)
          : required(v.label),
      ])
    )
  );

  const handleClose = () => setOpen(false);

  const l2_uc_identifiers = sheets.l2_uc.content.map(
    ({ name, identifier }) => ({
      name: name.value,
      id: identifier.value,
    })
  );

  let df_l2uc = (df.l2_uc_identifiers?.value || []).map((i) =>
    l2_uc_identifiers.find((id) => id.id === i)
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
      <Button onClick={(e) => setOpen(true)} />
      <Form
        initialValues={Object.fromEntries(
          cols.map(([k, v]) => [
            k,
            k === "l2_uc_identifiers"
              ? df_l2uc
              : ["coverage", "effectiveness"].includes(k)
              ? fix_percent(df[k]?.value)
              : df[k]?.value || "",
          ])
        )}
        onSubmit={(d) => {
          const dd = { ...d };
          dd.l2_uc_identifiers = dd.l2_uc_identifiers.map((i) => i.id);
          dd.identifier = dd.identifier.trim().toUpperCase();
          save(dd, edit, handleClose);
        }}
        validationSchema={schema}
      >
        <Reset />
        <Dialog
          open={open}
          onXClose={handleClose}
          fullWidth
          title={edit ? "Edit L3 Use Case" : "Add new L3 UC"}
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

export default L3UCForm;
