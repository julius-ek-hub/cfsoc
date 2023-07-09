import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";

import Middle from "../common/utils/Middle";

const Card = ({
  to,
  title,
  description = "",
  creator = "Julus",
  status,
  disabled,
  icon,
}) => {
  const Launch = ({ disabled }) => (
    <Button variant="contained" size="small" sx={{ px: 4 }} disabled={disabled}>
      Launch
    </Button>
  );
  return (
    <Box
      sx={{
        height: 200,
        width: 300,
        border: (t) => `0.8px solid ${t.palette.divider}`,
        p: 2,
        px: 3,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h6">{title}</Typography>
          <Typography color="text.secondary" fontSize="small">
            By {creator}
          </Typography>
        </Box>
        <Middle
          sx={{
            boxShadow: (t) => t.shadows[1],
            borderRadius: "50%",
            p: 1,
          }}
        >
          <Avatar alt="S" src={icon} sx={{ height: 20, width: 20 }} />
        </Middle>
      </Box>
      <Middle flexGrow={1} color="text.secondary">
        {description.substring(0, 100)}
        {description.length > 100 && "..."}
      </Middle>
      <Box>
        {disabled ? (
          <Launch disabled />
        ) : (
          <Link to={to}>
            <Launch />
          </Link>
        )}
      </Box>
    </Box>
  );
};

export default Card;
