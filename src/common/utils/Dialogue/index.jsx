import { forwardRef, ReactElement, useState } from "react";

import Box from "@mui/material/Box";
import Zoom from "@mui/material/Zoom";
import MuiDialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";

import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";

import { DialogProps } from "./types";
import IconButton from "../IconButton";

const Transition = forwardRef(function Transition(
  { Component: TC = Zoom, ...props },
  ref
) {
  return <TC ref={ref} {...props} />;
});

/**
 * Customized Dialog base component
 * @arg {typeof DialogProps & {transition: Boolean, header: ReactElement, onXClose: Function, expandable: Boolean, toolbar_extras: [ReactElement]}} props
 */

function Dialog(props) {
  const {
    children,
    title,
    action,
    transition = true,
    header,
    onXClose,
    expandable,
    toolbar_extras,
    ...rest
  } = props;

  const [fullScreen, setFs] = useState(false);

  return (
    <MuiDialog
      {...(transition && {
        TransitionComponent: rest.TransitionComponent || Transition,
      })}
      {...rest}
      {...(expandable && {
        fullScreen,
      })}
    >
      {(title || expandable) && (
        <>
          <DialogTitle
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            {title || <Box />}
            <Box>
              {toolbar_extras}
              {expandable && (
                <IconButton
                  title={fullScreen ? "Minimize" : "Maximize"}
                  Icon={fullScreen ? CloseFullscreenIcon : FullscreenIcon}
                  onClick={() => setFs(!fullScreen)}
                />
              )}
              <IconButton Icon={CloseIcon} onClick={onXClose} />
            </Box>
          </DialogTitle>
          {header}
        </>
      )}
      <DialogContent
        sx={{
          wordWrap: "break-word",
        }}
      >
        {typeof children === "string" ? (
          <DialogContentText sx={{ wordBreak: "normal" }}>
            {children}
          </DialogContentText>
        ) : (
          children
        )}
      </DialogContent>
      {action && (
        <DialogActions sx={{ px: 4, py: 2.5 }}>{action}</DialogActions>
      )}
    </MuiDialog>
  );
}

export { DialogProps };

export default Dialog;
