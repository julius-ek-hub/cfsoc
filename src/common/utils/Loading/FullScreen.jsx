import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import useLoading from "../../hooks/useLoading";

const FullScreenLoading = () => {
  const { loading } = useLoading();

  return (
    <Backdrop
      open={Boolean(loading.full || loading.user)}
      unmountOnExit
      sx={{ zIndex: 10000 }}
    >
      <CircularProgress />
    </Backdrop>
  );
};

export default FullScreenLoading;
