import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

import KeyIcon from "@mui/icons-material/Key";

import Copy from "./Copy";

import useKeepass from "./hooks/useKeepass";
import useSettings from "./hooks/useSettings";

import { th } from "./utils";

const Entries = () => {
  const { updateSettings } = useSettings();
  const { selectedGP } = useKeepass();
  const [selected, setSelected] = useState([]);

  const _th = Object.entries(th);

  const handleSelect = ($loc) => {
    if (selected.includes($loc)) {
      const $new = [...selected.filter((s) => s !== $loc)];
      setSelected($new);
      updateSettings("selected_entry_index", $new.at(-1));
    } else {
      setSelected([...selected, $loc]);
      updateSettings("selected_entry_index", $loc);
    }
  };

  useEffect(() => {
    updateSettings("selected_entry_index", undefined);
    setSelected([]);
  }, [selectedGP]);

  if (!selectedGP) return;

  return selectedGP.entries.map((entry) => (
    <Copy
      key={entry.uuid}
      entry={entry}
      selected={
        selected.includes(entry.$location) ? selected : [entry.$location]
      }
      Initiator={({ failed, ...props }) => (
        <TableRow
          selected={selected.includes(entry.$location)}
          hover
          sx={{ cursor: "pointer" }}
          onClick={() => handleSelect(entry.$location)}
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
