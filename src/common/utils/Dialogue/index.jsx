import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Zoom,
} from "@mui/material";
import { forwardRef } from "react";

import { DialogProps } from "./types";

const Transition = forwardRef(function Transition(
  { Component: TC = Zoom, ...props },
  ref
) {
  return <TC ref={ref} {...props} />;
});

/**
 * Customized Dialog base component
 * @arg {typeof DialogProps & {transition: Boolean}} props
 */

function Dialog(props) {
  const { children, title, action, transition = true, ...rest } = props;
  return (
    <MuiDialog
      {...(transition && {
        TransitionComponent: rest.TransitionComponent || Transition,
      })}
      {...rest}
    >
      {title && <DialogTitle>{title}</DialogTitle>}
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
