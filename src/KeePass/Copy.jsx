import { useState } from "react";

import copy from "copy-to-clipboard";
import EditIcon from "@mui/icons-material/Edit";
import LaunchIcon from "@mui/icons-material/Launch";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";

import ContextMenu from "../common/utils/ContextMenu";
import DeleteEntryOrgroup from "./Delete";
import RestoreEntryOrGroup from "./Restore";
import MoveEntryOrGroup from "./Move";
import AddEntry from "./AddEntry";
import But from "./But";

import useToasts from "../common/hooks/useToast";
import useKeepass from "./hooks/useKeepass";

import { th } from "./utils";

const Copy = ({ Initiator, entry, selected }) => {
  const { push } = useToasts();
  const { selectedGP } = useKeepass();
  const [failed, setFailed] = useState(false);

  const _th = Object.entries(th);

  const handleCopy = async (txt, label = "Text") => {
    const success = () =>
      push({ message: `${label} copied to clipboard!`, severity: "success" });

    try {
      await navigator.clipboard.writeText(txt);
      success();
    } catch (error) {
      try {
        if (!copy(txt)) throw new Error("Failed to copy");
        success();
      } catch (error) {
        push({
          message: `Failed to copy ${label}, all fields have been made vissible for you to copy manually`,
          severity: "error",
        });
        setFailed(true);
      }
    }
  };

  if (!selectedGP) return;

  const actions = [
    ..._th.filter(([k]) => entry[k]),
    ["__move", "Move"],
    ["__edit", "Edit"],
    ["__delete", "Delete"],
    ["__url", "URL"],
  ].filter(([k]) => (k === "__url" ? entry.url : true));

  return (
    <ContextMenu
      Initiator={(props) => <Initiator {...props} failed={failed} />}
      noContextMenu={failed}
      options={
        entry.deleted
          ? [
              ["__restore", "Restore"],
              ["__delete", "Permanently Delete"],
            ]
          : selected.length > 1
          ? [
              ["__move", "Move"],
              ["__delete", "Delete"],
            ]
          : actions
      }
      MenuButton={({ option: [k, v], onClose }) => {
        const iscopy = ![
          "__edit",
          "__delete",
          "__url",
          "__restore",
          "__move",
        ].includes(k);
        const openLink = k === "__url";
        const BBut = (props) => (
          <But
            disabled={!iscopy && !openLink}
            Icon={iscopy ? ContentCopyIcon : openLink ? LaunchIcon : null}
            onClick={async () => {
              iscopy && (await handleCopy(entry[k], v.label));
              onClose?.call();
            }}
            {...props}
            {...(openLink && { href: entry.url, target: "_blank" })}
          >
            {iscopy
              ? `Copy ${v.label}`
              : openLink
              ? `Open URL`
              : `${v} ${
                  ["__move", "__delete", "__restore"].includes(k) &&
                  selected.length > 1
                    ? "Entries"
                    : "Entry"
                }`}
          </But>
        );
        return k === "__edit" ? (
          <BBut
            Wrapper={(props) => (
              <AddEntry
                {...props}
                $location={selected[0]}
                edit
                onDone={onClose}
              />
            )}
            disabled={false}
            Icon={EditIcon}
          />
        ) : k === "__delete" ? (
          <BBut
            color="error"
            Wrapper={(props) => (
              <DeleteEntryOrgroup
                {...props}
                $location={selected}
                edit
                permanent={v.match(/permanently/i)}
                onDone={onClose}
              />
            )}
            disabled={false}
            Icon={DeleteIcon}
          />
        ) : k === "__restore" ? (
          <BBut
            Wrapper={(props) => (
              <RestoreEntryOrGroup
                {...props}
                $location={selected}
                edit
                onDone={onClose}
              />
            )}
            disabled={false}
            Icon={RestoreIcon}
          />
        ) : k === "__move" ? (
          <BBut
            Wrapper={(props) => (
              <MoveEntryOrGroup
                {...props}
                $location={selected}
                onDone={onClose}
              />
            )}
            disabled={false}
            Icon={DriveFileMoveIcon}
          />
        ) : (
          <BBut />
        );
      }}
    />
  );
};

export default Copy;
