import { useState } from "react";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

import IconButton from "../../common/utils/IconButton";

import useDimension from "../../common/hooks/useDimensions";

const Draw = ({
  title,
  children,
  path,
  open,
  onClose,
  onXclose,
  onDone,
  Okbutton,
  description,
}) => {
  const [fullscreen, setFullScreen] = useState(false);
  const { up } = useDimension();

  const closeDrawer = () => {
    setFullScreen(false);
    onClose?.call();
    onXclose?.call();
  };

  const Ok = ({ But, ...rest }) => (
    <Box mt={1}>
      <But variant="contained" sx={{ minWidth: 100 }} {...rest}>
        Done
      </But>
    </Box>
  );

  return (
    <Drawer
      open={open}
      PaperProps={{
        sx: {
          width: fullscreen ? "100%" : up.lg ? 600 : up.md ? "50%" : "90%",
          p: 2.5,
          gap: 1,
          pt: 0,
          transition: "width 0.3s",
        },
      }}
      anchor="right"
      {...(onClose && {
        onClose: closeDrawer,
      })}
    >
      <Box
        borderBottom={(t) => `1px solid ${t.palette.divider}`}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        py={1.5}
        mb={1}
      >
        <Typography>{path}</Typography>
        <Box display="flex" gap={2}>
          <IconButton
            onClick={() => setFullScreen(!fullscreen)}
            Icon={fullscreen ? CloseFullscreenIcon : OpenInFullIcon}
            title="Toggle fullscreen"
          />
          <IconButton
            onClick={closeDrawer}
            Icon={KeyboardDoubleArrowRightIcon}
            title="Close"
          />
        </Box>
      </Box>

      <Typography variant="h4">{title}</Typography>
      {description}

      <Box flexGrow={1} overflow="auto">
        {children}
      </Box>
      {onDone && <Ok But={Button} onClick={onDone} />}
      {Okbutton && <Ok But={Okbutton} />}
    </Drawer>
  );
};

export default Draw;
