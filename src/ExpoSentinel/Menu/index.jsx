import Box from "@mui/material/Box";

import SaveIcon from "@mui/icons-material/Save";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

import Download from "./Download";
import ActionButtons from "./AddRow/utils/ActionButtons";
import IconButton from "../../common/utils/IconButton";
import Security from "../utils/Security";
import SheetInfo from "../utils/SheetInfo";
import ViewRelated from "./AddRow/utils/ViewRelated";

import useFetcher from "../hooks/useFetcher";
import useSheet from "../hooks/useSheet";
import useSettings from "../hooks/useSettings";
import useFetch from "../../common/hooks/useFetch";
import useCommonSettings from "../../common/hooks/useSettings";

import { field_separator as fs } from "../utils/utils";

const Menu = () => {
  const { downloadData, saveChanges } = useFetcher();
  const { active_sheet, active_content, updateSheet, permission } = useSheet();
  const { settings } = useSettings();
  const { patch } = useFetch("/expo-sentinel");
  const { uname } = useCommonSettings();

  if (!active_sheet) return null;

  const { selected, key, ordered: o, primary_column } = active_sheet;
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
      px={2}
      mt={1}
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
      {!hasSelected && (
        <Flex fontSize="small" color="text.secondary" ml={1.5}>
          <SheetInfo />
        </Flex>
      )}
      {selected.length > 0 && primary_column && (
        <Flex>
          <ViewRelated _ids={selected} />
        </Flex>
      )}
      <Flex>
        <Security />
        {permission.includes("modify") && (
          <IconButton
            Icon={ordered ? FormatListNumberedIcon : FormatListBulletedIcon}
            onClick={handleSort}
            title={ordered ? "Remove row numbering" : "Add row numbering"}
          />
        )}
        {uname !== "guest" && (
          <>
            {settings.changed && !hasSelected && (
              <IconButton
                Icon={SaveIcon}
                onClick={saveChanges}
                title="Save state"
              />
            )}
            {active_content.length > 0 && !hasSelected && (
              <Download onChange={downloadData} />
            )}
          </>
        )}
        <ActionButtons />
      </Flex>
    </Box>
  );
};

export default Menu;
