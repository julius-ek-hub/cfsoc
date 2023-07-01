import { useState } from "react";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Slide from "@mui/material/Slide";
import Box from "@mui/material/Box";

import AddIcon from "@mui/icons-material/Add";

import * as Yup from "yup";

import Dialog from "../../../common/utils/Dialogue";
import TextField from "../../../common/utils/form/controlled/TextField.jsx";
import Form from "../../../common/utils/form/controlled/Form.jsx";
import SubmitButton from "../../../common/utils/form/controlled/SubmitButton";
import DatePicker from "../../../common/utils/form/controlled/DatePicker";

import useFetch from "../../../common/hooks/useFetch";
import useLoading from "../../../common/hooks/useLoading";
import useSchedules from "../../hooks/useSchedules";

const required = (name, inst = Yup.string()) => {
  return inst.required(`${name} is required.`);
};

const schema = Yup.object({
  from: required("Start time"),
  to: required("End time"),
  label: Yup.string(),
});

const _getDate = ({ $H, $m }) => Number(($H + $m / 60).toFixed(1));

const AddShift = ({ children = "Add Shift", ...props }) => {
  const [open, setOpen] = useState(false);
  const { post } = useFetch();
  const { update } = useLoading();
  const { addShift } = useSchedules();

  const handleOpe = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onSubmit = async (values, form) => {
    try {
      const from = _getDate(values.from);
      const to = _getDate(values.to);
      const shift = { from, to, label: values.label };
      //   if (to - from > 8 || to <= from)
      //     return form.setFieldError("to", "Shift is more than 8hrs");
      update(true);
      const { json } = await post("/shifts", shift);
      if (json.error) form.setFieldError("from", json.error);
      else {
        handleClose();
        addShift(shift);
      }
      update(false);
    } catch (error) {
      update(false);
      form.setFieldError("name", "Something went wrong, try again.");
    }
  };

  return (
    <Box {...props}>
      <Button sx={{ px: 3 }} onClick={handleOpe} startIcon={<AddIcon />}>
        {children}
      </Button>
      <Dialog
        TransitionProps={{ direction: "right" }}
        TransitionComponent={Slide}
        open={open}
        sx={{ ".MuiPaper-root": { maxWidth: 400 } }}
        onClose={handleClose}
      >
        <Typography p={2} variant="h6">
          Add Shift
        </Typography>
        <Divider />
        <Form
          validationSchema={schema}
          initialValues={{
            from: "",
            to: "",
            label: "",
          }}
          onSubmit={onSubmit}
        >
          <DatePicker
            type="time"
            name="from"
            fullWidth
            sx={{ mt: 2 }}
            label="From"
            helperText="Click on the clock icon"
          />
          <DatePicker
            type="time"
            name="to"
            fullWidth
            sx={{ my: 2 }}
            label="To"
            helperText="Click on the clock icon"
          />
          <TextField
            name="label"
            label="Shift name"
            helperText="Optional"
            placeholder="Eg Morning"
            fullWidth
          />
          <Box mt={2}>
            <SubmitButton variant="contained" size="large">
              Add
            </SubmitButton>
            <Button onClick={handleClose} type="button" sx={{ ml: 2 }}>
              Cancel
            </Button>
          </Box>
        </Form>
      </Dialog>
    </Box>
  );
};

export default AddShift;
