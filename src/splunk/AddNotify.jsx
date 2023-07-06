import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";

import Form from "../common/utils/form/controlled/Form";
import TextField from "../common/utils/form/controlled/TextField";
import SubmitButton from "../common/utils/form/controlled/SubmitButton";

import Loading from "./Loading";

import useAlerts from "./hooks/useAlerts";
import useLoading from "../common/hooks/useLoading";

import * as Yup from "yup";

const schema = Yup.object({
  contact: Yup.string()
    .min(9, "Invalid phone number")
    .max(9, "Invalid phone number")
    .matches(/5[0-9]+/, "Invalid phone number")
    .required("Required"),
});

const AddNotify = () => {
  const { newNotify } = useAlerts();
  const { loading } = useLoading();

  return (
    <Box
      borderLeft={(t) => `1px solid ${t.palette.divider}`}
      pl={2}
      position="relative"
    >
      <Loading loading={loading.add_notify} abs />
      <Form
        onSubmit={async ({ contact }, f) => {
          const { error } = await newNotify({
            type: "sms",
            contact,
            active: true,
          });
          error && f.setFieldError("contact", error);
        }}
        validationSchema={schema}
        initialValues={{
          contact: "",
        }}
      >
        <Box>
          <Typography variant="h6" mb={2}>
            Add Telephone:
          </Typography>
          <TextField
            name="contact"
            label="Telephone"
            size="small"
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">+971</InputAdornment>
              ),
            }}
          />
          <Box>
            <SubmitButton variant="contained" sx={{ mt: 2 }}>
              Add
            </SubmitButton>
          </Box>
        </Box>
      </Form>
    </Box>
  );
};

export default AddNotify;
