import LightbulbIcon from "@mui/icons-material/Lightbulb";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "../../../common/utils/IconButton";

import Middle from "../../../common/utils/Middle";

import useSheet from "../../hooks/useSheet";

const SearchParamFilter = () => {
  const { active_sheet, sp_filter, removeSP } = useSheet();

  if (!sp_filter) return null;

  const { name, columns } = active_sheet;

  return (
    <Middle
      p={1}
      flexDirection="row"
      gap={1}
      color="common.white"
      bgcolor="primary.main"
    >
      <LightbulbIcon fontSize="small" />
      Showing only <b>'{name}'</b> where{" "}
      <span
        dangerouslySetInnerHTML={{
          __html: Object.entries(sp_filter)
            .map(([k, v]) => `<b>'${columns[k].label}'</b> = ${v.join(", ")}`)
            .join(" &amp; "),
        }}
      />
      <IconButton
        Icon={CloseIcon}
        size="small"
        title="Remove this filter"
        color="error"
        onClick={removeSP}
      />
    </Middle>
  );
};

export default SearchParamFilter;
