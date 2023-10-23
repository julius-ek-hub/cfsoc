import Box from "@mui/material/Box";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import IconButton from "../../../common/utils/IconButton";

import useSheet from "../../hooks/useSheet";

import { field_separator } from "../../utils/utils";

function Position({ column }) {
  const { active_sheet, updateSheet, sorted_columns } = useSheet();

  const { key, columns, excluded_columns } = active_sheet;

  const repositionColumn = (dir = 1) => {
    const entr = [...sorted_columns].map(([k, v], index) => {
      const _v = { ...v };
      _v.position = index;
      return [k, _v];
    });
    const getInd = (ind) =>
      ind > entr.length - 1 ? 0 : ind < 0 ? entr.length - 1 : ind;

    const _col = entr.findIndex((e) => e[0] === column);
    const op1 = entr[_col][1].position;
    const _next_ind = getInd(_col + dir);
    const op2 = entr[_next_ind][1].position;
    entr[_col][1].position = getInd(op1 + dir);
    entr[_next_ind][1].position = getInd(op2 - dir);

    updateSheet(`${key + field_separator}columns`, Object.fromEntries(entr));
  };

  if (Object.keys(columns).length - excluded_columns.length <= 1) return null;

  return (
    <Box visibility="hidden">
      <IconButton
        title="Move column to the left"
        Icon={KeyboardArrowLeftIcon}
        onClick={() => repositionColumn(-1)}
        size="small"
        sx={{ ml: 0.5 }}
      />
      <IconButton
        title="Move column to the right"
        onClick={() => repositionColumn(1)}
        Icon={KeyboardArrowRightIcon}
        size="small"
        sx={{ ml: 0.5 }}
      />
    </Box>
  );
}

export default Position;
