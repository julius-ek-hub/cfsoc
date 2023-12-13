import { useMemo, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Drawer from "@mui/material/Drawer";

import CloseIcon from "@mui/icons-material/Close";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

import IconButton from "../../common/utils/IconButton";

import useSheet from "../hooks/useSheet";
import useDimension from "../../common/hooks/useDimensions";

import { _entr } from "./utils";

const Sections = () => {
  const { sheet_names, active_sheet } = useSheet();
  const [open, setOpen] = useState(false);
  const { up } = useDimension();

  const { search } = useLocation();
  const navigate = useNavigate();

  const { key, num_rows } = active_sheet || {};

  const handleChange = (e, newSection) => {
    navigate("/use-case-management/" + newSection + search);
  };

  const shouldDraw = useMemo(() => {
    if (up.lg) return false;
    if (up.md && num_rows <= 5000) return false;
    return true;
  }, [up]);

  const handleClose = () => setOpen(false);

  const Sheets = ({ orientation = "horizontal" }) =>
    sheet_names.length > 0 && (
      <Tabs
        variant="scrollable"
        onChange={handleChange}
        value={active_sheet ? key : ""}
        scrollButtons={true}
        orientation={orientation}
      >
        {sheet_names.map(({ key, name }) => (
          <Tab label={name} value={key} key={key} />
        ))}
      </Tabs>
    );

  return (
    <Box display="flex" alignItems="center">
      {shouldDraw ? (
        <>
          <IconButton Icon={MenuOpenIcon} onClick={() => setOpen(true)} />
          <Drawer
            sx={{ ".MuiPaper-root": { width: 300, maxWidth: "100%" } }}
            open={open}
            onClose={handleClose}
          >
            <Box display="flex" justifyContent="end" my={1} mr={2}>
              <IconButton Icon={CloseIcon} onClick={handleClose} />
            </Box>
            <Sheets orientation="vertical" />
          </Drawer>
        </>
      ) : (
        <Sheets />
      )}
    </Box>
  );
};

export default Sections;
