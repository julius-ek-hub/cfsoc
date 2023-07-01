import { useState } from "react";
import MenuMUI from "@mui/material/Menu";

export default function Menu({ Clickable, onClose, open, ...rest }) {
  const [cords, setCords] = useState(null);

  const handleClick = (event) => {
    setCords({
      top: event.clientY + 12,
      left: event.clientX + 16,
    });
  };

  return (
    <>
      <Clickable onClick={handleClick} />
      <MenuMUI
        open={open}
        onClose={onClose}
        {...(cords && {
          anchorPosition: {
            top: cords.top,
            left: cords.left,
          },
          anchorReference: "anchorPosition",
        })}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
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
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        {...rest}
      />
    </>
  );
}
