import { useState } from "react";

import copy from "copy-to-clipboard";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LaunchIcon from "@mui/icons-material/Launch";

import ContextMenu from "../common/utils/ContextMenu";
import But from "./But";

import useToasts from "../common/hooks/useToast";
import useKeepass from "./hooks/useKeepass";

import { th } from "./utils";

const Copy = ({ Initiator, entry }) => {
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

  return (
    <ContextMenu
      Initiator={(props) => <Initiator {...props} failed={failed} />}
      noContextMenu={failed}
      options={[
        ..._th.filter(([k]) => entry[k]),
        ["__edit", "Edit"],
        ["__add", "Add"],
        ["__delete", "Delete"],
        ["__url", "URL"],
      ]}
      MenuButton={({ option: [k, v], onClose }) => {
        const iscopy = !["__edit", "__add", "__delete", "__url"].includes(k);
        const openLink = k === "__url";
        return (
          <But
            disabled={!iscopy && !openLink}
            Icon={iscopy ? ContentCopyIcon : openLink ? LaunchIcon : null}
            onClick={async () => {
              iscopy && (await handleCopy(entry[k], v.label));
              onClose?.call();
            }}
            {...(openLink && { href: entry.url, target: "_blank" })}
          >
            {iscopy ? `Copy ${v.label}` : openLink ? `Open URL` : `${v} Entry`}
          </But>
        );
      }}
    />
  );
};

export default Copy;
