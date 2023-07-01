import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import Middle from "../../../common/utils/Middle";

const NoSchedule = ({ error }) => {
  return (
    <Middle flexGrow={1} p={4}>
      <Typography>{error.errorCode}</Typography>
      <Divider sx={{ my: 2, width: "20%" }} />
      <Typography sx={{ wordBreak: "normal" }} color="error">
        {error.errorCode === 500
          ? "Internal Server Error."
          : error.error.split("\n").map((l, k) => (
              <Typography key={k} variant="span">
                {l}
              </Typography>
            ))}
      </Typography>
    </Middle>
  );
};

export default NoSchedule;
