import CircularProgress from "@mui/material/CircularProgress";

import Middle from "../common/utils/Middle";

const Loading = ({ abs = true, loading }) => {
  if (!loading) return null;

  return (
    <Middle
      height="100%"
      zIndex={10}
      {...(abs && {
        position: "absolute",
        top: 0,
        bottom: 0,
        width: "100%",
      })}
    >
      <CircularProgress />
    </Middle>
  );
};

export default Loading;
