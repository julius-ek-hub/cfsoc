import Chip from "@mui/material/Chip";

import Middle from "../../../common/utils/Middle";

import useSheet from "../../hooks/useSheet";

const SearchParamFilter = () => {
  const { active_sheet, sp_filter, removeSP } = useSheet();

  if (sp_filter.length === 0) return null;

  const { columns } = active_sheet;

  return (
    <Middle flexDirection="row" mx={2} mt={1}>
      <Chip
        title="Click on the X icon to remove filter"
        label={
          <>
            Showing only rows where there is at least one column that contains{" "}
            {sp_filter.length > 1 && "any of"}
            {": "}
            {sp_filter.join(", ")}
          </>
        }
        onDelete={removeSP}
        variant="filled"
        sx={{ py: 2.2 }}
        color="warning"
      />
    </Middle>
  );
};

export default SearchParamFilter;
