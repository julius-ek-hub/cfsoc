import { useState } from "react";

import MenuMUI from "@mui/material/Menu";

import Dialog from "../Dialogue";
import useDimension from "../../hooks/useDimensions";

export default function Menu({
  Initiator,
  onClose,
  open: op,
  dialog,
  backdrop_color,
  alpha,
  no_tip,
  stateless,
  ...rest
}) {
  const [cords, setCords] = useState(null);
  const [_open, setOpen] = useState(false);

  const { t } = useDimension();

  const open = stateless ? _open : op;

  const handleClick = (e) => {
    const touch = e.type.match(/touch/i);
    setCords({
      top: (touch ? e.changedTouches[0].clientY : e.clientY) + 12,
      left: (touch ? e.changedTouches[0].clientX : e.clientX) + 16,
    });
    stateless && setOpen(true);
  };

  const handleClose = stateless ? () => setOpen(false) : onClose;

  const bgV = (t.palette.mode === "light" ? 255 : 0) + ", ";

  return (
    <>
      <Initiator onClick={handleClick} />
      {dialog ? (
        <Dialog open={open} onClose={handleClose} {...rest} />
      ) : (
        <MenuMUI
          open={open}
          onClose={handleClose}
          {...(cords && {
            anchorPosition: {
              top: cords.top,
              left: cords.left,
            },
            anchorReference: "anchorPosition",
          })}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                ...(!no_tip && {
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                }),
              },
            },
          }}
          {...(backdrop_color ||
            (typeof alpha === "number" && {
              BackdropProps: {
                sx: {
                  bgcolor: backdrop_color || `rgba(${bgV.repeat(3)} ${alpha})`,
                },
              },
            }))}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          {...rest}
        />
      )}
    </>
  );
}
