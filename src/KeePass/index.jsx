import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import TableContainer from "@mui/material/TableContainer";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";

import StorageIcon from "@mui/icons-material/Storage";
import CloseIcon from "@mui/icons-material/Close";
import FolderOffIcon from "@mui/icons-material/FolderOff";

import Dbs from "./Dbs";
import Entries from "./Entries";
import Nav from "../common/utils/Nav";
import CollcetPass from "./CollectPass";
import useKeepass from "./hooks/useKeepass";
import useFetcher from "./hooks/useFetcher";
import BottomDetails from "./BottomDetails";
import Middle from "../common/utils/Middle";
import IconButton from "../common/utils/IconButton";

import useDimension from "../common/hooks/useDimensions";
import useSettings from "./hooks/useSettings";

import { th } from "./utils";

const KeePass = () => {
  const [drawer, setDrawer] = useState(false);
  const { selectedDB, selectedGP, dbs } = useKeepass();
  const { fetchDBs, fetchContentForCache } = useFetcher();
  const { settings } = useSettings();

  const { up } = useDimension();

  useEffect(() => {
    if (dbs.length === 0) fetchDBs();
    else if (dbs.length > 0 && !selectedDB) {
      fetchContentForCache();
    }
  }, [dbs.length]);

  const _th = Object.entries(th);

  const rightSx = {
    ...(up.xlg
      ? { width: 1300 }
      : up.lg
      ? { width: 900 }
      : up.md
      ? { width: 500 }
      : { width: "100vw" }),
  };

  return (
    <Box display="flex" flexDirection="column" height="100%" overflow="hidden">
      <Box>
        <Nav app="KeePass DB" title={`CFSOC KeePass DB`} />
      </Box>
      <Box
        display="flex"
        flexGrow={1}
        flexDirection="column"
        overflow="auto"
        alignItems="center"
      >
        <Box display="flex" height="100%" flexDirection="column">
          {rightSx.width === "100vw" && (
            <>
              <Box my={1}>
                <IconButton
                  Icon={StorageIcon}
                  onClick={() => setDrawer(true)}
                />
                {settings.selected_dbname}
              </Box>
              <Divider />
            </>
          )}
          <Box flexGrow={1} overflow="auto" width="100%">
            <Box display="flex" height="100%" width="100%">
              {rightSx.width === "100vw" ? (
                <Drawer open={drawer} onClose={() => setDrawer(false)}>
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
                    <IconButton
                      Icon={CloseIcon}
                      onClick={() => setDrawer(false)}
                    />
                  </Box>
                  <Dbs />
                </Drawer>
              ) : (
                <Dbs />
              )}
              <Box display="flex" height="100%" {...rightSx}>
                {!selectedDB && (
                  <Middle flexGrow={1}>No Database selected</Middle>
                )}
                {selectedDB && !selectedDB.fetched && <CollcetPass />}
                {selectedDB &&
                  selectedDB.fetched &&
                  selectedGP &&
                  selectedGP.entries.length == 0 && (
                    <Middle p={2} flexGrow={1} sx={{ color: "text.secondary" }}>
                      <FolderOffIcon sx={{ fontSize: 200 }} />
                      No Entries
                    </Middle>
                  )}
                {selectedDB &&
                  selectedGP &&
                  selectedDB.fetched &&
                  selectedGP.entries.length > 0 && (
                    <TableContainer sx={{ height: "100%" }}>
                      {selectedGP && (
                        <Table stickyHeader size="small">
                          <TableHead>
                            <TableRow>
                              {_th.map(([k, v]) => (
                                <TableCell key={k}>{v.label}</TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <Entries />
                          </TableBody>
                        </Table>
                      )}
                    </TableContainer>
                  )}
              </Box>
            </Box>
          </Box>
          <BottomDetails {...rightSx} />
        </Box>
      </Box>
    </Box>
  );
};

export default KeePass;
