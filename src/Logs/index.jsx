import { useEffect, useMemo, useState } from "react";

import { useSearchParams } from "react-router-dom";

import Box from "@mui/material/Box";
import TableContainer from "@mui/material/TableContainer";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

import RemoveIcon from "@mui/icons-material/Remove";

import Search from "./Search";
import Nav from "../common/utils/Nav";
import HiddenColumns from "./HiddenColumns";
import IconButton from "../common/utils/IconButton";
import Pagination from "../common/utils/Pagination";
import Filter from "./Filter";

import useFetch from "../common/hooks/useFetch";
import useCommonSettings from "../common/hooks/useSettings";
import useDimension from "../common/hooks/useDimensions";

import {
  _entr,
  _keys,
  _values,
  entr_,
  highlightSearch,
} from "../common/utils/utils";
import { th } from "./utils";

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [hiddenCols, setHiddenCol] = useState([]);
  const [sp] = useSearchParams();
  const [pagination, setPagination] = useState({ page: 0, rowsPerPage: 30 });
  const { uname } = useCommonSettings();
  const { get } = useFetch("/logs");
  const { t } = useDimension();
  const [filters, setFilters] = useState({});

  const da = uname === "default.account" || !uname;

  const { page, rowsPerPage } = pagination;

  const getLogs = async () => {
    const { json } = await get(
      `/logs?q=${sp.get("q") || ""}&t=${sp.get("t") || ""}`
    );
    setFilters({});

    if (!json.error) setLogs(json);
  };

  useEffect(() => {
    if (!da) getLogs();
  }, [da, sp]);

  const filteredLogs = useMemo(
    () =>
      logs.filter((log) => {
        return _entr(filters).every(([k, v]) => {
          if (v.length === 0) return true;
          return v.includes(String(log[k]));
        });
      }),
    [logs, filters]
  );

  const rows = useMemo(
    () =>
      filteredLogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [pagination, filteredLogs]
  );

  const columns = _entr(th).filter(([k]) => !hiddenCols.includes(k));

  const filterValues = useMemo(
    () => entr_(columns.map(([k]) => [k, [...new Set(logs.map((r) => r[k]))]])),
    [logs, columns]
  );

  return (
    <Box display="flex" flexDirection="column" height="100%" overflow="hidden">
      <Box>
        <Nav app="Server Logs" title={`Server Logs`} />
      </Box>
      <Search />
      <HiddenColumns
        hidden={hiddenCols}
        onDelete={(col) =>
          setHiddenCol([...hiddenCols.filter((hc) => hc !== col)])
        }
      />
      <Box flexGrow={1} overflow="auto">
        <TableContainer sx={{ height: "100%" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map(([k, v]) => (
                  <TableCell
                    key={k}
                    sx={{
                      whiteSpace: "nowrap",
                      "&:hover button": { visibility: "visible" },
                    }}
                  >
                    {v}
                    {columns.length > 1 && (
                      <Box display="inline">
                        <IconButton
                          Icon={RemoveIcon}
                          sx={{ visibility: "hidden" }}
                          onClick={() => setHiddenCol([...hiddenCols, k])}
                          title="Hide column"
                          iprop={{ sx: { fontSize: "20px" } }}
                        />
                        <Filter
                          column={k}
                          columns={columns}
                          onChange={(key, val) => {
                            setFilters({ ...filters, [key]: val });
                            setPagination({ page: 0, rowsPerPage: 30 });
                          }}
                          filterValues={filterValues[k]}
                        />
                      </Box>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((log) => (
                <TableRow hover key={log._id}>
                  {columns.map(([k]) => (
                    <TableCell
                      dangerouslySetInnerHTML={{
                        __html: highlightSearch(
                          log[k],
                          sp.get("q"),
                          t.palette.primary.main
                        ),
                      }}
                      key={k}
                      {...(k === "timestamp" && {
                        sx: { whiteSpace: "nowrap" },
                      })}
                    />
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box display="flex" justifyContent="end">
        <Pagination
          rowsPerPage={rowsPerPage}
          page={page}
          onChange={setPagination}
          content={filteredLogs}
        />
      </Box>
    </Box>
  );
};

export default Logs;
