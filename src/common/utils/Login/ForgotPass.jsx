import { useState } from "react";

import * as Yup from "yup";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import Refresh from "@mui/icons-material/Refresh";

import ResetPass from "./ResetPass";

import Form from "../form/controlled/Form";
import TextField from "../form/controlled/TextField";
import SubmitButton from "../form/controlled/SubmitButton";

import useFetch from "../../hooks/useFetch";
import useLoading from "../../hooks/useLoading";

const schema = Yup.object({
  username: Yup.string().required("Username is required"),
  otp: Yup.string().label("OTP"),
});

const ForgotPass = ({ onCancel, onSuccess }) => {
  const [otp, setOtp] = useState(null);
  const [username, setUname] = useState();
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState(null);
  const [resending, setResending] = useState(false);
  const { post } = useFetch("/auth");
  const { update } = useLoading();

  const resendOTP = () => {
    setResending(true);
    form.submitForm();
  };

  if (success)
    return (
      <ResetPass
        onCancel={onCancel}
        onSuccess={onSuccess}
        username={username}
      />
    );
  return (
    <Form
      description="Forgot Passord ?"
      initialValues={{ username: "", otp: "" }}
      validationSchema={schema}
      onSubmit={async (v, f) => {
        if (otp && !resending) {
          if (v.otp.trim() !== otp) f.setFieldError("otp", "Invalid OTP");
          else setSuccess(true);
          return;
        }
        setResending(false);
        try {
          update(true);
          const { json } = await post("/verify-user", {
            username: v.username,
          });
          if (json.error) {
            update(false);
            return f.setFieldError(
              json.field || "username",
              json.errorCode === 500 ? "Internal Server Error." : json.error
            );
          }
          setOtp(json.otp);
          setUname(v.username);
          update(false);
          setForm(f);
        } catch (error) {
          f.setFieldError("username", error.message);
          update(false);
        }
      }}
    >
      <TextField
        name="username"
        placeholder="Username"
        label="Username"
        required
        disabled={Boolean(otp)}
        fullWidth
      />
      {otp && (
        <>
          <Typography
            my={1}
            color="text.secondary"
            sx={{ wordBreak: "normal" }}
          >
            A One-Time-Password has been sent to the email associated with
            username <strong>{username}</strong>, enter the OTP below:
          </Typography>
          <TextField
            name="otp"
            placeholder="OTP"
            label="OTP"
            type="password"
            required
            fullWidth
          />
          {form && (
            <Button startIcon={<Refresh />} sx={{ mt: 2 }} onClick={resendOTP}>
              Resend
            </Button>
          )}
        </>
      )}
      <Box mt={2} display="flex" gap={2}>
        <SubmitButton variant="contained">
          Verify {otp ? "OTP" : "username"}
        </SubmitButton>
        <Button onClick={onCancel}>Cancel</Button>
      </Box>
    </Form>
  );
};

export default ForgotPass;
