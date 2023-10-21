import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import SaveIcon from "@mui/icons-material/Save";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

import Update from "./Update";
import Download from "./Download";
import AddRow from "./AddRow";
import ViewRelated from "./AddRow/utils/ViewRelated";
import IconButton from "../../common/utils/IconButton";

import useFetcher from "../hooks/useFetcher";
import useSheet from "../hooks/useSheet";
import useSettings from "../hooks/useSettings";
import useFetch from "../../common/hooks/useFetch";

import { field_separator as fs } from "../utils/utils";

const Menu = () => {
  const { downloadData, saveChanges, lockUnlock } = useFetcher();
  const { patch } = useFetch("/ucm");
  const { active_sheet, active_content, updateSheet } = useSheet();
  const { settings } = useSettings();

  if (!active_sheet) return null;

  const { selected, key, ordered: o } = active_sheet;
  const ordered = typeof o === "boolean" ? o : true;

  const hasSelected = selected.length > 0;

  const handleSort = async () => {
    const nO = !ordered;
    const { json } = await patch(`/update-structure`, [[key, { ordered: nO }]]);
    if (!json.error) updateSheet(`${key + fs}ordered`, nO);
  };

  const Flex = (props) => (
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
      {...props}
    />
  );

  return (
    <Box>
      {selected.length > 0 && (
        <Flex>
          <ViewRelated _ids={selected} />
        </Flex>
      )}
      <Flex>
        <>
          {!hasSelected && <Update />}
          <IconButton
            Icon={ordered ? FormatListNumberedIcon : FormatListBulletedIcon}
            onClick={handleSort}
            title={ordered ? "Remove row numbering" : "Add row numbering"}
          />
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
          {!hasSelected && (
            <Button
              color="inherit"
              startIcon={active_sheet.locked ? <LockIcon /> : <LockOpenIcon />}
              onClick={lockUnlock}
            >
              {active_sheet.locked ? "Unlock" : "Lock"}
            </Button>
          )}
        </>
      </Flex>
    </Box>
  );
};

export default Menu;
