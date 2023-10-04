import { useState, useEffect } from "react";

import MuiButton from "@mui/material/Button";

import Dialog from "../../../common/utils/Dialogue";
import AutoComplete from "../../../common/utils/form/controlled/AutoComplete";
import SubmitButton from "../../../common/utils/form/controlled/SubmitButton";
import Form from "../../../common/utils/form/controlled/Form";

import useAddModify from "../../hooks/useAddModify";
import useSheet from "../../hooks/useSheet";

import { useFormikContext } from "formik";

const UCDEVForm = ({ Button, edit }) => {
  const [open, setOpen] = useState(false);
  const { cols, for_edit, save, dev_uc_schema } = useAddModify();

  const [choosen_l3, setChoosenL3] = useState("");

  const { sheets, active_sheet, active_content } = useSheet();

  const df = for_edit(edit);

  const handleClose = () => setOpen(false);

  const l3_uc_identifier = sheets.l3_uc.content.map(({ name, identifier }) => ({
    name: name.value,
    id: identifier.value,
  }));

  const l4_uc_identifier = sheets.l4_uc.content
    .filter((l4) =>
      edit && !choosen_l3 ? true : l4.l3_uc_identifier.value === choosen_l3
    )
    .map(({ name, identifier }) => ({
      name: name.value,
      id: identifier.value,
    }));

  const car_uc_identifiers = sheets.car_uc.content.map(
    ({ name, identifier }) => ({
      name: name.value,
      id: identifier.value,
    })
  );

  const drops = { l4_uc_identifier, l3_uc_identifier, car_uc_identifiers };

  let df_l3uc =
    l3_uc_identifier.find((id) => id.id === df.l3_uc_identifier?.value) || "";

  let df_l4uc =
    l4_uc_identifier.find((id) => id.id === df.l4_uc_identifier?.value) || "";

  let df_car =
    car_uc_identifiers.filter((id) =>
      (df.car_uc_identifiers?.value || []).includes(id.id)
    ) || [];

  const dfs = {
    l4_uc_identifier: df_l4uc,
    l3_uc_identifier: df_l3uc,
    car_uc_identifiers: df_car,
  };

  const exists = ($new) => {
    return active_content
      .filter((d) => d._id.value !== edit)
      .find(
        (ac) =>
          ac.l3_uc_identifier.value === $new.l3_uc_identifier &&
          ac.l4_uc_identifier.value === $new.l4_uc_identifier &&
          $new.car_uc_identifiers.every((cuc) =>
            ac.car_uc_identifiers.value.includes(cuc)
          )
      );
  };

  const Reset = ({ children }) => {
    const fk = useFormikContext();

    useEffect(() => {
      if (!open) fk.resetForm();
      const l3 = fk.values.l3_uc_identifier.id;
      if (l3) setChoosenL3(l3);
    }, [open, fk.values]);

    return children;
  };

  return (
    <>
      <Button onClick={(e) => setOpen(true)} />
      <Form
        initialValues={Object.fromEntries(cols.map(([k, v]) => [k, dfs[k]]))}
        onSubmit={(d, f) => {
          let $new = { ...d };
          $new.l3_uc_identifier = $new.l3_uc_identifier?.id || "";
          $new.l4_uc_identifier = $new.l4_uc_identifier?.id || "";
          $new.car_uc_identifiers = $new.car_uc_identifiers.map((ca) => ca.id);

          if (
            $new.l4_uc_identifier &&
            $new.l4_uc_identifier.split(".")[0] !== $new.l3_uc_identifier
          )
            return f.setFieldError(
              `l4_uc_identifier`,
              `The Technique from this Sub-Technique ID doesn't match the parent technique above`
            );

          if (exists($new))
            return f.setFieldError(
              `car_uc_identifiers`,
              `A use case with exactly the same info above, exists.`
            );

          save($new, edit, handleClose, false);
        }}
        validationSchema={dev_uc_schema}
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
          {cols.map(([k, v]) => (
            <AutoComplete
              key={k}
              name={k}
              multiple={k === "car_uc_identifiers"}
              isOptionEqualToValue={(op, va) => op.id === va.id}
              getOptionLabel={(op) => (op?.name ? `${op.name} (${op.id})` : "")}
              options={drops[k]}
              label={v.label}
            />
          ))}
        </Dialog>
      </Form>
    </>
  );
};

export default UCDEVForm;
