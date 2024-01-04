import Box from "@mui/material/Box";

import StorageIcon from "@mui/icons-material/Storage";
import LockIcon from "@mui/icons-material/Lock";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import But from "./But";
import Gps from "./Gps";
import DeleteDB from "./DeleteDB";
import ContextMenu from "../common/utils/ContextMenu";

import useKeepass from "./hooks/useKeepass";
import useSettings from "./hooks/useSettings";
import useFetcher from "./hooks/useFetcher";
import useLocalStorage from "../common/hooks/useLocalStorage";

import UploadDB from "./Upload";

import { shortenFileName } from "./utils";

const Dbs = () => {
  const { dbs, updateDB } = useKeepass();
  const { updateSettings, settings } = useSettings();
  const { remove } = useLocalStorage({ sufix: "private_" });
  const { downloadDB } = useFetcher();

  const handleLock = (db, onDone) => {
    remove("pwd_tokens");
    updateDB(`${db.index}`, {
      index: db.index,
      groups: [],
      name: db.name,
    });
    onDone?.call();
  };

  return (
    <Box
      flexGrow={1}
      pt={2}
      pl={2}
      display="flex"
      flexDirection="column"
      borderRight={(t) => `1px solid ${t.palette.divider}`}
      overflow="auto"
    >
      <Box flexGrow={1} overflow="auto" width={300}>
        {dbs.map((db) => {
          let options = [
            {
              name: "Download",
              Icon: FileDownloadIcon,
              onClick: (onDone) => downloadDB(db, onDone),
            },
          ];
          if (db.fetched)
            options = [
              ...options,
              ...[
                {
                  name: "Lock",
                  Icon: LockIcon,
                  onClick: (onDone) => handleLock(db, onDone),
                },
                {
                  name: "Delete",
                  Icon: DeleteIcon,
                },
              ],
            ];

          return (
            <Box key={db.name}>
              <Box display="flex">
                <ContextMenu
                  options={options.sort(
                    (a, b) => a.name.length - b.name.length
                  )}
                  MenuButton={({ option, onClose }) => {
                    const name = option.name;
                    if (name === "Delete")
                      return (
                        <DeleteDB
                          db={db.name}
                          Initiator={(props) => (
                            <But Icon={option.Icon} {...props}>
                              {name}
                            </But>
                          )}
                        />
                      );
                    return (
                      <But
                        Icon={option.Icon}
                        onClick={() => {
                          option.onClick(onClose);
                        }}
                      >
                        {name}
                      </But>
                    );
                  }}
                  Initiator={(props) => (
                    <But
                      title={db.name}
                      onClick={() => {
                        updateSettings("selected_dbname", db.name);
                        updateSettings(
                          "selected_gp_index",
                          `${db.index}.groups.0`
                        );
                      }}
                      Icon={StorageIcon}
                      {...(db.name === settings.selected_dbname && {
                        color: "primary",
                      })}
                      {...props}
                    >
                      {shortenFileName(db.name)}
                    </But>
                  )}
                />
              </Box>
              <Gps groups={db.groups} ml={4} db={db.name} expanded />
            </Box>
          );
        })}
      </Box>
      <UploadDB />
    </Box>
  );
};

export default Dbs;
