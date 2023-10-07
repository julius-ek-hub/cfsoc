import { useState, Fragment, useEffect } from "react";

import MuiButton from "@mui/material/Button";

import Dialog from "../../../common/utils/Dialogue";
import SubmitButton from "../../../common/utils/form/controlled/SubmitButton";
import TextField from "../../../common/utils/form/controlled/TextField";
import Form from "../../../common/utils/form/controlled/Form";

import DatePicker from "../../../common/utils/form/controlled/DatePicker";

import useSheet from "../../hooks/useSheet";

import dayjs from "dayjs";

import useAddModify from "../../hooks/useAddModify";
import { useFormikContext } from "formik";
import { _l, _u } from "../../utils/utils";
import AutoComplete from "../../../common/utils/form/controlled/AutoComplete";

const CARUCForm = ({ Button, edit }) => {
  const [open, setOpen] = useState(false);
  const { cols, for_edit, save, car_schema } = useAddModify();

  const { active_content } = useSheet();

  const df = for_edit(edit);

  const handleClose = () => setOpen(false);

  const exists = ($new) => {
    return active_content
      .filter((d) => d._id.value !== edit)
      .find((ac) => _l(ac.identifier.value) === _l($new.identifier));
  };

  const all_platforms = {
    windows: "Windows",
    linux: "Linux",
    macos: "macOS",
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
          cols.map(([k, v]) => {
            const _v = df[k]?.value || "";
            return [
              k,
              k === "submission_date"
                ? dayjs(_v || new Date())
                : k === "application_platforms"
                ? (_v || []).map((__v) => all_platforms[_l(__v)])
                : _v,
            ];
          })
        )}
        onSubmit={(d, f) => {
          let $new = { ...d };
          $new.identifier = _u($new.identifier);
          $new.submission_date =
            $new.submission_date.$d.toLocaleDateString("en-US");
          if (exists($new))
            return f.setFieldError(
              `identifier`,
              `A use case with exactly the same identifier, exists.`
            );
          save($new, edit, handleClose);
        }}
        validationSchema={car_schema}
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
              {k === "submission_date" ? (
                <DatePicker
                  name="submission_date"
                  label={v.label}
                  fullWidth
                  margin="dense"
                />
              ) : k === "application_platforms" ? (
                <AutoComplete
                  key={k}
                  name={k}
                  options={Object.values(all_platforms)}
                  label={v.label}
                />
              ) : (
                <TextField
                  fullWidth
                  name={k}
                  margin="dense"
                  multiline={k === "description"}
                  hidden
                  label={v.label}
                  {...(k === "implementations" && {
                    helperText: "Separate more than one with semi colon",
                  })}
                  {...(edit &&
                    k === "identifier" && {
                      helperText: "Can't edit this field",
                      onChange: () => false,
                      disabled: true,
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

export default CARUCForm;
