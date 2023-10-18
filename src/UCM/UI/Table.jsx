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

import { field_separator as fs, getSX, objectExcept } from "../utils/utils";

import useFilter from "../hooks/useFilter";
import useSheet from "../hooks/useSheet";
import useFetch from "../../common/hooks/useFetch";

const Tc = ({ link, value, image, sheet, selected, ...rest }) => {
  const { serverURL } = useFetch();
  const sx = getSX(rest.sx);
  return (
    <TableCell
      {...rest}
      sx={{ ...sx, bgcolor: selected ? "inherit" : sx.bgcolor }}
    >
      {link ? (
        <Link
          rel="noreferrer"
          underline="always"
          href={link}
          target="_blank"
          sx={{ display: "flex", gap: 1 }}
        >
          {value} <OpenInNewIcon fontSize="small" />
        </Link>
      ) : image ? (
        <img
          src={`${serverURL(`/sheet_images/${sheet}/${image}`)}`}
          style={{ objectFit: "cover", width: "100%" }}
          alt={image}
        />
      ) : (
        value
      )}
    </TableCell>
  );
};

const validURL = (url) =>
  Yup.object({ url: Yup.string().url() }).isValidSync({ url });

function Table() {
  const { active_sheet, updateSheet, sheets, sp_filter } = useSheet();

  const {
    selected,
    key,
    columns: c,
    filters,
    user_added,
    locked,
    ordered: ord,
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
  const has_select = selected.length > 0;

  const sorted_columns = Object.entries(c)
    .filter((c) => !excluded_columns.includes(c[0]))
    .sort((a, b) => a[1].position - b[1].position);

  const setSelected = (_sel) => {
    if (locked) return;
    updateSheet(`${key + fs}selected`, _sel);
  };

  const handleSelect = (_id) => {
    if (locked) return;
    if (selected.includes(_id))
      return setSelected(selected.filter((f) => f !== _id));
    setSelected([...selected, _id]);
  };

  const handleSelectAll = (_id) => {
    if (locked) return;
    if (pted.every((f) => selected.includes(f._id.value)))
      return setSelected([]);
    setSelected(pted.map((f) => f._id.value));
  };

  const val = (k, row) => {
    const key = k[0];
    const _v = row[key];
    const v = _v?.value;
    const value = v || k[1].default_value || "";
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
              {pted.length > 1 && (
                <TableCell
                  sx={{
                    py: 0.5,
                    width: "10px",
                    ...getSX(sorted_columns[0][1]),
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
                    ...getSX(sorted_columns[0][1]),
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
                    sx={getSX(k[1].sx)}
                    key={k[0]}
                    column={k[0]}
                    label={k[1].label}
                    user_added={k[1].user_added || user_added}
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
              let first_val = sorted_columns
                .map((sc) => val(sc, row))
                .find((sc) => sc.value || sc.image);
              if (!first_val) first_val = val(sorted_columns[0], row);

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

                  {colspans.map((cp) => {
                    const _cp = objectExcept(cp, ["colspan"]);
                    return (
                      <Tc
                        key={cp.key}
                        onClick={__sel}
                        {...{
                          ..._cp,
                          sx: {
                            ..._cp.sx,
                            ...(cp.colspan > 0 && { textAlign: "center" }),
                          },
                        }}
                        sheet={active_sheet.key}
                        selected={_selected}
                        colSpan={cp.colspan + 1}
                      />
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        )}
      </TableMui>
      {!locked && (
        <Middle py={4} flexGrow={1}>
          <Upload />
        </Middle>
      )}
    </TableContainer>
  );
}

export default Table;
