import { useEffect, useMemo, useState } from "react";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";

import Middle from "../../../common/utils/Middle";
import EditUC from "./EditUC";
import EnhancedTableHead from "./Thead";
import Tbody from "./Tbody";
import Detailed from "./Detailed";
import Pagination from "../../../common/utils/Pagination";

import useSheet from "../../hooks/useSheet";

import { _entr, entr_ } from "../../../common/utils/utils";
import { stableSort, getComparator } from "./utils";

const TableView = ({ use, onScroll, useKey, $for = {}, dataEndTable }) => {
  const { active_sheet, sorted_columns, sheets, contents, sp_filter } =
    useSheet();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [selected, setSelected] = useState([]);
  const [pagination, setPagination] = useState({ page: 0, rowsPerPage: 30 });
  const [filters, setFilters] = useState({});
  const [selectedData, setSelectedData] = useState(null);

  const { key, excluded_columns } = active_sheet || {};

  const { page = 0, rowsPerPage = 30 } = pagination || {};

  const search = (sp_filter.uc_search || []).join("");

  const _key = use ? useKey : key;

  const is_uc = _key === "all_uc";

  const rows = useMemo(
    () => use || contents[key] || [],
    [use, contents[key], key]
  );

  const sc = use
    ? _entr(sheets[useKey]?.columns || {})
        .sort((a, b) => a[1].position - b[1].position)
        .filter(([k]) => !sheets[useKey].excluded_columns.includes(k))
    : sorted_columns.filter(([k]) => !excluded_columns.includes(k));

  const filterValues = useMemo(
    () =>
      entr_(sc.map(([k]) => [k, [...new Set(rows.map((r) => r[k]?.value))]])),
    [rows]
  );

  const detail_sc = use ? _entr(sheets[useKey]?.columns || {}) : sorted_columns;
  const detail_selected = selected[0]
    ? rows.find((r) => r._id.value === selected[0])
    : undefined;

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        return _entr(filters).every(([k, v]) => {
          if (v.length === 0) return true;
          return v.includes(String(row[k]?.value));
        });
      }),
    [rows, filters]
  );

  const visibleRows = useMemo(
    () =>
      stableSort(filteredRows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, filteredRows]
  );

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = visibleRows.map((n) => n._id.value);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id, data) => {
    let newSelected = [];
    if (!is_uc) {
      if (selected.indexOf(id) !== -1) newSelected = [];
      else newSelected = [id];
    } else {
      const selectedIndex = selected.indexOf(id);

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }
    }

    setSelected(newSelected);
    setSelectedData(data);
  };

  const minWidths = useMemo(() => {
    if (visibleRows.length === 0) setPagination({ rowsPerPage: 30, page: 0 });

    const w = entr_([...sc].map((c) => [c[0], 0]));
    visibleRows.map((vr) => {
      sc.map(([k]) => {
        const len = (vr[k]?.value || "").length;
        if (w[k] < len) w[k] = len;
      });
    });
    return w;
  }, [visibleRows]);

  useEffect(() => {
    setSelected([]);
    setFilters(entr_(sc.map(([k]) => [k, []])));
  }, [key]);

  if (rows.length === 0)
    return _key === "all_uc" ? (
      <Middle height="100%">
        <EditUC $for={$for} />
      </Middle>
    ) : null;

  return (
    <Box display="flex" flexGrow={1} height="100%" flexDirection="column">
      <Box
        {...(_key !== "l1_uc" && {
          flexGrow: 1,
          overflow: "auto",
        })}
      >
        <Box display="flex" height="100%">
          <TableContainer
            sx={{
              height: "100%",
              "&.MuiTableContainer-root": {
                table: { borderCollapse: "collapse" },
                "& .MuiTableCell-root": {
                  border: (t) => `1px solid ${t.palette.divider}`,
                },
              },
            }}
            onScroll={onScroll}
          >
            <Table stickyHeader>
              <EnhancedTableHead
                _key={_key}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={visibleRows.length}
                columns={sc}
                mw={minWidths}
                filterValues={filterValues}
                visibleRows={visibleRows}
                onChangeFilter={(key, val) => {
                  setFilters({ ...filters, [key]: val });
                  setPagination({ page: 0, rowsPerPage: 30 });
                }}
                is_uc={is_uc}
              />

              <Tbody
                handleClick={handleClick}
                isSelected={isSelected}
                is_uc={is_uc}
                pagination={pagination}
                sc={sc}
                search={search}
                selected={selected}
                visibleRows={visibleRows}
                $key={_key}
              />
            </Table>
            {dataEndTable && <Middle my={2}>{dataEndTable}</Middle>}
            {is_uc && (
              <Middle my={2}>
                <EditUC $for={$for} />
              </Middle>
            )}
          </TableContainer>

          <Detailed
            detail_sc={detail_sc}
            _key={_key}
            detail_selected={detail_selected}
            single_selected_data={selectedData}
            is_uc={is_uc}
            $for={$for}
            TableView={TableView}
            selected={selected}
            onResetSelect={() => setSelected([])}
            search={search}
          />
        </Box>
      </Box>
      <Box display="flex" justifyContent="end">
        <Pagination
          rowsPerPage={rowsPerPage}
          page={page}
          onChange={setPagination}
          content={filteredRows}
        />
      </Box>
    </Box>
  );
};

export default TableView;
