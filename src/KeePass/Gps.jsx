import Box from "@mui/material/Box";

import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RestoreIcon from "@mui/icons-material/Restore";
import RecyclingIcon from "@mui/icons-material/Recycling";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import EmailIcon from "@mui/icons-material/Email";
import FolderIcon from "@mui/icons-material/Folder";
import WifiIcon from "@mui/icons-material/Wifi";
import PublicIcon from "@mui/icons-material/Public";
import WindowIcon from "@mui/icons-material/Window";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import ContextMenu from "../common/utils/ContextMenu";
import AddEntry from "./AddEntry";
import AddGroup from "./AddGroup";
import RestoreEntryOrGroup from "./Restore";
import DeleteEntryOrgroup from "./Delete";
import MoveEntryOrGroup from "./Move";
import But from "./But";
import RestoreRB from "./RestoreRB";
import EmptyRB from "./EmptyRB";

import useSettings from "./hooks/useSettings";
import useKeepass from "./hooks/useKeepass";

import { deepKey } from "../common/utils/utils";

const Gps = ({ groups = [], expanded, db, ...props }) => {
  const { updateSettings, settings } = useSettings();
  const { dbs } = useKeepass();

  const icons = {
    trashbin: RecyclingIcon,
    homebanking: AccountBalanceIcon,
    email: EmailIcon,
    world: PublicIcon,
    networkserver: WifiIcon,
    drivewindows: WindowIcon,
    folder: FolderIcon,
    folderopen: FolderOpenIcon,
  };

  const getExpanLocation = ($loc) => $loc.split(".").join("_");

  const Initiator = ({ gp, ...props }) => {
    const exp = getExpanLocation(`expanded_${gp.$location}`);
    return (
      <But
        Icon={
          ["folder", "folderopen"].includes(gp.icon) && !expanded
            ? settings[exp]
              ? icons.folderopen
              : icons.folder
            : icons[gp.icon] || icons.folder
        }
        {...props}
        onClick={() => {
          updateSettings("selected_gp_index", `${gp.$location}`);
          updateSettings("selected_dbname", db);
          !expanded && updateSettings(exp, !Boolean(settings[exp]));
        }}
        {...(settings.selected_gp_index === `${gp.$location}` && {
          color: "primary",
          EndIcon: CheckIcon,
        })}
      />
    );
  };

  const _gps = groups.map((gp, index) => ({
    ...gp,
    index,
    icon: ["folder", "folderopen"].includes(gp.icon)
      ? gp.expanded
        ? "folderopen"
        : "folder"
      : gp.icon,
  }));
  const gps = [
    ..._gps
      .filter((gp) => !gp.recyclebin)
      .sort((a, b) => a.name.localeCompare(b.name)),
    ..._gps.filter((gp) => gp.recyclebin),
  ];
  const getTEG = (gp) => {
    const e = gp.entries.length;
    const g = gp.groups.length;
    return `(${g > 100 ? "99+" : g}, ${e > 100 ? "99+" : e})`;
  };

  const forMove = settings.move_group_entity || [];

  const mv = deepKey(forMove[0], dbs) || {};
  const mvname = mv.groups ? "Group" : "Entry";

  const one = forMove.length === 1;

  const mvn = one ? mvname : mvname === "Entry" ? "Entries" : mvname + "s";

  return (
    <Box {...props}>
      {gps.map((group) => {
        const $exp = settings[getExpanLocation(`expanded_${group.$location}`)];
        const gpLen = group.groups.length;
        const enLen = group.entries.length;
        const title = `${gpLen} group${gpLen == 1 ? "" : "s"}, ${enLen} entr${
          enLen == 1 ? "y" : "ies"
        }`;

        let actions = [
          { name: "Rename", id: "rg" },
          { name: "Delete", id: "dg" },
          { name: "Add Entry", id: "ae" },
          { name: "Add Group", id: "ag" },
          { name: "Move Group", id: "mg" },
          ,
        ];

        if (group.deleted)
          actions = [
            { name: "Restore Group", id: "rsg" },
            {
              name: "Permanently Delete Group",
              id: "dg",
              permanent: true,
            },
          ];
        else {
          if (group.recyclebin) {
            actions = [
              { name: "Empty Recycle Bin", id: "erb", permanent: true },
              {
                name: "Restore All Items",
                id: "rai",
              },
            ];
          } else {
            if (group.default)
              actions = actions.filter((a) => !["dg", "mg"].includes(a.id));
            if (mv.uuid && mv.uuid !== group.uuid && mv.opuuid !== group.uuid)
              actions.push({
                name: `Move ${mvn} Here`,
                id: "mh",
              });
          }
        }

        return (
          <Box key={group.uuid}>
            <ContextMenu
              options={actions}
              Initiator={(props) => (
                <Initiator gp={group} title={title} {...props}>
                  {group.name} {getTEG(group)}
                </Initiator>
              )}
              MenuButton={({ option, onClose }) => {
                const Butt = (props) => <But {...props}>{option.name}</But>;
                return option.id === "ae" ? (
                  <Butt
                    Wrapper={(props) => (
                      <AddEntry
                        {...props}
                        $location={group.$location}
                        onDone={onClose}
                      />
                    )}
                    Icon={AddIcon}
                  />
                ) : ["ag", "rg"].includes(option.id) ? (
                  <Butt
                    Wrapper={(props) => (
                      <AddGroup
                        {...props}
                        $location={group.$location}
                        edit={option.id === "rg"}
                        onDone={onClose}
                      />
                    )}
                    Icon={option.id === "ag" ? AddIcon : EditIcon}
                  />
                ) : option.id === "dg" ? (
                  <Butt
                    color="error"
                    Wrapper={(props) => (
                      <DeleteEntryOrgroup
                        {...props}
                        $location={[group.$location]}
                        name="Group"
                        path="/group"
                        permanent={option.permanent}
                      />
                    )}
                    Icon={DeleteIcon}
                  />
                ) : option.id === "rsg" ? (
                  <Butt
                    Wrapper={(props) => (
                      <RestoreEntryOrGroup
                        {...props}
                        $location={[group.$location]}
                        name="Group"
                        path="/group"
                      />
                    )}
                    Icon={RestoreIcon}
                  />
                ) : option.id === "mg" ? (
                  <Butt
                    Wrapper={(props) => (
                      <MoveEntryOrGroup
                        {...props}
                        $location={[group.$location]}
                        name="Group"
                        path="/group"
                        onDone={onClose}
                      />
                    )}
                    Icon={DriveFileMoveIcon}
                  />
                ) : option.id === "mh" ? (
                  <Butt
                    Wrapper={(props) => (
                      <MoveEntryOrGroup.Move
                        {...props}
                        $to={group.$location}
                        $target={settings.move_group_entity}
                        name={mvname}
                        onDone={onClose}
                      />
                    )}
                    Icon={ContentPasteIcon}
                  />
                ) : option.id === "erb" ? (
                  <Butt
                    color="error"
                    Wrapper={(props) => <EmptyRB {...props} onDone={onClose} />}
                    Icon={DeleteForeverIcon}
                  />
                ) : option.id === "rai" ? (
                  <Butt
                    Wrapper={(props) => (
                      <RestoreRB {...props} onDone={onClose} />
                    )}
                    Icon={RestoreFromTrashIcon}
                  />
                ) : (
                  <Butt />
                );
              }}
            />
            {($exp || expanded) && (
              <Gps
                groups={group.groups}
                ml={2.9}
                db={db}
                borderLeft={(t) => `1px solid ${t.palette.divider}`}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default Gps;
