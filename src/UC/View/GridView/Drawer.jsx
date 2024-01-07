import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DrawerMui from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FullscreenIcon from "@mui/icons-material/OpenInFull";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";

import TableView from "../Table";
import EditUC from "../Table/EditUC";
import Middle from "../../../common/utils/Middle";
import IconButton from "../../../common/utils/IconButton";

import useSettings from "../../hooks/useSettings";
import useFetcher from "../../hooks/useFetcher";

const Drawer = ({
  Initiator,
  $for,
  uc: _uc = [],
  description = "",
  name = "",
  identifier,
}) => {
  const [open, setOpen] = useState(false);
  const [fullScreen, setFs] = useState(false);
  const [hideD, setHideD] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { updateSettings } = useSettings();
  const { downloadUC } = useFetcher();
  const [uc, setUC] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const closeDrawer = () => {
    setOpen(false);
    setFs(false);
    updateSettings("rowsPerPage", 30);
    updateSettings("page", 0);
    setScrolled(false);
    setHideD(false);
  };

  const handleScrollOpen = () => {
    if (scrolled) return;
    setScrolled(true);
    setFs(true);
  };

  useEffect(() => {
    if (open) {
      setUC(_uc);
      setLoaded(true);
    }
  }, [open]);

  return (
    <>
      <Initiator
        onClick={() => setOpen(true)}
        p={0.4}
        tabIndex={1}
        sx={{
          border: "2px solid transparent",
          "&:focus": {
            border: (t) => `2px solid ${t.palette.primary.main}`,
          },
        }}
      />
      <DrawerMui
        open={open}
        anchor="bottom"
        onClose={closeDrawer}
        sx={{
          "& .MuiPaper-root": {
            height: `${fullScreen ? 100 : 50}vh !important`,
            pb: 2,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {open && loaded && (
          <>
            <Box
              display="flex"
              justifyContent="space-between"
              position="sticky"
              top={0}
              bgcolor="background.paper"
              py={1}
              pt={2}
              px={1}
            >
              <Typography
                variant="h5"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                overflow="hidden"
              >
                {identifier} &mdash; {name}
              </Typography>
              <Box display="flex" ml={2} gap={2}>
                <IconButton
                  title={"Download XLSX"}
                  Icon={DownloadIcon}
                  onClick={() => downloadUC(uc, `${identifier}_${name}`)}
                />
                <IconButton
                  title={fullScreen ? "Minimize" : "Maximize"}
                  Icon={fullScreen ? CloseFullscreenIcon : FullscreenIcon}
                  onClick={() => setFs(!fullScreen)}
                />

                <IconButton
                  Icon={CloseIcon}
                  onClick={closeDrawer}
                  title="Close"
                />
              </Box>
            </Box>
            <Box mt={2} px={2}>
              <Typography>
                {!hideD && description}
                {description.length > 100 && (
                  <Button
                    size="small"
                    sx={{ display: "inline-flex", p: 0, ml: 1 }}
                    onClick={() => setHideD(!hideD)}
                    endIcon={hideD ? <VisibilityIcon /> : <VisibilityOff />}
                  >
                    {hideD ? "Show description" : "Hide description"}
                  </Button>
                )}
              </Typography>
            </Box>
            {uc.length > 0 && (
              <Typography variant="h5" my={1.5} px={2}>
                {`Use case${uc.length > 1 ? "s" : ""} (${uc.length})`}
              </Typography>
            )}
            <Box flexGrow={1} overflow="auto" px={1}>
              {uc.length === 0 ? (
                <Middle height="100%">
                  <Typography variant="h4" my={2}>
                    No Use Case
                  </Typography>
                  <EditUC $for={$for} />
                </Middle>
              ) : (
                <TableView
                  use={uc}
                  onScroll={handleScrollOpen}
                  useKey="all_uc"
                  $for={$for}
                />
              )}
            </Box>
          </>
        )}
      </DrawerMui>
    </>
  );
};

export default Drawer;
