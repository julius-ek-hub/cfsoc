import Box from "@mui/material/Box";

import AutoComplete from "../../../../common/utils/form/uncontrolled/AutoComplete";

import { _entr, field_separator as fs } from "../../../utils/utils";

import useFetch from "../../../../common/hooks/useFetch";
import useSheet from "../../../hooks/useSheet";

const MoveRow = ({ _id }) => {
  const { patch } = useFetch("/expo-sentinel");

  const { active_content, active_sheet, updateSheet } = useSheet();
  const { key } = active_sheet;

  const targetIndex = active_content.findIndex((ac) => ac._id.value === _id);
  const sns = [...new Array(active_content.length)].map((i, j) =>
    String(j + 1)
  );

  const placeAfter = async (e, sn) => {
    if (!sn) return;
    const _sn = Number(sn) - 1;
    if (targetIndex === _sn) return;
    // await patch(`/data?sheet=${key}`, {
    //   _id,
    //   update: { "sn.value": _sn },
    // });

    updateSheet(`${key + fs}content${fs + targetIndex + fs}sn`, {
      value: _sn,
    });
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      SN:
      <AutoComplete
        options={sns}
        size="small"
        placeholder="Place row at SN?"
        value={String(targetIndex + 1)}
        multiple={false}
        onChange={placeAfter}
      />
    </Box>
  );
};

export default MoveRow;
