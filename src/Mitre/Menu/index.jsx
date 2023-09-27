import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import SaveIcon from "@mui/icons-material/Save";

import Update from "./Update";
import Download from "./Download";

import useFetcher from "../hooks/useFetcher";
import useSheet from "../hooks/useSheet";
import AddRow from "./AddRow";
import useSettings from "../hooks/useSettings";

const Menu = () => {
  const { downloadData, saveChanges } = useFetcher();
  const { active_sheet, active_content } = useSheet();
  const { settings } = useSettings();

  if (!active_sheet) return null;

  const hasSelected = active_sheet.selected.length > 0;

  return (
    <Box>
      <Box
        display="flex"
        mt={2}
        px={2}
        {...(!active_sheet && { py: 1 })}
        alignItems="center"
        gap={2}
        whiteSpace="nowrap"
        overflow="auto"
        sx={{ "&>*": { flexShrink: 0 } }}
      >
        {!hasSelected && <Update />}
        {active_sheet && (
          <>
            {active_content.length > 0 && !hasSelected && (
              <Download onChange={downloadData} />
            )}
            <AddRow />
            {settings.changed && !hasSelected && (
              <Button
                color="inherit"
                startIcon={<SaveIcon />}
                onClick={saveChanges}
              >
                Save state
              </Button>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Menu;
