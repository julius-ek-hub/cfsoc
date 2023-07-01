import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

import Chip from "@mui/material/Chip";

import Middle from "../Middle";

import useCommonSettings from "../../hooks/useSettings";

const UserInfo = () => {
  const { user, admin } = useCommonSettings();

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
    </Middle>
  );
};
export default UserInfo;
