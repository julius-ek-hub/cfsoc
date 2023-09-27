import { Fragment } from "react";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Link from "@mui/material/Link";

import LaunchIcon from "@mui/icons-material/Launch";

const HoverBtn = ({ title, onClick, Icon, link, show, disabled }) => {
  const Wrapper = (props) =>
    link ? (
      <Link href={link} target="_blank" {...props} />
    ) : (
      <Fragment {...props} />
    );

  return (
    <Wrapper>
      <Tooltip title={link ? `Go to ${link}` : title}>
        <span>
          <IconButton
            size="small"
            sx={{ ml: 1, visibility: show ? "visible" : "hidden" }}
            onClick={onClick}
            disabled={disabled}
          >
            {link ? <LaunchIcon fontSize="20px" /> : <Icon fontSize="20px" />}
          </IconButton>
        </span>
      </Tooltip>
    </Wrapper>
  );
};

export default HoverBtn;
