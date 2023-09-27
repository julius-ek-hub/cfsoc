import { useEffect, useMemo } from "react";

import TableMui from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";

import Middle from "../../common/utils/Middle";
import FilterButton from "./Filter/Button";
import Upload from "../Menu/Upload";

import { field_separator as fs } from "../utils/utils";

import useFilter from "../hooks/useFilter";
import useSheet from "../hooks/useSheet";

function Table() {
  const { active_sheet, updateSheet, sheets, sp_filter } = useSheet();

  const { selected, key, columns: c, filters } = active_sheet;

  const _key = `${key + fs}content`;

  const {
    paginated,
    rowsPerPage,
    page,
    columns,
    excluded_columns,
    hideColumn,
    has_filter,
  } = useFilter(true);

  const pted = useMemo(paginated, [
    Object.values(sheets).map((s) => s.content),
    key,
    filters,
    rowsPerPage,
    page,
    sp_filter,
  ]);

  const { widths } = columns();

  const sorted_rows = Object.entries(c)
    .filter((c) => !excluded_columns.includes(c[0]))
    .sort((a, b) => a[1].position - b[1].position);

  const setSelected = (_sel) => {
    updateSheet(`${key + fs}selected`, _sel);
  };

  const handleSelect = (_id) => {
    if (selected.includes(_id))
      return setSelected(selected.filter((f) => f !== _id));
    setSelected([...selected, _id]);
  };

  const handleSelectAll = (_id) => {
    if (pted.every((f) => selected.includes(f._id.value)))
      return setSelected([]);
    setSelected(pted.map((f) => f._id.value));
  };

  useEffect(() => {
    if (pted.length === 0 && page > 0)
      updateSheet(`${key + fs}pagination${fs}page`, page - 1);
  }, [pted]);

  return (
    <TableContainer
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <TableMui stickyHeader>
        {Object.keys(active_sheet.columns).length > 0 && (
          <TableHead>
            <TableRow>
              <TableCell sx={{ py: 0.5, width: "10px" }}>S/N</TableCell>
              {pted.length > 0 && (
                <TableCell sx={{ py: 0.5, width: "10px" }}>
                  <Box display="flex" alignItems="center">
                    <Checkbox
                      checked={
                        selected.length > 0 &&
                        pted.every((f) => selected.includes(f._id.value))
                      }
                      onChange={handleSelectAll}
                    />
                    {selected.length > 0 && selected.length}
                  </Box>
                </TableCell>
              )}
              {sorted_rows.map((k) => {
                return (
                  <FilterButton
                    key={k[0]}
                    column={k[0]}
                    label={k[1].label}
                    user_added={k[1].user_added}
                    {...(Object.keys(c).length - excluded_columns.length >
                      1 && {
                      onHide: () => hideColumn(k[0]),
                    })}
                    has_filter={has_filter(k[0])}
                    mw={widths[k[0]]}
                    __key={_key}
                  />
                );
              })}
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {pted.map((row, index) => {
            const _selected = selected.includes(row._id.value);
            const __sel = () => handleSelect(row._id.value);
            return (
              <TableRow
                key={index}
                sx={{
                  cursor: "pointer",
                  ...(_selected && { bgcolor: (t) => t.palette.action.hover }),
                }}
              >
                <TableCell>{page * rowsPerPage + 1 + index}</TableCell>
                <TableCell sx={{ py: 0.5, width: "10px" }}>
                  <Checkbox checked={_selected} onChange={__sel} />
                </TableCell>
                {sorted_rows.map((k) => {
                  const key = k[0];
                  const __key = _key + fs + index + fs + key;
                  const value = row[key]?.value;
                  return (
                    <TableCell key={__key} _key={__key} onClick={__sel}>
                      {value || k[1].default_value || ""}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </TableMui>
      <Middle py={4} flexGrow={1}>
        <Upload />
      </Middle>
    </TableContainer>
  );
}

export default Table;
