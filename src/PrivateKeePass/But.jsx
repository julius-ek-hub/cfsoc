import MuiButton from "@mui/material/Button";

const But = ({ Icon, EndIcon, sx, Wrapper, ...props1 }) => {
  const Button = (props2) => (
    <MuiButton
      color="inherit"
      fullWidth
      size="small"
      sx={{ justifyContent: "start", px: 2, whiteSpace: "nowrap", ...sx }}
      {...(Icon && { startIcon: <Icon /> })}
      {...(EndIcon && { endIcon: <EndIcon /> })}
      {...props1}
      {...props2}
    />
  );
  return Wrapper ? <Wrapper Initiator={Button} /> : <Button />;
};

export default But;
