import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import useSheet from "../hooks/useSheet";
import useFilter from "../hooks/useFilter";
import IconButton from "../../common/utils/IconButton";

import { field_separator as fs } from "./utils";

import useSettings from "../hooks/useSettings";

export default function ExcludedColumns() {
  const { active_sheet, updateSheet } = useSheet();
  const { unHideColumn, excluded_columns } = useFilter();
  const { updateSettings } = useSettings();

  if (!active_sheet) return null;

  const { columns, key } = active_sheet;

  const len = excluded_columns.length;

  if (len === 0) return null;

  const unhideAll = () => {
    updateSheet(`${key + fs}excluded_columns`, []);
    updateSettings("changed", true);
  };

  return (
    <Box display="flex" alignItems="center" px={2} py={1}>
      <Box
        mr={1}
        whiteSpace="nowrap"
        display="flex"
        alignItems="center"
        gap={1}
        title={`${len} hidden columns, click to unhide all`}
      >
        <IconButton Icon={VisibilityOffIcon} onClick={unhideAll} />
        {`(${len})`}:
      </Box>
      <Stack
        direction="row"
        spacing={1}
        overflow="auto"
        title={`Click the x icon to remove column from hidden`}
      >
        {excluded_columns.map((ec) => (
          <Chip
            label={columns[ec].label}
            key={ec}
            onDelete={() => unHideColumn(ec)}
            variant="outlined"
          />
        ))}
      </Stack>
    </Box>
  );
}
