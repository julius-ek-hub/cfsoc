import { useState, useEffect } from "react";

import Button from "@mui/material/Button";

import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

import AutoComplete from "../../../common/utils/form/controlled/AutoComplete";
import SubmitButton from "../../../common/utils/form/controlled/SubmitButton";
import TextField from "../../../common/utils/form/controlled/TextField";
import Form from "../../../common/utils/form/controlled/Form";
import IconButton from "../../../common/utils/IconButton";
import Draw from "../../utils/Draw";

import useAddModify from "../../hooks/useAddModify";
import useToasts from "../../../common/hooks/useToast";
import useSheet from "../../hooks/useSheet";

import { useFormikContext } from "formik";

import { _keys, _l, entr_ } from "../../../common/utils/utils";

const EditUC = ({ edit, $for = {} }) => {
  const [open, setOpen] = useState(false);
  const { cols, for_edit, save, all_uc_schema, otherfields } = useAddModify();

  const { contents } = useSheet();
  const { push } = useToasts();

  const df = for_edit(edit);
  const refs = [
    "l1_uc_identifier",
    "l2_uc_identifier",
    "l3_uc_identifier",
    "l4_uc_identifier",
  ];
  const handleClose = () => setOpen(false);

  const all_except = entr_(
    contents.all_uc
      .filter((uc) => uc._id.value !== edit)
      .map((uc) => [uc.identifier.value, uc])
  );

  const l1_uc_identifiers = contents.l1_uc.map(({ name, identifier }) => ({
    name: name.value,
    id: identifier.value,
  }));

  const l2_uc_identifiers = contents.l2_uc.map(({ name, identifier }) => ({
    name: name.value,
    id: identifier.value,
  }));

  const l3_uc_identifiers = contents.l3_uc.map(({ name, identifier }) => ({
    name: name.value,
    id: identifier.value,
  }));

  const l4_uc_identifiers = contents.l4_uc.map(({ name, identifier }) => ({
    name: name.value,
    id: identifier.value,
  }));

  const drops = {
    l1_uc_identifiers,
    l2_uc_identifiers,
    l3_uc_identifiers,
    l4_uc_identifiers,
    ...otherfields,
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

  const getOther = (k) =>
    otherfields[k].find((s) => s.name === df[k]?.value) ||
    otherfields[k].find((s) => !s.name);

  const dfs = {
    name: df.name?.value || "",
    identifier: df.identifier?.value || "",
    source: getOther("source"),
    customer: getOther("customer"),
    technology: getOther("technology"),
    description: df.description?.value || "",
    url: df.url?.value || "",
    l1_uc_identifiers: df_l1uc,
    l2_uc_identifiers: df_l2uc,
    l3_uc_identifiers: df_l3uc,
    l4_uc_identifiers: df_l4uc,
  };

  const fixed = {
    l1_uc_identifiers:
      l1_uc_identifiers.filter((id) => id.id === $for.l1_uc_identifier) || [],
    l2_uc_identifiers:
      l2_uc_identifiers.filter((id) => $for.l2_uc_identifier === id.id) || [],
    l3_uc_identifiers:
      l3_uc_identifiers.filter((id) => $for.l3_uc_identifier === id.id) || [],
    l4_uc_identifiers:
      l4_uc_identifiers.filter((id) => $for.l4_uc_identifier === id.id) || [],
  };

  const ivs = Object.fromEntries(
    cols.map(([k, v]) => [k, fixed[k] && !edit ? fixed[k] : dfs[k]])
  );

  const Reset = ({ children }) => {
    const fk = useFormikContext();

    useEffect(() => {
      if (!open) {
        fk.resetForm();
        fk.setValues(ivs);
      }
    }, [open]);

    return children;
  };

  const New = () => (
    <Button
      onClick={(e) => setOpen(true)}
      endIcon={<AddIcon />}
      color="inherit"
    >
      Add New
    </Button>
  );

  return (
    <>
      {edit ? (
        <IconButton
          Icon={EditIcon}
          title="Edit selected"
          onClick={(e) => setOpen(true)}
        />
      ) : (
        <New />
      )}
      <Form
        initialValues={ivs}
        onSubmit={(d) => {
          let $new = { ...d };
          const _end = "_uc_identifiers";

          [1, 2, 3, 4].map((i) => {
            $new[`l${i + _end}`] = $new[`l${i + _end}`].map((l) => l.id);
          });

          ["source", "technology", "customer"].map((i) => {
            $new[i] = $new[i]?.name || "";
          });

          if (all_except[d.identifier])
            return push({
              message: `Identifier must be unique, ${d.identifier} exists`,
              severity: "error",
            });

          save($new, edit, handleClose, false);
        }}
        validationSchema={all_uc_schema}
      >
        <Reset />
        <Draw
          Okbutton={SubmitButton}
          onXclose={handleClose}
          open={open}
          title={`${edit ? "Edit" : "Add"} Use Case`}
          Use
          Case
          path={
            <>
              {refs
                .filter((r) => $for[r])
                .map((r) => $for[r])
                .join(" / ")}
              {df?.identifier && ` / ${df.identifier.value}`}
            </>
          }
        >
          {cols.map(([k, v]) =>
            _keys(drops).includes(k) ? (
              <AutoComplete
                key={k}
                name={k}
                multiple={!_keys(otherfields).includes(k)}
                isOptionEqualToValue={(op, val) => op.id === val.id}
                getOptionLabel={(op) =>
                  `${op?.name || "None"} ${
                    !_keys(otherfields).includes(k) ? `(${op?.id})` : ""
                  }`
                }
                options={drops[k]}
                label={v.label}
                {...(fixed[k] && {
                  fixed: fixed[k],
                  isFixed: (option) => fixed[k].find((o) => o.id === option.id),
                })}
              />
            ) : (
              <TextField
                fullWidth
                name={k}
                key={k}
                margin="dense"
                multiline={k === "description"}
                {...(k === "description" && { minRows: 4 })}
                hidden
                label={v.label}
              />
            )
          )}
        </Draw>
      </Form>
    </>
  );
};

export default EditUC;
