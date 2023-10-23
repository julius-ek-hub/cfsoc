import Chip from "@mui/material/Chip";

import Middle from "../../../common/utils/Middle";

import useSheet from "../../hooks/useSheet";

const SearchParamFilter = () => {
  const { active_sheet, sp_filter, removeSP } = useSheet();

  if (!sp_filter) return null;

  const { columns } = active_sheet;

  return (
    <Middle flexDirection="row" mx={2} mt={1}>
      <Chip
        title="Click on the X icon to remove filter"
        label={
          <>
            Showing only rows where{" "}
            {Object.entries(sp_filter).map(
              ([k, v]) =>
                `${columns[k].label} ${
                  v.length > 1 ? "matches any of:" : "="
                } ${v.join(", ")}`
            )}
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
