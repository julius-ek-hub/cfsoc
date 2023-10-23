import Box from "@mui/material/Box";

import DeleteIcon from "@mui/icons-material/Delete";

import IconButton from "../../../common/utils/IconButton";

import {
  _entr,
  _l,
  field_separator as fs,
  objectExcept,
} from "../../utils/utils";

import Confirm from "../../../common/utils/Comfirm";

import useSheet from "../../hooks/useSheet";
import useFetch from "../../../common/hooks/useFetch";
import useToasts from "../../../common/hooks/useToast";

function DeleteColumn({ column }) {
  const { active_sheet, updateSheet } = useSheet();
  const { patch } = useFetch("/expo-sentinel");
  const { push } = useToasts();

  const { key, columns, content, excluded_columns } = active_sheet;

  const handleDelete = async () => {
    const newCols = objectExcept(columns, [column]);
    const newContent = [];

    const { json } = await patch(
      `/update-structure?delete_column_${key}=${column}`,
      [[key, { columns: newCols }]]
    );

    if (json.error) return push({ message: json.error, severity: "error" });

    content.map((c) => newContent.push(objectExcept(c, [column])));

    updateSheet(`${key + fs}columns`, newCols);
    updateSheet(`${key + fs}content`, newContent);
    updateSheet(
      `${key + fs}excluded_columns`,
      excluded_columns.filter((ec) => ec !== column)
    );
    push({ message: "Column deleted", severity: "success" });
  };

  return (
    <Box visibility="hidden">
      <Confirm
        fullWidth
        ok_color="error"
        onConfirm={handleDelete}
        Clickable={(props) => (
          <IconButton
            title="Delete Column"
            Icon={DeleteIcon}
            size="small"
            sx={{ ml: 0.5 }}
            {...props}
          />
        )}
      >
        Delete column?
      </Confirm>
    </Box>
  );
}

export default DeleteColumn;
