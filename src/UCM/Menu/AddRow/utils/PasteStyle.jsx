import Button from "@mui/material/Button";

import ContentPasteIcon from "@mui/icons-material/ContentPaste";

import Confirm from "../../../../common/utils/Comfirm";

import {
  _entr,
  entr_,
  field_separator as fs,
  objectExcept,
} from "../../../utils/utils";

import useFetch from "../../../../common/hooks/useFetch";
import useSheet from "../../../hooks/useSheet";
import useToasts from "../../../../common/hooks/useToast";

const PasteStyle = () => {
  const { patch } = useFetch("/ucm");
  const { push } = useToasts();

  const { active_sheet, updateSheet } = useSheet();
  const { cloned, selected, content, key, columns } = active_sheet;

  if (!cloned) return null;

  const c_id = cloned._id.value;

  const _selected = selected.filter((s) => s !== c_id);

  if (_selected.length === 0) return null;

  const handlePaste = async () => {
    let failed = 0;
    const applied = await Promise.all(
      _selected.map(async (_id) => {
        const target = content.find((c) => c._id.value === _id);
        const app = entr_(
          _entr(columns).map(([k]) => [k, { ...target[k], sx: cloned[k]?.sx }])
        );
        app._id = target._id;

        const { json } = await patch(`/data?sheet=${key}`, {
          _id,
          update: objectExcept(app, ["_id"]),
        });
        if (json.error) {
          failed++;
          return { error: json.error };
        }
        return app;
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
