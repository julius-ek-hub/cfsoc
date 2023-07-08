import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import Alert from "@mui/material/Alert";

import useToasts from "../../hooks/useToast";

import { sleep } from "../utils";

function TransitionLeft(props) {
  return <Slide {...props} direction="left" />;
}

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

function TransitionRight(props) {
  return <Slide {...props} direction="right" />;
}

function TransitionDown(props) {
  return <Slide {...props} direction="down" />;
}

export default function Toast() {
  const [toast, setToast] = React.useState(undefined);
  const { toasts, push, shift } = useToasts();

  const doSetToast = async () => {
    setToast(undefined);
    await sleep(100);
    setToast(toasts[0]);
  };

  React.useEffect(() => {
    doSetToast();
  }, [toasts]);

  return (
    <Snackbar
      open={Boolean(toast)}
      onClose={shift}
      autoHideDuration={5000}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      TransitionComponent={TransitionLeft}
    >
      <Alert onClose={shift} severity="success" variant="filled" elevation={6}>
        I love snacks
      </Alert>
    </Snackbar>
  );
}
