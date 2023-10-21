import Box from "@mui/material/Box";

import { _entr, field_separator as fs } from "../../../utils/utils";

import useFetch from "../../../../common/hooks/useFetch";
import useSheet from "../../../hooks/useSheet";

const MoveRow = ({ _id }) => {
  const { patch } = useFetch("/expo-sentinel");

  const { active_content, active_sheet, updateSheet } = useSheet();
  const { key } = active_sheet;

  const targetIndex = active_content.findIndex((ac) => ac._id.value === _id);
  const sns = [...new Array(active_content.length)].map((i, j) => j);

  const placeAfter = async (sn) => {
    const _sn = Number(sn);
    await patch(`/data?sheet=${key}`, {
      _id,
      update: { "sn.value": _sn },
    });

    updateSheet(`${key + fs}content${fs + targetIndex + fs}sn`, {
      value: _sn,
    });
  };

  return (
    <>
      <span>Move row to: </span>
      <Box
        component="select"
        onChange={(e) => placeAfter(e.target.value)}
        value={targetIndex + 1}
        sx={{
          border: (t) => `1px solid ${t.palette.divider}`,
          borderRadius: 10,
          "&:focus &:selected": {
            border: (t) => `1px solid ${t.palette.divider}`,
          },
        }}
      >
        {sns.map((sn) => (
          <option key={sn} value={sn + 1}>
            {sn + 1}
          </option>
        ))}
      </Box>
    </>
  );
};

export default MoveRow;
