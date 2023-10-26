import { useLayoutEffect, useState } from "react";

import Box from "@mui/material/Box";

import Dialog from "../Dialogue";

import ResetPass from "./ResetPass";
import Form from "../form/controlled/Form";
import TextField from "../form/controlled/TextField";
import SubmitButton from "../form/controlled/SubmitButton";

import useCommonSettings from "../../hooks/useSettings";
import useLoading from "../../hooks/useLoading";
import useFetch from "../../hooks/useFetch";

import * as Yup from "yup";

const schema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .label("Password")
    .min(4)
    .max(50)
    .required("Password is required"),
});

const Login = () => {
  const [username, setUsername] = useState(null);
  const { uname, update } = useCommonSettings();
  const [open, setOpen] = useState(false);
  const { loading } = useLoading();
  const { post } = useFetch("/auth");

  useLayoutEffect(() => {
    setOpen(!Boolean(uname));
  }, [uname]);

  if (loading.user || loading.staffs) return;

  return (
    <Dialog open={open} transition={false} fullWidth>
      {username ? (
        <ResetPass username={username} onCancel={() => setUsername(null)} />
      ) : (
        <Form
          description="Login"
          initialValues={{ username: "", password: "" }}
          validationSchema={schema}
          onSubmit={async (v, form) => {
            const uname = v.username.toLowerCase();
            try {
              const { json } = await post("/login", {
                password: v.password,
                username: uname,
              });
              if (json.error) {
                return form.setFieldError(
                  json.field || "username",
                  json.errorCode === 500 ? "Internal Server Error." : json.error
                );
              }
              if (json.user.reset) return setUsername(uname);

              update("user", json.user);
              update("x-auth-token", json.jwt);
              setUsername(null);
            } catch (error) {
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

          <Box mt={2} display="flex" gap={2}>
            <SubmitButton variant="contained">Login</SubmitButton>
          </Box>
        </Form>
      )}
    </Dialog>
  );
};

export default Login;
