import { useState } from "react";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";

import AddIcon from "@mui/icons-material/Add";

import * as Yup from "yup";

import Dialog from "../common/utils/Dialogue";
import TextField from "../common/utils/form/controlled/TextField.jsx";
import Form from "../common/utils/form/controlled/Form.jsx";
import SubmitButton from "../common/utils/form/controlled/SubmitButton";

import useFetch from "../common/hooks/useFetch";
import useLoading from "../common/hooks/useLoading";
import useCommonSettings from "../common/hooks/useSettings";

const required = (name, inst = Yup.string()) => {
  return inst.required(`${name} is required.`);
};

const schema = Yup.object({
  name: required("Fullnames"),
  position: required("Position"),
  level: required("Level", Yup.number()),
  email: required("Email").email("Invalid email"),
});

const AddUser = ({ ClickComponent, edit }) => {
  const [open, setOpen] = useState(false);
  const [admin, setAdmin] = useState(
    typeof edit?.admin === "boolean" ? edit.admin : false
  );
  const { post, patch } = useFetch("/auth");
  const { update } = useLoading();
  const { staffs, update: us, uname } = useCommonSettings();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onSubmit = async (values, form) => {
    try {
      update(true);
      const { json } = await (edit ? patch : post)("/staffs", {
        ...values,
        admin,
        ...(edit && { username: edit.username }),
      });
      if (json.error) form.setFieldError(json.field, json.error);
      else {
        let old = { ...staffs };
        old[json.username] = json;
        us("staffs", old);
        if (json.username === uname) us("user", json);
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
        open={open}
        sx={{ ".MuiPaper-root": { maxWidth: 400 } }}
        onClose={handleClose}
      >
        <Typography p={2} variant="h6">
          {edit ? "Edit Staff Info" : "Add Staff"}
        </Typography>
        <Divider />
        <Form
          validationSchema={schema}
          initialValues={{
            name: edit?.name || "",
            position: edit?.position || "",
            level: edit?.level || "",
            email: edit?.email || "",
          }}
          onSubmit={onSubmit}
        >
          <TextField name="name" fullWidth label="Full Names" />
          <TextField
            name="position"
            fullWidth
            sx={{ my: 2 }}
            label="Position"
          />
          <TextField name="level" fullWidth label="Level" type="number" />
          <TextField
            name="email"
            type="email"
            fullWidth
            label="Email Address"
            sx={{ my: 2 }}
          />
          <Box mb={2}>
            <Checkbox
              checked={admin}
              onChange={(e, checked) => setAdmin(checked)}
            />{" "}
            Admin
          </Box>
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

export default AddUser;
