import { useRef, useState } from "react";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import Menu from "../Menu";

const ContextMenu = ({
  Initiator,
  options = [],
  MenuButton = Button,
  noContextMenu,
}) => {
  const [context, setContext] = useState(false);

  const is_safari = navigator.userAgent.match(/iphone/i);

  const t1 = useRef();

  const handleClose = () => setContext(false);

  const handleTouchStart = (e) => {
    if (!is_safari) return;
    t1.current = Date.now();
  };
  const handleTouchEnd = (e, call) => {
    if (!is_safari) return;
    if ((Date.now() - t1.current) / 1000 > 0.5) {
      setContext(true);
      call(e);
    }
  };

  return (
    <Menu
      alpha={0.5}
      open={context}
      onClose={handleClose}
      Initiator={(props) => (
        <Initiator
          {...(!noContextMenu && {
            onContextMenu: (e) => {
              if (is_safari) return;
              e.preventDefault();
              setContext(true);
              props.onClick(e);
            },
            onTouchStart: handleTouchStart,
            onTouchEnd: (e) => handleTouchEnd(e, props.onClick),
          })}
        />
      )}
    >
      <Stack p={2}>
        {options.map((option) => (
          <MenuButton
            key={JSON.stringify(option)}
            onClose={handleClose}
            option={option}
          />
        ))}
      </Stack>
    </Menu>
  );
};

export default ContextMenu;
