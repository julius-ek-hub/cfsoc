import Box from "@mui/material/Box";

import WorkspacesIcon from "@mui/icons-material/Workspaces";
import CheckIcon from "@mui/icons-material/Check";

import ContextMenu from "../common/utils/ContextMenu";
import But from "./But";

import useSettings from "./hooks/useSettings";

const Gps = ({ groups = [], $key = "", db, ...props }) => {
  const { updateSettings, settings } = useSettings();

  return (
    <Box {...props}>
      {groups.map((group, index) => (
        <Box key={group.uuid}>
          <ContextMenu
            options={[
              { name: "Rename" },
              { name: "Delete" },
              { name: "Add Entry" },
              { name: "Add Group" },
            ]}
            Initiator={(props) => (
              <But
                {...props}
                Icon={WorkspacesIcon}
                onClick={() => {
                  updateSettings("selected_gp_index", `${$key}.${index}`);
                  updateSettings("selected_dbname", db);
                }}
                {...(settings.selected_gp_index === `${$key}.${index}` && {
                  color: "primary",
                  EndIcon: CheckIcon,
                })}
              >
                {group.name}
              </But>
            )}
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
          />
          <Gps
            groups={group.groups}
            ml={2.9}
            $key={`${$key}.${index}.groups`}
            db={db}
            borderLeft={(t) => `1px solid ${t.palette.divider}`}
          />
        </Box>
      ))}
    </Box>
  );
};

export default Gps;
