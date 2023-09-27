import Typography from "@mui/material/Typography";

import Middle from "./Middle";

const Err_404 = ({
  children,
  hide,
  errorMessage = "Page Not Found",
  code = 404,
}) => {
  if (hide) return null;

  return (
    <Middle height="100%" fontSize={100}>
      {children ? (
        children
      ) : (
        <>
          {code}
          <Typography color="error">{errorMessage}</Typography>
        </>
      )}
    </Middle>
  );
};

export default Err_404;
