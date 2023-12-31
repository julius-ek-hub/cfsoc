import { useEffect } from "react";

import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

import KeyIcon from "@mui/icons-material/Key";

import useKeepass from "./hooks/useKeepass";
import useSettings from "./hooks/useSettings";

import { th } from "./utils";
import Copy from "./Copy";
import { Box } from "@mui/material";

const Entries = () => {
  const { updateSettings, settings } = useSettings();
  const { selectedGP } = useKeepass();

  const _th = Object.entries(th);

  useEffect(() => {
    updateSettings("selected_entry_index", undefined);
  }, [selectedGP]);

  if (!selectedGP) return;

  return selectedGP.entries.map((entry, index) => (
    <Copy
      key={entry.uuid}
      entry={entry}
      Initiator={({ failed, ...props }) => (
        <TableRow
          selected={settings.selected_entry_index === String(index)}
          hover
          sx={{ cursor: "pointer" }}
          onClick={() => updateSettings("selected_entry_index", String(index))}
          {...props}
        >
          {_th.map(([k], i) => (
            <TableCell key={k} sx={{ position: "relative" }}>
              {i == 0 && (
                <KeyIcon
                  fontSize="small"
                  sx={{ transform: "rotate(150deg)", position: "absolute" }}
                />
              )}
              <Box {...(i === 0 && { sx: { pl: 5 } })}>
                {k === "password" && !failed
                  ? "*".repeat(entry[k].length)
                  : entry[k]}
              </Box>
            </TableCell>
          ))}
        </TableRow>
      )}
    />
  ));
};

export default Entries;
