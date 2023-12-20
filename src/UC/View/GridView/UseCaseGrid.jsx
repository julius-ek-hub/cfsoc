import { useEffect, useRef, useState } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FullscreenIcon from "@mui/icons-material/OpenInFull";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";

import Card from "./Card";
import TableView from "../Table";
import EditUC from "../Table/EditUC";
import Middle from "../../../common/utils/Middle";
import IconButton from "../../../common/utils/IconButton";

import useSheet from "../../hooks/useSheet";
import useSettings from "../../hooks/useSettings";

const UCGrid = () => {
  const { contents } = useSheet();
  const [drawer, setDrawer] = useState();
  const [fullScreen, setFs] = useState(false);
  const [hideD, setHideD] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { updateSettings } = useSettings();

  const boxRef = useRef();

  const { l2_uc, l1_uc } = contents;

  const closeDrawer = () => {
    setDrawer(null);
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

  const handleClickForPossibleScroll = ({ clientX, clientY }) => {
    let x1 = clientX,
      y1 = clientY;
    const el = boxRef.current;
    const handleMove = (e) => {
      e.preventDefault();
      const x2 = e.clientX - x1;
      const y2 = e.clientY - y1;
      el.scroll({
        top: el.scrollTop - y2,
        left: el.scrollLeft - x2,
        behavior: "smooth",
      });
    };
    el.addEventListener("mousemove", handleMove);
    el.onmouseup = () => el.removeEventListener("mousemove", handleMove);
    el.onmouseleave = () => el.removeEventListener("mousemove", handleMove);
    el.onmouseenter = () => el.removeEventListener("mousemove", handleMove);
  };

  useEffect(() => {
    if (drawer) {
      setDrawer({
        ...drawer,
        uc: eval(drawer.location),
      });
    }
  }, [l2_uc]);

  return (
    <>
      <Box
        ref={boxRef}
        display="flex"
        flexGrow={1}
        flexDirection="column"
        overflow="auto"
        height="100%"
        onMouseDown={handleClickForPossibleScroll}
      >
        <Stack direction="row">
          {l2_uc.map((l2, l2i) => {
            const l3_len = l2.l3s.length;
            const identifier = l2.identifier.value;
            const l1_uc_identifier = l1_uc.find((l1) =>
              l1.l2_uc_identifiers.value.includes(identifier)
            )?.identifier?.value;
            return (
              <Stack key={l2._id.value}>
                <Card
                  title={l2.uc.length}
                  content={l2.name.value}
                  action={`${l3_len} Technique${l3_len > 1 ? "s" : ""}`}
                  variant="outlined"
                  onClick={() =>
                    setDrawer({
                      uc: l2.uc,
                      name: l2.name.value,
                      description: l2.description.value,
                      identifier,
                      $for: { l2_uc_identifier: identifier, l1_uc_identifier },
                      location: `l2_uc[${l2i}].uc`,
                    })
                  }
                />
                {l2.l3s.map((l3, l3i) => {
                  const l4_len = l3.l4s.length;
                  const uc_len = l3.uc.length;

                  return (
                    <Card
                      title={uc_len}
                      bg_alpha={
                        uc_len === 0
                          ? 0
                          : uc_len < 5
                          ? 0.8
                          : uc_len < 10
                          ? 0.4
                          : 1
                      }
                      content={l3.name.value}
                      action={`${l4_len} Sub Technique${l4_len > 1 ? "s" : ""}`}
                      variant="outlined"
                      key={l3._id.value}
                      onClick={() =>
                        setDrawer({
                          uc: l3.uc,
                          name: l3.name.value,
                          description: l3.description.value,
                          identifier: l3.identifier.value,
                          $for: {
                            l3_uc_identifier: l3.identifier.value,
                            l2_uc_identifier: identifier,
                            l1_uc_identifier,
                          },
                          location: `l2_uc[${l2i}].l3s[${l3i}].uc`,
                        })
                      }
                    />
                  );
                })}
              </Stack>
            );
          })}
        </Stack>
      </Box>
      <Drawer
        open={Boolean(drawer)}
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
        {drawer && (
          <>
            <Box
              display="flex"
              justifyContent="space-between"
              position="sticky"
              top={0}
              bgcolor="background.paper"
              py={1}
              px={1}
            >
              <Typography
                variant="h5"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                overflow="hidden"
              >
                {drawer.identifier} &mdash; {drawer.name}{" "}
              </Typography>
              <Box display="flex" ml={2}>
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
                {!hideD && drawer.description}
                {drawer.description.length > 100 && (
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
            {drawer.uc.length > 0 && (
              <Typography variant="h5" my={1.5} px={2}>
                {`Use case${drawer.uc.length > 1 ? "s" : ""} (${
                  drawer.uc.length
                })`}
              </Typography>
            )}
            <Box flexGrow={1} overflow="auto" px={1}>
              {drawer.uc.length === 0 ? (
                <Middle height="100%">
                  <Typography variant="h4" my={2}>
                    No Use Case
                  </Typography>
                  <EditUC $for={drawer.$for} />
                </Middle>
              ) : (
                <TableView
                  use={drawer.uc}
                  onScroll={handleScrollOpen}
                  useKey="all_uc"
                  $for={drawer.$for}
                />
              )}
            </Box>
          </>
        )}
      </Drawer>
    </>
  );
};

export default UCGrid;
