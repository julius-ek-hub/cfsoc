import { memo, useEffect, useState } from "react";

import { useTheme } from "@mui/material/styles";

import Checkbox from "@mui/material/Checkbox";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";

import Loading from "./Loading";

import useSheet from "../../hooks/useSheet";
import useStats from "../../hooks/useStats";

import { _entr, highlightSearch } from "../../../common/utils/utils";

const Row = ({
  handleClick,
  sc,
  isSelected,
  row,
  is_uc,
  search,
  selected,
  index,
  $key,
}) => {
  const [data, setData] = useState({});
  const { contents } = useSheet();
  const { get } = useStats();
  const t = useTheme();

  const isItemSelected = isSelected(row._id.value);

  useEffect(() => {
    const stats = get($key, row.identifier.value);
    setData({ ...row, ...stats });
  }, [contents]);

  if (_entr(data).length === 0) return <Loading cols={sc} />;

  return (
    <TableRow
      hover
      onClick={() => handleClick(row._id.value, data)}
      role="checkbox"
      selected={isItemSelected}
      sx={{ cursor: "pointer" }}
    >
      {selected.length > 0 && is_uc && (
        <TableCell padding="checkbox">
          <Checkbox color="primary" checked={isItemSelected} />
        </TableCell>
      )}
      <TableCell>{index}</TableCell>
      {sc.map(([k]) => (
        <TableCell
          key={k}
          dangerouslySetInnerHTML={{
            __html: highlightSearch(
              data[k]?.value,
              search,
              t.palette.primary.main
            ),
          }}
          sx={{
            ...(k === "identifier" && { whiteSpace: "nowrap" }),
          }}
        />
      ))}
    </TableRow>
  );
};

const Tbody = (props) => {
  const { pagination, visibleRows, ...rest } = props;

  const { page = 0, rowsPerPage = 30 } = pagination || {};

  return (
    <TableBody>
      {visibleRows.map((row, index) => {
        return (
          <Row
            row={row}
            hover
            key={row._id.value}
            sx={{ cursor: "pointer" }}
            index={page * rowsPerPage + index + 1}
            {...rest}
          />
        );
      })}
    </TableBody>
  );
};

export default memo(Tbody);
