import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

import LogoutIcon from "@mui/icons-material/Logout";
import Chip from "@mui/material/Chip";

import Middle from "../../../../../common/utils/Middle";
import Confirm from "../../../../../common/utils/Comfirm";

import useCommonSettings from "../../../../../common/hooks/useSettings";

const UserInfo = () => {
  const { user, logout, admin } = useCommonSettings();

  const staff = user || {};
  const name = staff.name || "Anonymous";

  return (
    <Middle minHeight={130} pt={2}>
      <Avatar alt={name} />
      <Typography mt={1.2} variant="h6">
        {name}
      </Typography>
      <Middle flexDirection="row" gap={1}>
        <Typography color="text.secondary">{staff.position}</Typography>
        &#8212;
        <Typography color="text.secondary">
          {staff.level && `L${staff.level}`}
        </Typography>
      </Middle>
      {admin && <Chip label="admin" size="small" sx={{ mt: 1 }} />}
      <Confirm
        title="Confirm Logout"
        ok_text="Logout"
        ok_color="error"
        onConfirm={logout}
        Clickable={(props) => (
          <Button
            startIcon={<LogoutIcon />}
            size="small"
            color="error"
            sx={{ mt: 2, px: 2 }}
            {...props}
          >
            Logout
          </Button>
        )}
      />
    </Middle>
  );
};
export default UserInfo;
