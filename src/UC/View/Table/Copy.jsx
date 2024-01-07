import { useState } from "react";

import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import WarningIcon from "@mui/icons-material/Warning";

import IconButton from "../../../common/utils/IconButton";
import Confirm from "../../../common/utils/Comfirm";

import useToasts from "../../../common/hooks/useToast";
import useSettings from "../../hooks/useSettings";
import useSheet from "../../hooks/useSheet";

import { _entr, entr_ } from "../../../common/utils/utils";

const Copy = ({ selected }) => {
  const [copied, setCopied] = useState({});
  const { sheets, contents } = useSheet();
  // const { updateSettings } = useSettings();
  // const { push } = useToasts();

  const all_uc = sheets.all_uc;

  const cols = _entr(all_uc.columns)
    .sort((a, b) => a[1].position - b[1].position)
    .filter(
      ([k]) =>
        ![
          ...all_uc.excluded_columns,
          "identifier",
          "name",
          "description",
        ].includes(k)
    );

  const sel = contents.all_uc.find((uc) => uc._id.value === selected);
  const all_selected = _entr(copied).length === cols.length;
  const isSelected = (k) => copied.hasOwnProperty(k);

  const handleSelectAll = () => {
    if (all_selected) return setCopied([]);
    setCopied(entr_([...cols].map(([k]) => [k, sel[k].value])));
  };

  const handleSelect = (k) => {
    let co = { ...copied };
    if (isSelected(k)) {
      delete co[k];
      return setCopied(co);
    }
    setCopied({ ...co, [k]: sel[k].value });
  };

  // const handleCopy = () => {
  //   updateSettings("clipboard", copied);
  //   push({ message: "Copied", severity: "success" });
  // };

  return (
    <Confirm
      // onConfirm={handleCopy}
      onClose={() => setCopied([])}
      title="Copy Key-Values"
      ok_text="Copy"
      disabled
      // disabled={_entr(copied).length === 0} Just uncomment this when feature is enabled
      Initiator={(props) => (
        <IconButton Icon={ContentCopyIcon} title="Copy key-values" {...props} />
      )}
    >
      <Typography mx={2} mb={1}>
        You may want to copy key-values that you want to paste to multiple rows
        at once.
      </Typography>
      <Stack>
        <Box display="flex" alignItems="center">
          <Checkbox checked={all_selected} onChange={handleSelectAll} />
          <Box>Select All</Box>
        </Box>
        {cols.map(([k, v]) => (
          <Box key={k} display="flex" alignItems="center">
            <Checkbox
              checked={isSelected(k)}
              onChange={() => handleSelect(k)}
            />
            <Box>
              {v.label} : {sel[k].value || "Blanc"}
            </Box>
          </Box>
        ))}
      </Stack>
      <Divider sx={{ my: 2 }} />
      <Box display="inline-flex" color="error.main">
        <WarningIcon fontSize="small" /> This feature has been disabled for now,
        you can request it if you want.
      </Box>
    </Confirm>
  );
};

export default Copy;
