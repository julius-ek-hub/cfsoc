import Button, { ButtonProps } from "@mui/material/Button";

import LogoutIcon from "@mui/icons-material/Logout";

import Confirm from "../Comfirm";

import useCommonSettings from "../../hooks/useSettings";

/**
 *
 * @param {ButtonProps} btnProps
 */

const Logout = (btnProps) => {
  const { logout } = useCommonSettings();

  return (
    <Confirm
      title="Confirm Logout"
      ok_text="Logout"
      ok_color="error"
      fullWidth
      onConfirm={logout}
      Initiator={(props) => (
        <Button
          startIcon={<LogoutIcon />}
          size="small"
          color="error"
          {...props}
          {...btnProps}
        >
          Logout
        </Button>
      )}
    />
  );
};
export default Logout;
