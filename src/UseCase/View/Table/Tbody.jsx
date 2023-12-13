import Checkbox from "@mui/material/Checkbox";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";

import { td } from "./utils";

const Tbody = ({
  visibleRows,
  handleClick,
  sc,
  isSelected,
  is_uc,
  search,
  pagination,
  selected,
  $key,
}) => {
  const { page = 0, rowsPerPage = 30 } = pagination || {};

  return (
    <TableBody>
      {visibleRows.map((row, index) => {
        const isItemSelected = isSelected(row._id.value);
        const labelId = `enhanced-table-checkbox-${index}`;
        return (
          <TableRow
            hover
            onClick={(event) => handleClick(event, row._id.value)}
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            key={row._id.value}
            selected={isItemSelected}
            sx={{ cursor: "pointer" }}
          >
            {selected.length > 0 && is_uc && (
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={isItemSelected}
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </TableCell>
            )}
            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
            {sc.map(([k], i) => (
              <TableCell
                key={k}
                dangerouslySetInnerHTML={{
                  __html: td(row[k]?.value, search),
                }}
                sx={{
                  ...(k === "identifier" && { whiteSpace: "nowrap" }),
                  ...($key === "l1_uc" &&
                    row.identifier.value === "CO" &&
                    i > 1 &&
                    i < sc.length && { borderRight: "none!important" }),
                }}
              />
            ))}
          </TableRow>
        );
      })}
    </TableBody>
  );
};

export default Tbody;
