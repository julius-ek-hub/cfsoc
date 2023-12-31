import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import ContentPasteIcon from "@mui/icons-material/ContentPaste";

import IconButton from "../../../common/utils/IconButton";
import Confirm from "../../../common/utils/Comfirm";

import useAddModify from "../../hooks/useAddModify";
import useSettings from "../../hooks/useSettings";
import useSheet from "../../hooks/useSheet";

import { _entr } from "../../../common/utils/utils";

const Paste = ({ selected, onPaste }) => {
  const { paste } = useAddModify();
  const { sheets } = useSheet();
  const { settings } = useSettings();
  const cb = settings.clipboard;
  if (!cb) return;

  return (
    <Confirm
      onConfirm={() => paste(selected, cb, onPaste)}
      ok_text="Paste"
      Initiator={(props) => (
        <IconButton
          Icon={ContentPasteIcon}
          title="Paste key-values in clipboard"
          {...props}
        />
      )}
    >
      This will paste the following key-value pairs to all selected rows:
      <Stack mt={1}>
        {_entr(cb).map(([k, v]) => (
          <Box key={k}>
            {sheets.all_uc.columns[k].label} : {v || "Blanc"}
          </Box>
        ))}
      </Stack>
    </Confirm>
  );
};

export default Paste;
