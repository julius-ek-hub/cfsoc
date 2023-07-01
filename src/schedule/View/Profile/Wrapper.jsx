import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Slide from "@mui/material/Slide";

import useDimension from "../../../common/hooks/useDimensions";
import useSettings from "../../hooks/useSettings";

const WithWrapper = (props) => {
  const { up, t } = useDimension();
  const { show_profile, update } = useSettings();

  const sp = show_profile === "true";

  if (up.lg)
    return (
      <Slide in={sp} direction="right" unmountOnExit>
        <Box
          sx={{ width: 400, flexShrink: 0 }}
          {...props}
          borderRight={`1px solid ${t.palette.divider}`}
        />
      </Slide>
    );
  return (
    <Drawer
      open={sp}
      anchor="left"
      SlideProps={{ direction: "right" }}
      onClose={() => update("show_profile", sp ? "false" : "true")}
      ModalProps={{ keepMounted: true }}
      sx={{
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: up.sm ? 400 : "80%",
        },
      }}
      {...props}
    />
  );
};

export default WithWrapper;
