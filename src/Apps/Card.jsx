import { useState } from "react";

import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "../common/utils/IconButton";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";

import Menu from "../common/utils/Menu";
import Confirm from "../common/utils/Comfirm";

const Card = ({
  to,
  title,
  description = "",
  status,
  onDelete,
  onEdit,
  user,
  _id,
}) => {
  const [menu, setMenu] = useState(false);
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
        height: 260,
        width: 300,
        overflow: "auto",
        border: (t) => `0.8px solid ${t.palette.divider}`,
        p: 2,
        px: 3,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "relative",
        "&:hover > div:first-of-type": {
          visibility: "visible",
        },
      }}
    >
      {user !== "default.account" && (
        <Box position="absolute" top={0} right={0} visibility="hidden">
          <Menu
            open={menu}
            onClose={() => setMenu(false)}
            Initiator={(props) => (
              <IconButton
                Icon={MoreVertIcon}
                onClick={(e) => {
                  setMenu(true);
                  props.onClick(e);
                }}
              />
            )}
          >
            <Box px={2}>
              <Button
                color="inherit"
                fullWidth
                sx={{ justifyContent: "start" }}
                startIcon={<Edit />}
                onClick={() => {
                  onEdit(_id);
                  setMenu(false);
                }}
              >
                Edit
              </Button>
              <Confirm
                onConfirm={() => onDelete(_id)}
                fullWidth
                ok_text="Yes"
                Initiator={(props) => (
                  <Button
                    color="error"
                    fullWidth
                    sx={{ justifyContent: "start" }}
                    startIcon={<Delete />}
                    {...props}
                  >
                    Delete
                  </Button>
                )}
              >
                Delete App?
              </Confirm>
            </Box>
          </Menu>
        </Box>
      )}

      <Typography
        variant="h6"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
        overflow="hidden"
      >
        {title}
      </Typography>
      <Box flexGrow={1} color="text.secondary" my={1}>
        {description.substring(0, 110)}.
        {description.length > 100 && (
          <Confirm
            title={`${title} | description`}
            is_alert
            expandable
            Initiator={(props) => (
              <Box
                component="span"
                {...props}
                color="primary.main"
                ml={1}
                fontWeight="bold"
                sx={{ cursor: "pointer" }}
              >
                read more...
              </Box>
            )}
          >
            {description.split("\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Confirm>
        )}
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Link to={to.replace(/<user>/gi, user)}>
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
