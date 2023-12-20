import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

import DeleteIcon from "@mui/icons-material/Delete";
import WarningIcon from "@mui/icons-material/Warning";

import IconButton from "../../../common/utils/IconButton";
import Confirm from "../../../common/utils/Comfirm";

import useAddModify from "../../hooks/useAddModify";

const DeleteUC = ({ selected, onDelete }) => {
  const { _delete } = useAddModify();

  return (
    <Confirm
      onConfirm={() => {
        // _delete(selected, onDelete)
      }}
      ok_color="inherit"
      ok_text="Delete"
      disabled
      Clickable={(props) => (
        <IconButton Icon={DeleteIcon} title="Delete selected" {...props} />
      )}
    >
      You have selected {selected.length} use case
      {selected.length === 1 ? "" : "s"} to be deleted, this action can not be
      reversed.
      <Divider sx={{ my: 2 }} />
      <Box display="inline-flex" color="error.main">
        <WarningIcon fontSize="small" /> This feature has been disabled for now,
        you can request it if you want.
      </Box>
    </Confirm>
  );
};

export default DeleteUC;
