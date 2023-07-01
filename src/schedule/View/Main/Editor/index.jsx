import { useState } from "react";

import Box from "@mui/material/Box";

import MoreVertIcon from "@mui/icons-material/MoreVert";

import Menu from "../../../../common/utils/Menu";
import Worker from "./Worker";
import IconButton from "../../../../common/utils/IconButton";

import useActiveSchedule from "../../../hooks/useSchedules/active";
import useCommonSettings from "../../../../common/hooks/useSettings";

const Editor = (_props) => {
  const { selected } = useActiveSchedule();
  const [open, setOpen] = useState(false);
  const { uname } = useCommonSettings();

  const handleClose = () => setOpen(false);

  return (
    <Box>
      {selected.length > 0 && (
        <Menu
          open={open}
          onClose={handleClose}
          Clickable={(props) => (
            <IconButton
              title="Edit selected cells"
              Icon={MoreVertIcon}
              onClick={(e) => {
                if (uname === "guest") return;
                props.onClick(e);
                setOpen(true);
              }}
            />
          )}
        >
          <Worker onClose={handleClose} />
        </Menu>
      )}
    </Box>
  );
};

export default Editor;
