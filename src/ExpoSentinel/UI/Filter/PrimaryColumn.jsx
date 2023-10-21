import Box from "@mui/material/Box";

import KeyIcon from "@mui/icons-material/Key";
import KeyOffIcon from "@mui/icons-material/KeyOff";

import IconButton from "../../../common/utils/IconButton";

import { _entr, _l, field_separator as fs } from "../../utils/utils";

import Confirm from "../../../common/utils/Comfirm";

import useSheet from "../../hooks/useSheet";
import useFetch from "../../../common/hooks/useFetch";
import useToasts from "../../../common/hooks/useToast";

function PrimaryColumn({ column }) {
  const { active_sheet, updateSheet } = useSheet();
  const { patch, dlete } = useFetch("/expo-sentinel");
  const { push } = useToasts();

  const { key, primary_column, content } = active_sheet;
  const is_primary = primary_column === column;
  const title = is_primary ? "Remove Primary" : "Mark this column as primary";

  const handleDelete = async () => {
    const newP = is_primary ? undefined : column;
    const duplicates = [];
    const uniques = [];
    if (newP) {
      content.map((c) => {
        const v = _l(c[newP].value);
        if (v && uniques.find((u) => _l(u[newP].value) === v))
          duplicates.push(c._id.value);
        else uniques.push(c);
      });

      await Promise.all(
        duplicates.map((dup) => dlete(`/data?sheet=${key}&_id=${dup}`))
      );

      updateSheet(`${key + fs}content`, uniques);
    }

    const { json } = await patch(`/update-structure`, [
      [key, { primary_column: newP }],
    ]);

    if (json.error) return push({ message: json.error, severity: "error" });
    updateSheet(`${key + fs}primary_column`, newP);
    push({ message: "Column updated", severity: "success" });
  };

  if (primary_column && !is_primary) return null;

  return (
    <Box visibility="hidden">
      <Confirm
        fullWidth
        onConfirm={handleDelete}
        title={`${title}?`}
        Clickable={(props) => (
          <IconButton
            title={title}
            Icon={is_primary ? KeyOffIcon : KeyIcon}
            size="small"
            sx={{ ml: 0.5, transform: "rotate(90deg)" }}
            {...props}
          />
        )}
      >
        {is_primary ? (
          ``
        ) : (
          <Box>
            Setting this column as Primary would mean that:
            <ul>
              <li>No duplicate values will be allowed</li>
              <li>
                All existing duplicates will be removed {`(The entire row)`}
              </li>
              <li>You won't be able to delete the column. </li>
              <li>Only one primary column is allowed.</li>
              <li>
                A primary column will always have a vissible key icon attached
                to it.
              </li>
              <li>This action can be reversed.</li>
            </ul>
          </Box>
        )}
      </Confirm>
    </Box>
  );
}

export default PrimaryColumn;
