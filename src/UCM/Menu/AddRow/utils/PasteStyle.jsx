import Button from "@mui/material/Button";

import ContentPasteIcon from "@mui/icons-material/ContentPaste";

import useSheet from "../../../hooks/useSheet";

import {
  _entr,
  entr_,
  field_separator as fs,
  objectExcept,
} from "../../../utils/utils";

import useFetch from "../../../../common/hooks/useFetch";
import useToasts from "../../../../common/hooks/useToast";
import Confirm from "../../../../common/utils/Comfirm";

const PasteStyle = () => {
  const { patch } = useFetch("/ucm");
  const { push } = useToasts();

  const { active_sheet, updateSheet } = useSheet();
  const { cloned, selected, content, key } = active_sheet;

  if (!cloned) return null;

  const c_id = cloned._id.value;

  const _selected = selected.filter((s) => s !== c_id);

  if (_selected.length === 0) return null;

  const handlePaste = async () => {
    let failed = 0;
    const applied = await Promise.all(
      _selected.map(async (_id) => {
        const target = content.find((c) => c._id.value === _id);
        const applied = entr_(
          _entr(target).map(([k, v]) => [k, { ...v, sx: cloned[k].sx }])
        );

        const { json } = await patch(`/data?sheet=${key}`, {
          _id,
          update: objectExcept(applied, ["_id"]),
        });
        if (json.error) {
          failed++;
          return { error: json.error };
        }
        return applied;
      })
    );

    applied.map((ap) => {
      const targetIndex = content.findIndex(
        (ac) => ac._id.value === ap._id.value
      );
      updateSheet(`${key + fs}content${fs + targetIndex}`, ap);
    });

    if (failed > 0)
      push({
        message: `Failed to paste style to ${failed} row${
          failed === 1 ? "" : "s"
        }`,
        severity: "error",
      });
    else push({ message: `Done`, severity: "success" });
    updateSheet(`${key + fs}selected`, []);
  };

  return (
    <Confirm
      title="Paste last copied row style?"
      onConfirm={handlePaste}
      Clickable={(props) => (
        <Button endIcon={<ContentPasteIcon />} color="inherit" {...props}>
          Paste style
        </Button>
      )}
    >
      This will override existing styles for all selected rows.
    </Confirm>
  );
};

export default PasteStyle;
