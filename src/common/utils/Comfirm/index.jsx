import { useState } from "react";

import Button from "@mui/material/Button";

import Dialog from "../Dialogue";

export default function Confirm({
  Clickable,
  onConfirm,
  ok_color,
  ok_text,
  sx,
  title,
  ...rest
}) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleAccpet = () => {
    handleClose();
    onConfirm();
  };

  return (
    <>
      <Clickable onClick={handleOpen} />
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{ ".MuiPaper-root": { width: 400 }, ...sx }}
        title={title || "Confirm!"}
        {...rest}
        action={
          <>
            <Button onClick={handleClose}>Cancel</Button>
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
