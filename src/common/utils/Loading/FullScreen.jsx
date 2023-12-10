import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import useLoading from "../../hooks/useLoading";
import Middle from "../Middle";
import { Typography } from "@mui/material";

const FullScreenLoading = () => {
  const { loading } = useLoading();

  return (
    <Backdrop
      open={Boolean(loading.full || loading.user)}
      unmountOnExit
      sx={{ zIndex: 10000 }}
    >
      <Middle gap={2}>
        <CircularProgress />
        <Typography color="text.secondary">Please wait....</Typography>
      </Middle>
    </Backdrop>
  );
};

export default FullScreenLoading;
