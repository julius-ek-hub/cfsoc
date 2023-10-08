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

import { field_separator as fs } from "../utils/utils";

import useFilter from "../hooks/useFilter";
import useSheet from "../hooks/useSheet";
import useFetch from "../../common/hooks/useFetch";

const Tc = ({ link, value, image, sheet, ...rest }) => {
  const { serverURL } = useFetch();
  return (
    <TableCell {...rest}>
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
  } = active_sheet;

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
        {Object.keys(active_sheet.columns).length > 0 && !locked && (
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
              {sorted_columns.map((k) => {
                return (
                  <FilterButton
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
              const colLen = sorted_columns.length;
              let first_val = sorted_columns
                .map((sc) => val(sc, row))
                .find((sc) => sc.value || sc.image);
              if (!first_val) first_val = val(sorted_columns[0], row);

              const span =
                [
                  ...new Set(
                    sorted_columns.map((e) => row[e[0]]?.value).filter((v) => v)
                  ),
                ].length <= 1;

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
                  {!locked && (
                    <>
                      <TableCell
                        sx={{
                          bgcolor: first_val.sx?.bgcolor,
                        }}
                      >
                        {page * rowsPerPage + 1 + index}
                      </TableCell>
                      <TableCell
                        sx={{
                          py: 0.5,
                          width: "10px",
                          bgcolor: first_val.sx?.bgcolor,
                        }}
                      >
                        <Checkbox checked={_selected} onChange={__sel} />
                      </TableCell>
                    </>
                  )}
                  {colLen > 1 && span ? (
                    <Tc
                      {...first_val}
                      image={Object.values(row).find((e) => e?.image)?.image}
                      onClick={__sel}
                      colSpan={colLen}
                      sheet={key}
                    />
                  ) : (
                    sorted_columns.map((k) => (
                      <Tc
                        key={k}
                        onClick={__sel}
                        {...val(k, row)}
                        sheet={active_sheet.key}
                      />
                    ))
                  )}
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
