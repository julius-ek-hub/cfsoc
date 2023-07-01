import { useState } from "react";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Slide from "@mui/material/Slide";

import AddIcon from "@mui/icons-material/Add";

import * as Yup from "yup";

import Dialog from "../../../../../common/utils/Dialogue";
import TextField from "../../../../../common/utils/form/controlled/TextField.jsx";
import Form from "../../../../../common/utils/form/controlled/Form.jsx";
import SubmitButton from "../../../../../common/utils/form/controlled/SubmitButton";

import useLoading from "../../../../../common/hooks/useLoading";
import useFetch from "../../../../../common/hooks/useFetch";
import useSchedules from "../../../../hooks/useSchedules";

const required = (name, inst = Yup.string()) => {
  return inst.required(`${name} is required.`);
};

const schema = Yup.object({
  name: required("Name").matches(/^[a-zA-Z]+$/, {
    message: "Name must be a single word with only letters.",
  }),
  label: Yup.string().max(
    1,
    "Label if provided, must be a character. Eg X, Y, Z"
  ),
  color: required("Background color"),
  description: Yup.string(),
});

const AddStatus = ({ ClickComponent, edit }) => {
  const [open, setOpen] = useState(false);
  const { post, patch } = useFetch();
  const { update } = useLoading();
  const { addStatus } = useSchedules();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onSubmit = async (values, form) => {
    const { name, ...rest } = values;
    try {
      update(true);
      const { json } = await (edit ? patch : post)("/statuses", {
        name: edit ? edit.name : name.toLowerCase(),
        ...rest,
      });
      if (json.error) {
        form.setFieldError("name", json.error);
      } else {
        addStatus(json);
        handleClose();
      }
      update(false);
    } catch (error) {
      update(false);
      form.setFieldError("name", "Something went wrong, try again.");
    }
  };

  return (
    <>
      {ClickComponent ? (
        <ClickComponent onClick={handleOpen} />
      ) : (
        <Button sx={{ px: 2 }} onClick={handleOpen} startIcon={<AddIcon />}>
          Add
        </Button>
      )}
      <Dialog
        TransitionProps={{ direction: "right" }}
        TransitionComponent={Slide}
        open={open}
        sx={{ ".MuiPaper-root": { maxWidth: 400 } }}
        onClose={handleClose}
      >
        <Typography p={2} variant="h6">
          {edit ? "Edit" : "Add"} Shift Status
        </Typography>
        <Divider />
        <Form
          validationSchema={schema}
          initialValues={
            edit || {
              name: "",
              label: "",
              color: "#ffffff",
              description: "",
            }
          }
          onSubmit={onSubmit}
        >
          <TextField
            name="name"
            fullWidth
            label="Name"
            margin="dense"
            placeholder="Eg. work, holiday, off, sick, absent"
            helperText={
              edit ? "You can not edit this field." : "Must be unique"
            }
            required
            disabled={Boolean(edit)}
          />
          <TextField
            name="label"
            fullWidth
            label="Label"
            margin="dense"
            placeholder="Eg. X"
            helperText="Will be used as cell value"
          />
          <TextField
            name="color"
            type="color"
            fullWidth
            label="Background color"
            margin="dense"
            helperText="Will be used as cell background color"
            required
          />
          <TextField
            name="description"
            fullWidth
            label="Description"
            multiline
            minRows={3}
            margin="dense"
            sx={{ mb: 2 }}
            helperText="Optional"
          />
          <SubmitButton variant="contained" size="large">
            Add
          </SubmitButton>
          <Button onClick={handleClose} type="button" sx={{ ml: 2 }}>
            Cancel
          </Button>
        </Form>
      </Dialog>
    </>
  );
};

export default AddStatus;
