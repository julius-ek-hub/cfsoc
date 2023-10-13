import Button from "@mui/material/Button";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import Confirm from "../../../../common/utils/Comfirm";

import { _entr, field_separator as fs } from "../../../utils/utils";

import useToasts from "../../../../common/hooks/useToast";
import useSheet from "../../../hooks/useSheet";

const CopyStyle = ({ _id }) => {
  const { push } = useToasts();

  const { active_sheet, updateSheet } = useSheet();
  const { content, key } = active_sheet;
  const target = content.find((ac) => ac._id.value === _id);

  const handleCopy = () => {
    updateSheet(`${key + fs}cloned`, target);
    updateSheet(`${key + fs}selected`, []);
    push({ message: "Copied", severity: "success" });
  };

  return (
    <Confirm
      onConfirm={handleCopy}
      Clickable={(props) => (
        <Button endIcon={<ContentCopyIcon />} color="inherit" {...props}>
          Clone style
        </Button>
      )}
    >
      This will copy the entire row style, you can then paste it on more than
      one different rows.
    </Confirm>
  );
};

export default CopyStyle;
