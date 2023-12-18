import DeleteIcon from "@mui/icons-material/Delete";

import IconButton from "../../../common/utils/IconButton";
import Confirm from "../../../common/utils/Comfirm";

import useAddModify from "../../hooks/useAddModify";

const DeleteUC = ({ selected, onDelete }) => {
  const { _delete } = useAddModify();

  return (
    <Confirm
      onConfirm={() => _delete(selected, onDelete)}
      ok_color="error"
      ok_text="Delete"
      Clickable={(props) => (
        <IconButton Icon={DeleteIcon} title="Delete selected" {...props} />
      )}
    >
      You have selected {selected.length} use case
      {selected.length === 1 ? "" : "s"} to be deleted, this action can not be
      reversed.
    </Confirm>
  );
};

export default DeleteUC;
