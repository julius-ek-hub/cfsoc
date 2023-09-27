import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Zoom,
} from "@mui/material";
import { forwardRef, ReactElement } from "react";

// import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import CloseFullscreenIcon from "@mui/icons-material/Close";

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
 * @arg {typeof DialogProps & {transition: Boolean, header: ReactElement, onXClose: Function}} props
 */

function Dialog(props) {
  const {
    children,
    title,
    action,
    transition = true,
    header,
    onXClose,
    ...rest
  } = props;
  return (
    <MuiDialog
      {...(transition && {
        TransitionComponent: rest.TransitionComponent || Transition,
      })}
      {...rest}
    >
      {title && (
        <>
          <DialogTitle
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            {title}
            <IconButton Icon={CloseFullscreenIcon} onClick={onXClose} />
          </DialogTitle>
          {header}
        </>
      )}
      <DialogContent>
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
