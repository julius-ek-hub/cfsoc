import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import Middle from "../common/utils/Middle";

const Card = ({ to, title, description = "", icon, status }) => {
  const Launch = () => (
    <Button
      variant="contained"
      size="small"
      sx={{ px: 4 }}
      endIcon={<OpenInNewIcon />}
    >
      Open
    </Button>
  );
  return (
    <Box
      sx={{
        height: 250,
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
        </Box>
        {icon && (
          <Middle
            sx={{
              boxShadow: (t) => t.shadows[1],
              borderRadius: "50%",
              p: 1,
            }}
          >
            <Avatar
              alt={description[0]}
              src={icon}
              sx={{ height: 20, width: 20 }}
            />
          </Middle>
        )}
      </Box>
      <Box flexGrow={1} color="text.secondary" my={1}>
        {description.substring(0, 110)}
        {description.length > 100 && "..."}
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Link to={to}>
          <Launch />
        </Link>
        {status && (
          <>
            <MoreHorizIcon color="primary" />
            <Typography fontSize="small" color="text.secondary">
              {status}
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Card;
