import { useEffect, useMemo } from "react";

import * as Yup from "yup";

import TableMui from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import Middle from "../../common/utils/Middle";
import FilterButton from "./Filter/Button";
import Upload from "../Menu/Upload";
import Code from "../utils/Code";

import { field_separator as fs, objectExcept, getSX } from "../utils/utils";

import useFilter from "../hooks/useFilter";
import useSheet from "../hooks/useSheet";
import useFetch from "../../common/hooks/useFetch";

const Tc = ({
  link,
  value,
  image,
  sheet,
  selected,
  has_selected,
  search,
  ordered,
  columnName,
  sp_i,
  ...rest
}) => {
  const { serverURL } = useFetch();
  const sx = getSX(rest.sx);

  const code = (
    <Code
      has_selected={has_selected}
      ordered={ordered}
      search={search}
      sp_i={sp_i}
      columnName={columnName}
    >
      {value}
    </Code>
  );

  return (
    <TableCell
      {...rest}
      sx={{
        ...sx,
        bgcolor: selected ? "inherit" : sx.bgcolor,
      }}
    >
      {link ? (
        <Link
          rel="noreferrer"
          underline="always"
          href={link}
          target="_blank"
          sx={{ display: "flex", gap: 1 }}
        >
          {code} <OpenInNewIcon fontSize="small" />
        </Link>
      ) : image ? (
        <img
          src={`${serverURL(`/sheet_images/${sheet}/${image}`)}`}
          style={{ objectFit: "cover", width: "100%" }}
          alt={image}
        />
      ) : (
        code
      )}
    </TableCell>
  );
};

const validURL = (url) =>
  Yup.object({ url: Yup.string().url() }).isValidSync({ url });

function Table() {
  const { active_sheet, updateSheet, sheets, permission, sp_filter, sp_i } =
    useSheet();

  const {
    selected,
    key,
    columns: c,
    filters,
    ordered: ord,
    primary_column,
  } = active_sheet;
  const ordered = typeof ord === "boolean" ? ord : true;

  const {
    paginated,
    rowsPerPage,
    page,
    columns,
    excluded_columns,
    hideColumn,
    has_filter,
  } = useFilter();

  const pted = useMemo(paginated, [
    Object.values(sheets).map((s) => s.content),
    key,
    filters,
    rowsPerPage,
    page,
  ]);

  const { widths } = columns();
  const has_select = selected.length > 0;

  const sorted_columns = Object.entries(c)
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

  const val = (k, row) => {
    const key = k[0];
    const _v = row[key];
    const v = _v?.value;
    const value = v || "";
    const link = row[key]?.link || (validURL(v) ? v : false);
    return { ...(_v || {}), value, link };
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
              {pted.length > 1 && ordered && (
                <TableCell
                  sx={{
                    py: 0.5,
                    width: "10px",
                    ...getSX(sorted_columns[0][1].sx),
                  }}
                >
                  S/N
                </TableCell>
              )}

              {pted.length > 0 && has_select && (
                <TableCell
                  sx={{
                    py: 0.5,
                    width: "10px",
                    ...getSX(sorted_columns[0][1].sx),
                  }}
                >
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
              {sorted_columns.map((k) => {
                return (
                  <FilterButton
                    permission={permission}
                    is_primary={primary_column === k[0]}
                    sx={getSX(k[1].sx)}
                    key={k[0]}
                    column={k[0]}
                    label={k[1].label}
                    {...(Object.keys(c).length - excluded_columns.length >
                      1 && {
                      onHide: () => hideColumn(k[0]),
                    })}
                    has_filter={has_filter(k[0])}
                    mw={widths[k[0]]}
                  />
                );
              })}
            </TableRow>
          </TableHead>
        )}
        {sorted_columns.length > 0 && (
          <TableBody>
            {pted.map((row, index) => {
              const _selected = selected.includes(row._id.value);
              const __sel = () => handleSelect(row._id.value);
              let first_val = val(sorted_columns[0], row);

              let colspans = [];
              let lastVal;

              sorted_columns.map((k) => {
                let _v = val(k, row);
                let v = _v.value || _v.link || "";
                if (typeof lastVal === "string" && lastVal === v) {
                  colspans[colspans.length - 1].colspan++;
                } else {
                  colspans.push({
                    ..._v,
                    value: v,
                    colspan: 0,
                    key: k[0],
                    label: k[1].label,
                  });
                }
                lastVal = v;
              });

              const TTC = (props) => (
                <TableCell
                  {...(!_selected && {
                    sx: { ...getSX(first_val.sx) },
                  })}
                  {...props}
                />
              );

              return (
                <TableRow
                  key={index}
                  sx={{
                    cursor: "pointer",
                    ...(_selected && {
                      bgcolor: (t) => t.palette.action.hover,
                    }),
                  }}
                >
                  {pted.length > 1 && ordered && (
                    <TTC>{page * rowsPerPage + 1 + index}</TTC>
                  )}
                  {has_select && (
                    <TTC>
                      <Checkbox
                        sx={{ py: 0, my: 0 }}
                        checked={_selected}
                        onChange={__sel}
                        size="small"
                      />
                    </TTC>
                  )}

                  {colspans.map((cp) => (
                    <Tc
                      key={cp.key}
                      onClick={__sel}
                      {...objectExcept(cp, ["colspan"])}
                      sheet={active_sheet.key}
                      selected={_selected}
                      colSpan={cp.colspan + 1}
                      ordered={ordered}
                      has_selected={selected.length > 0}
                      search={sp_filter}
                      sp_i={sp_i}
                      columnName={cp.label}
                    />
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        )}
      </TableMui>
      {permission.includes("write") && (
        <Middle py={4} flexGrow={1}>
          <Upload />
        </Middle>
      )}
    </TableContainer>
  );
}

export default Table;
