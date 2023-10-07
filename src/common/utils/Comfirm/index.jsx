import { useState } from "react";

import Button from "@mui/material/Button";

import Dialog from "../Dialogue";

export default function Confirm({
  Clickable,
  onClose,
  onConfirm,
  ok_color,
  ok_text,
  close_on_ok = true,
  sx,
  title,
  is_alert,
  ...rest
}) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    onClose?.call();
    setOpen(false);
  };

  const handleAccpet = () => {
    onConfirm?.call({}, () => setOpen(false));
    close_on_ok && handleClose();
  };

  return (
    <>
      <Clickable onClick={handleOpen} />
      <Dialog
        open={open}
        onClose={handleClose}
        onXClose={handleClose}
        title={title || "Confirm!"}
        fullWidth={rest.fullWidth || true}
        {...rest}
        action={
          <>
            {!is_alert && <Button onClick={handleClose}>Cancel</Button>}
            <Button
              onClick={handleAccpet}
              color={ok_color || "primary"}
              variant="contained"
            >
              {ok_text || "OK"}
            </Button>
          </>
        }
      />
    </>
  );
}
