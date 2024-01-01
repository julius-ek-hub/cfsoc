import Box from "@mui/material/Box";

import FileUploadIcon from "@mui/icons-material/FileUpload";
import StorageIcon from "@mui/icons-material/Storage";
import LockIcon from "@mui/icons-material/Lock";

import But from "./But";
import Gps from "./Gps";
import IconButton from "../common/utils/IconButton";
import ContextMenu from "../common/utils/ContextMenu";

import useKeepass from "./hooks/useKeepass";
import useSettings from "./hooks/useSettings";
import useFetcher from "./hooks/useFetcher";
import useLocalStorage from "../common/hooks/useLocalStorage";

import { shortenFileName } from "./utils";
import UploadDB from "./Upload";

const Dbs = () => {
  const { dbs, updateDB } = useKeepass();
  const { updateSettings, settings } = useSettings();
  const { uploadDB } = useFetcher();
  const { remove } = useLocalStorage();

  const handleLock = (db) => {
    remove("pwd_tokens");
    updateDB(`${db.index}`, {
      index: db.index,
      groups: [],
      name: db.name,
    });
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
      <Box flexGrow={1} overflow="auto" width={260}>
        {dbs.map((db) => (
          <Box key={db.name}>
            <Box display="flex">
              {db.fetched && (
                <IconButton
                  title="Lock Workspace"
                  Icon={LockIcon}
                  iprop={{ fontSize: "small", sx: { color: "text.secondary" } }}
                  size="small"
                  onClick={() => handleLock(db)}
                />
              )}
              <ContextMenu
                options={[
                  { name: "Rename" },
                  { name: "Replace" },
                  { name: "Delete" },
                ]}
                MenuButton={({ option, onClose }) => (
                  <But
                    disabled
                    onClick={async () => {
                      onClose?.call();
                    }}
                  >
                    {option.name}
                  </But>
                )}
                Initiator={(props) => (
                  <But
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
            <Gps
              groups={db.groups}
              ml={6.8}
              $key={`${db.index}.groups`}
              db={db.name}
            />
          </Box>
        ))}
      </Box>
      <UploadDB />
    </Box>
  );
};

export default Dbs;
