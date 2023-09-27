import { useRouteError } from "react-router-dom";

import Typography from "@mui/material/Typography";

import Middle from "./Middle";

function Err_500() {
  let error = useRouteError();
  console.error(error);
  return (
    <Middle height="100%" fontSize={100}>
      500
      <Typography color="error">Fatal Error</Typography>
    </Middle>
  );
}

export default Err_500;
