import Button from "@mui/material/Button";

const But = ({ Icon, EndIcon, sx, ...props }) => (
  <Button
    color="inherit"
    fullWidth
    size="small"
    sx={{ justifyContent: "start", px: 2, whiteSpace: "nowrap", ...sx }}
    {...(Icon && { startIcon: <Icon /> })}
    {...(EndIcon && { endIcon: <EndIcon /> })}
    {...props}
  />
);

export default But;
