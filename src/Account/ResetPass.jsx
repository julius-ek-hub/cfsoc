import { useEffect, useState } from "react";

import Button from "@mui/material/Button";

import Dialog from "../common/utils/Dialogue";
import TextField from "../common/utils/form/uncontrolled/TextField.jsx";

import useFetch from "../common/hooks/useFetch";
import useToasts from "../common/hooks/useToast";

const Resetpass = ({ ClickComponent, staff }) => {
  const [open, setOpen] = useState(false);
  const [password, setPass] = useState("");

  const fname = staff.name.split(" ")[0];
  const { patch } = useFetch("/auth");
  const { push } = useToasts();

  const hassError = !password || password.length < 4;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleReset = async () => {
    if (hassError) return;
    const { json } = await patch(`/reset-pass`, {
      password,
      username: staff.username,
    });
    if (json.error) push({ message: json.error, severity: "error" });
    else {
      push({
        message: `${fname}'s password has been reset to ${password}`,
        severity: "success",
      });
      handleClose();
    }
  };

  useEffect(() => {
    setPass(`${staff.username}@12345!`);
  }, [open]);

  return (
    <>
      <ClickComponent onClick={handleOpen} />

      <Dialog
        fullWidth
        margin="dense"
        title={`Rest ${fname}'s password`}
        open={open}
        sx={{ ".MuiPaper-root": { maxWidth: 400 } }}
        onClose={handleClose}
        onXClose={handleClose}
        {...(!hassError && {
          action: (
            <Button variant="contained" onClick={handleReset}>
              Reset
            </Button>
          ),
        })}
      >
        <TextField
          value={password}
          onChange={(e) => setPass(e.target.value)}
          name="name"
          fullWidth
          label="Reset to"
          sx={{ mt: 2 }}
          helperText={
            hassError
              ? "ERROR: Password must be at least 4 characters long"
              : `Share the password above with ${fname}`
          }
          error={hassError}
        />
      </Dialog>
    </>
  );
};

export default Resetpass;
