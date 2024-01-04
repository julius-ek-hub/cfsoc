import { useEffect, useState } from "react";

import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";

import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LockOpenIcon from "@mui/icons-material/LockOpen";

import Middle from "../common/utils/Middle";
import IconButton from "../common/utils/IconButton";
import TextField from "../common/utils/form/uncontrolled/TextField";

import useKeepass from "./hooks/useKeepass";
import useFetcher from "./hooks/useFetcher";
import Confirm from "../common/utils/Comfirm";

import { shortenFileName } from "./utils";

const CollcetPass = () => {
  const [visible, setVisible] = useState(false);
  const [pass, setPass] = useState("");
  const { fetchContent } = useFetcher();
  const { selectedDB } = useKeepass();

  const hanldeFetch = async () => {
    if (!pass) return;
    fetchContent(pass);
  };

  const handleClose = () => {
    setPass("");
    setVisible(false);
  };

  useEffect(() => {
    handleClose();
  }, [selectedDB]);

  return (
    <Middle gap={2} flexGrow={1}>
      <LockIcon sx={{ fontSize: 120, color: "divider" }} />
      <Typography color="text.secondary" fontSize="small">
        {shortenFileName(selectedDB.name)} is locked.
      </Typography>

      <Confirm
        onClose={handleClose}
        onConfirm={hanldeFetch}
        fullWidth={false}
        disabled={!pass}
        title="Master Key"
        Initiator={(props) => (
          <IconButton Icon={LockOpenIcon} {...props} title="Unlock Workspace" />
        )}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            hanldeFetch();
          }}
        >
          <TextField
            fullWidth
            margin="dense"
            placeholder="Master Key"
            size="small"
            type={visible ? "text" : "password"}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            autoComplete="password"
            {...(pass && {
              InputProps: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setVisible(!visible)}
                      Icon={visible ? VisibilityOffIcon : VisibilityIcon}
                    />
                  </InputAdornment>
                ),
              },
            })}
          />
        </form>
      </Confirm>
    </Middle>
  );
};

export default CollcetPass;
