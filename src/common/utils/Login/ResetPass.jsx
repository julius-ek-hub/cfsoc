import { useState } from "react";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import * as Yup from "yup";

import Form from "../form/controlled/Form";
import TextField from "../form/controlled/TextField";
import SubmitButton from "../form/controlled/SubmitButton";

import useFetch from "../../hooks/useFetch";
import useLoading from "../../hooks/useLoading";

const scheme = Yup.object({
  username: Yup.string().label("Username").required(),
  otp: Yup.string().label("OTP"),
});

const ResetPass = ({ onCancel, onresetConfirm }) => {
  const { get } = useFetch("/auth");
  const { update: ul } = useLoading();
  const [otpVal, setOTPVal] = useState("");
  const [user, setUser] = useState(null);

  const sendEmail = async (to, token) => {
    ul(true);
    try {
      const _opt = Math.random().toString(36).toUpperCase().slice(2, 6);
      const fd = new FormData();
      fd.append(
        "email",
        JSON.stringify({
          to,
          subject: `OTP - CFSOC Local web server`,
          text: `
          Hi, Use ${_opt} as OTP
          -----------------------------------------
          If you are not aware of this email, please disregard.
          Only for verifications and testing of CFSOC local webserver @beaconred.
          Thanks
          `,
          html: `
          Hi, 
          <p>Use ${_opt} as OTP</p>
          <hr/>
          <div style="padding:4px;font-size:small;background-color:whitesmoke;border-radius:8px">
          If you are not aware of this email, please disregard.
          Only for verifications and testing of CFSOC local webserver @beaconred.<br/>
          Thanks
          </div>
          `,
        })
      );
      const resp = await fetch("https:/www.247-dev.com/api/email/send", {
        method: "POST",
        body: fd,
        headers: {
          "x-auth-token": token,
        },
      });
      const res = await resp.json();
      if (res.accepted.length > 0) setOTPVal(_opt);
      else throw new Error("OTP not sent");
    } catch (error) {
    } finally {
      ul(false);
    }
  };

  return (
    <Form
      description="Reset Password"
      initialValues={{ username: "", otp: "" }}
      validationSchema={scheme}
      onSubmit={async (val, f) => {
        if (!val.otp) {
          const { json } = await get(`/verify-user?username=${val.username}`);
          console.log(json);
          if (json.error) return f.setFieldError("username", json.error);
          await sendEmail(json.email, json.emailToken);
          setUser(json);
        } else {
          if (val.otp === otpVal && user) onresetConfirm(user.username);
          else f.setFieldError("otp", "Invalid OTP");
        }
      }}
    >
      {!otpVal && <TextField name="username" label="Username" fullWidth />}

      {otpVal && (
        <TextField
          name="otp"
          label="OPT"
          type="password"
          fullWidth
          helperText={`A One Time Password has been sent to the email associated with ${user?.username}, for verification. Please enter it here.`}
          sx={{ mt: 2 }}
        />
      )}

      <Box>
        {otpVal && (
          <Button onClick={() => sendEmail(user.email, user.emailToken)}>
            Resend OTP
          </Button>
        )}
        {user && <Button onClick={() => setOTPVal(null)}>Change Email</Button>}
      </Box>

      <Box mt={3} display="flex" gap={2}>
        <SubmitButton variant="contained">
          {user ? "Reset" : "Verify"}
        </SubmitButton>
        <Button onClick={onCancel}>Cancel</Button>
      </Box>
    </Form>
  );
};

export default ResetPass;
