import IconButtonMui from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

const IconButton = ({ Icon, title, iprop, ...rest }) => (
  <Tooltip title={title}>
    <span>
      <IconButtonMui color="inherit" {...rest}>
        <Icon {...iprop} />
      </IconButtonMui>
    </span>
  </Tooltip>
);

export default IconButton;
