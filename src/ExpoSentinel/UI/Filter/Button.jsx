import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import IconButton from "../../../common/utils/IconButton";
import Position from "./Position";
import Filter from "./Filter";
import RenameColumn from "./RenameColumn";
import DeleteColumn from "./Delelete";

function FilterButton({
  column,
  onHide,
  has_filter,
  mw,
  label,
  sx,
  permission,
}) {
  return (
    <TableCell
      sx={{
        py: 0.5,
        whiteSpace: "nowrap",
        minWidth: (mw > 1000 ? 1000 : mw) + "px",
        ...sx,
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        sx={{
          "&:hover > span button, &:hover > div": {
            visibility: "visible",
          },
        }}
        {...(has_filter && { title: "Has filter" })}
      >
        {has_filter && <FilterAltIcon fontSize="15px" sx={{ mr: 0.3 }} />}
        {label}
        <Position column={column} />
        {permission.includes("modify") && <RenameColumn column={column} />}
        {permission.includes("delete") && <DeleteColumn column={column} />}
        {onHide && (
          <Box visibility="hidden">
            <IconButton
              title="Hide column"
              Icon={VisibilityOffIcon}
              onClick={onHide}
              size="small"
              sx={{ ml: 0.5 }}
            />
          </Box>
        )}

        <Box visibility="hidden">
          <Filter column={column} />
        </Box>
      </Box>
    </TableCell>
  );
}

export default FilterButton;
