import { useLayoutEffect, useState } from "react";

import Dialog from "../Dialogue";

import ForgotPass from "./ForgotPass";
import HavePass from "./HavePass";

import useCommonSettings from "../../hooks/useSettings";
import useLoading from "../../hooks/useLoading";

const Login = () => {
  const [havePass, setHavePass] = useState(true);
  const { user } = useCommonSettings();
  const [open, setOpen] = useState(false);
  const { loading } = useLoading();

  useLayoutEffect(() => {
    setOpen(!Boolean(user));
  }, [user]);

  if (loading.user || loading.staffs) return;

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
