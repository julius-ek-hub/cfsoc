import Checkbox from "@mui/material/Checkbox";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableSortLabel from "@mui/material/TableSortLabel";

import Filter from "./Filter";

export default function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    onChangeFilter,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    columns,
    mw,
    filterValues,
    is_uc,
    _key,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {numSelected > 0 && is_uc && (
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                "aria-label": "select all desserts",
              }}
            />
          </TableCell>
        )}
        <TableCell padding="normal" width={20}>
          S/N
        </TableCell>
        {columns.map(([key, val]) => (
          <TableCell
            key={key}
            sortDirection={orderBy === key ? order : false}
            sx={{
              minWidth: `${mw[key] > 1000 ? 1000 : mw[key]}px!important`,
              "&:hover button": { visibility: "visible" },
              whiteSpace: "nowrap",
            }}
          >
            <TableSortLabel
              active={orderBy === key}
              direction={orderBy === key ? order : "asc"}
              onClick={createSortHandler(key)}
            >
              {val.label}
            </TableSortLabel>
            <Filter
              _key={_key}
              column={key}
              filterValues={filterValues[key]}
              columns={columns}
              onChange={onChangeFilter}
            />
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
