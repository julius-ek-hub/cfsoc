import { useEffect, useState } from "react";

import Dialog from "../Dialogue";

import ForgotPass from "./ForgotPass";
import HavePass from "./HavePass";

import useCommonSettings from "../../hooks/useSettings";
import useLoading from "../../hooks/useLoading";

const Login = () => {
  const [havePass, setHavePass] = useState(true);
  const { user } = useCommonSettings();
  const { loading } = useLoading();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(!Boolean(user));
  }, [user]);

  if (loading.user) return null;

  return (
    <Dialog
      open={open}
      transition={false}
      sx={{
        ".MuiPaper-root": { p: 3, width: { sm: "70%", md: "50%", lg: 500 } },
      }}
    >
      {havePass ? (
        <HavePass onNoPass={() => setHavePass(false)} />
      ) : (
        <ForgotPass onCancel={() => setHavePass(true)} />
      )}
    </Dialog>
  );
};

export default Login;
