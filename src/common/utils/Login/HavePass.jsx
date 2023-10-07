import { useState } from "react";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import * as Yup from "yup";

import Form from "../form/controlled/Form";
import TextField from "../form/controlled/TextField";
import SubmitButton from "../form/controlled/SubmitButton";

import useCommonSettings from "../../hooks/useSettings";
import useFetch from "../../hooks/useFetch";
import useLoading from "../../hooks/useLoading";

const schema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .label("Password")
    .min(4)
    .max(16)
    .required("Password is required"),
});

const HavePass = ({ onNoPass }) => {
  const [username, setUsername] = useState(null);
  const { update } = useCommonSettings();
  const { update: ul } = useLoading();
  const { post } = useFetch("/auth");
  return (
    <Form
      description="Login"
      initialValues={{ username: "", password: "" }}
      validationSchema={schema}
      onSubmit={async (v, form) => {
        setUsername(v.username);
        try {
          ul(true, "login");
          const { json } = await post("/login", {
            username: v.username.toLowerCase(),
            password: v.password,
          });
          if (json.error) {
            form.setFieldError(
              json.field || "username",
              json.errorCode === 500 ? "Internal Server Error." : json.error
            );
            return ul(false, "login");
          }
          update("user", json.user);
          update("x-auth-token", json.jwt);
          ul(false, "login");
        } catch (error) {
          ul(false, "login");
          form.setFieldError("username", error.message);
        }
      }}
    >
      <TextField
        name="username"
        placeholder="Username"
        label="Username"
        required
        fullWidth
      />
      <TextField
        name="password"
        placeholder="Password"
        label="Password"
        type="password"
        required
        fullWidth
        sx={{ mt: 2 }}
      />
      <Box mt={2} display="flex" gap={2} alignItems="center">
        Forgort password or don't have password ?
        <Button onClick={() => onNoPass(username)}>Reset</Button>
      </Box>
      <Box mt={2} display="flex" gap={2}>
        <SubmitButton variant="contained">Login</SubmitButton>
      </Box>
    </Form>
  );
};

export default HavePass;
