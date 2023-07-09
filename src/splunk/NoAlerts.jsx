import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Middle from "../common/utils/Middle";
import { Typography } from "@mui/material";

const NoAlerts = () => (
  <Middle mt={2}>
    <Typography display="flex" gap={1}>
      <InfoOutlinedIcon /> Search did not return any data.
    </Typography>
  </Middle>
);

export default NoAlerts;
