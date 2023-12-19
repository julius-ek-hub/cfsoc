import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";

import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";

import Card from "./Card";
import IconButton from "../../../common/utils/IconButton";

import useSheet from "../../hooks/useSheet";
import useSettings from "../../hooks/useSettings";
import Middle from "../../../common/utils/Middle";
import TableView from "../Table";
import EditUC from "../Table/EditUC";

const UCGrid = () => {
  const { contents } = useSheet();
  const [drawer, setDrawer] = useState();
  const [fullScreen, setFs] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { updateSettings } = useSettings();

  const { l2_uc, l1_uc } = contents;

  const closeDrawer = () => {
    setDrawer(null);
    setFs(false);
    updateSettings("rowsPerPage", 30);
    updateSettings("page", 0);
    setScrolled(false);
  };

  const handleScrollOpen = () => {
    if (scrolled) return;
    setScrolled(true);
    setFs(true);
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
        display="flex"
        flexGrow={1}
        flexDirection="column"
        overflow="auto"
        height="100%"
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
        <Drawer
          open={Boolean(drawer)}
          anchor="bottom"
          onClose={closeDrawer}
          sx={{
            "& .MuiPaper-root": {
              height: `${fullScreen ? 100 : 50}vh !important`,
              p: 2,
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          {drawer && (
            <>
              <Box display="flex" justifyContent="space-between">
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
              <Box mt={2}>
                <Typography>{drawer.description}</Typography>
              </Box>
              {drawer.uc.length > 0 && (
                <Typography variant="h5" mt={1.5}>
                  {`Use case${drawer.uc.length > 1 ? "s" : ""} (${
                    drawer.uc.length
                  })`}
                </Typography>
              )}
              <Box flexGrow={1} overflow="auto">
                {drawer.uc.length === 0 ? (
                  <Middle height="100%">
                    <Typography variant="h4" mb={2}>
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
      </Box>
    </>
  );
};

export default UCGrid;
