import { useEffect, useState } from "react";

import { useFormikContext } from "formik";

import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import EditIcon from "@mui/icons-material/Edit";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";

import Dialog from "../../../../common/utils/Dialogue";
import AutoComplete from "../../../../common/utils/form/controlled/AutoComplete";
import SubmitButton from "../../../../common/utils/form/controlled/SubmitButton";
import TextField from "../../../../common/utils/form/controlled/TextField";
import Form from "../../../../common/utils/form/controlled/Form";

import useSheet from "../../../hooks/useSheet";
import useAddModify from "../../../hooks/useAddModify";

import * as Yup from "yup";

import {
  _entr,
  entr_,
  field_separator as fs,
  objectExcept,
} from "../../../utils/utils";

import useFetch from "../../../../common/hooks/useFetch";
import useToasts from "../../../../common/hooks/useToast";
import IconButton from "../../../../common/utils/IconButton";

const Style = ({ _id }) => {
  const [open, setOpen] = useState(false);

  const { patch } = useFetch("/ucm");
  const { push } = useToasts();

  const { cols } = useAddModify();

  const { active_content, active_sheet, updateSheet } = useSheet();

  const styles = {
    textAlign: {
      type: "list",
      value: ["center", "left", "right"],
      label: "Text Align",
      default: "left",
    },
    verticalAlign: {
      type: "list",
      value: ["middle", "top", "bottom"],
      label: "Vertical Align",
      default: "middle",
    },
    fontWeight: { type: "text", label: "Font Weight", default: "normal" },
    fontSize: { type: "number", label: "Font Size", default: 16 },
    bgcolor: { type: "color", label: "Background Color", default: "inherit" },
    color: { type: "color", label: "Text Ccolor", default: "inherit" },
  };

  const targetIndex = active_content.findIndex((ac) => ac._id.value === _id);
  const target = active_content[targetIndex];

  const default_sx = entr_(
    _entr(target)
      .filter(([k]) => k !== "_id")
      .map(([k, v]) => {
        const sx = v.sx || {};
        return _entr({ ...styles }).map(([_k, _v]) => [
          `${k}____${_k}`,
          sx[_k] || _v.default,
        ]);
      })
      .flat()
  );

  const d_ent = _entr(default_sx);

  const style_schema = Yup.object(
    entr_(d_ent.map(([k, v]) => [k, Yup.string()]))
  );

  const handleClose = () => setOpen(false);

  const handleUpdate = async (update) => {
    const _target = { ...target };

    cols.map(([k, v]) => {
      const sx = entr_(
        _entr(styles).map(([_k, _v]) => [_k, update[`${k}____${_k}`]])
      );
      const prop = { ..._target[k] };
      prop.sx = sx;
      _target[k] = prop;
    });

    const { json } = await patch(`/data?sheet=${active_sheet.key}`, {
      _id,
      update: objectExcept(_target, ["_id"]),
    });

    if (json.error) {
      push({
        message: `Failed to apply style: ${json.error}`,
        severity: "error",
      });
    } else {
      push({ message: "Styles applied.", severity: "success" });
      handleClose();
      updateSheet(
        `${active_sheet.key + fs}content${fs + targetIndex}`,
        _target
      );
      updateSheet(
        `${active_sheet.key + fs}selected`,
        active_sheet.selected.filter((s) => s !== _id)
      );
    }
  };

  const Container = ({ label, children, _key }) => {
    const fk = useFormikContext();

    const revert = () => {
      _entr(styles).map(([k, v]) => {
        fk.setFieldValue(`${_key}____${k}`, v.default);
      });
    };

    useEffect(() => {
      if (!open) fk.resetForm();
    }, [open]);

    return (
      <>
        <InputLabel sx={{ mb: 1 }}>
          {label}{" "}
          <IconButton
            Icon={SettingsBackupRestoreIcon}
            sx={{ ml: 2 }}
            title="Revert to original"
            onClick={revert}
          />
        </InputLabel>
        {children}
      </>
    );
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        endIcon={<EditIcon />}
        color="inherit"
      >
        Edit style
      </Button>
      <Form
        initialValues={default_sx}
        onSubmit={handleUpdate}
        validationSchema={style_schema}
      >
        <Dialog
          open={open}
          onXClose={handleClose}
          fullWidth
          title="Edit Style"
          action={
            <>
              <Button color="inherit" onClick={handleClose}>
                Cancel
              </Button>
              <SubmitButton color="primary" variant="contained">
                Save
              </SubmitButton>
            </>
          }
        >
          {cols.map(([k, v]) => (
            <Stack
              key={k}
              mb={2}
              border={(t) => `1px solid ${t.palette.divider}`}
              p={2}
            >
              <Container label={v.label} _key={k}>
                {_entr(styles).map(([_k, _v]) => {
                  return _v.type === "list" ? (
                    <AutoComplete
                      key={_k}
                      name={`${k}____${_k}`}
                      options={_v.value}
                      multiple={false}
                      label={_v.label}
                    />
                  ) : (
                    <TextField
                      key={_k}
                      name={`${k}____${_k}`}
                      margin="dense"
                      label={_v.label}
                      type={_v.type}
                    />
                  );
                })}
              </Container>
            </Stack>
          ))}
        </Dialog>
      </Form>
    </>
  );
};

export default Style;
