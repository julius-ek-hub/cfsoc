import Box from "@mui/material/Box";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import IconButton from "../../../common/utils/IconButton";

import useSheet from "../../hooks/useSheet";
import useSettings from "../../hooks/useSettings";

import { field_separator } from "../../utils/utils";

const _entr = (o) => Object.entries(o);

function Position({ column }) {
  const { active_sheet, updateSheet } = useSheet();
  const { updateSettings } = useSettings();

  const { key, columns, excluded_columns } = active_sheet;
  const positions = _entr(columns).map(([k, v]) => [k, v.position]);
  const _positions = Object.fromEntries(positions);
  const len = positions.length;

  const repositionColumn = (direction = 1, col = column) => {
    let newPos = columns[col].position + direction;
    if (newPos < 0) newPos = len - 1;
    else if (newPos >= len) newPos = 0;
    _positions[col] = newPos;

    const all = Object.keys(columns).filter(
      (_col) => _positions[_col] === newPos && _col !== col
    );
    if (all.length === 1) repositionColumn(direction > 0 ? -1 : 1, all[0]);
    else {
      const ___columns = { ...columns };
      _entr(_positions).map(
        ([k, v]) => (___columns[k] = { ...___columns[k], position: v })
      );
      updateSheet(`${key + field_separator}columns`, ___columns);
    }
  };

  const beginRepositoning = (dir) => {
    repositionColumn(dir);
    updateSettings("changed", true);
  };

  if (Object.keys(columns).length - excluded_columns.length <= 1) return null;

  return (
    <Box visibility="hidden">
      <IconButton
        title="Move column to the left"
        Icon={KeyboardArrowLeftIcon}
        onClick={() => beginRepositoning(-1)}
        size="small"
        sx={{ ml: 0.5 }}
      />
      <IconButton
        title="Move column to the right"
        onClick={() => beginRepositoning(1)}
        Icon={KeyboardArrowRightIcon}
        size="small"
        sx={{ ml: 0.5 }}
      />
    </Box>
  );
}

export default Position;
