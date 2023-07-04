import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import * as Yup from "yup";

import Form from "../form/controlled/Form";
import TextField from "../form/controlled/TextField";
import SubmitButton from "../form/controlled/SubmitButton";

import useCommonSettings from "../../hooks/useSettings";
import useFetch from "../../hooks/useFetch";
import useLoading from "../../hooks/useLoading";

const sch = Yup.string()
  .label("Password")
  .min(4)
  .max(16)
  .required("Password is required");

const scheme = Yup.object({
  p1: sch,
  p2: sch.oneOf([Yup.ref("p1"), null], "Passwords did not match"),
});

const ResetPass = ({ onCancel, username }) => {
  const { update } = useCommonSettings();
  const { post } = useFetch("/auth");
  const { update: ul } = useLoading();
  return (
    <Form
      description="Create New Password"
      initialValues={{ p1: "", p2: "" }}
      validationSchema={scheme}
      onSubmit={async (val, f) => {
        try {
          ul(true);
          const { json } = await post("/create-pass", {
            username,
            password: val.p1,
          });
          if (json.error) throw new Error(json.error);
          update("user", json.user);
          update("x-auth-token", json.token);
          ul(false);
        } catch (error) {
          ul(false);
          f.setFieldError("p1", error.message);
        }
      }}
    >
      <TextField
        name="p1"
        label="Password"
        type="password"
        required
        fullWidth
      />
      <TextField
        name="p2"
        label="Repeat Password"
        type="password"
        required
        fullWidth
        sx={{ mt: 2 }}
      />

      <Box mt={3} display="flex" gap={2}>
        <SubmitButton variant="contained">Login</SubmitButton>
        <Button onClick={onCancel}>Cancel</Button>
      </Box>
    </Form>
  );
};

export default ResetPass;
