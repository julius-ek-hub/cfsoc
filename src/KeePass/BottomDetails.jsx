import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";

import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";

import IconButton from "../common/utils/IconButton";

import useKeepass from "./hooks/useKeepass";
import useSettings from "./hooks/useSettings";

import { deepKey } from "../common/utils/utils";
import { th } from "./utils";
import Middle from "../common/utils/Middle";
import { Button } from "@mui/material";
import { useState } from "react";

const BottomDetails = (props) => {
  const [drawer, setDrawer] = useState(false);
  const { dbs } = useKeepass();
  const { settings } = useSettings();

  const ei = settings.selected_entry_index;
  const gi = settings.selected_gp_index;

  if (!ei || !gi) return null;

  const v = deepKey(`${gi}.entries.${ei}`, dbs);

  if (!v) return null;

  return (
    <Middle pb={3} pt={2}>
      <Button
        size="small"
        color="inherit"
        endIcon={<VisibilityIcon />}
        onClick={() => setDrawer(true)}
      >
        Show All Entry Info
      </Button>
      <Drawer open={drawer} anchor="bottom" onClose={() => setDrawer(false)}>
        <Box
          position="sticky"
          top={0}
          bgcolor="background.paper"
          sx={{ zIndex: 1 }}
          display="flex"
          justifyContent="end"
          pt={1}
          pr={2}
        >
          <IconButton Icon={CloseIcon} onClick={() => setDrawer(false)} />
        </Box>
        <Box p={2}>
          {Object.entries(v).map(([k, v]) => [
            <strong key={k}>{(th[k]?.label || k) + ": "}</strong>,
            (k === "password" ? "*".repeat(v.length) : v) + ", ",
          ])}
        </Box>
      </Drawer>
    </Middle>
  );
};

export default BottomDetails;
