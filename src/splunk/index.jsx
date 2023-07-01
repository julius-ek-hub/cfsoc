import { useState } from "react";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";

import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";

import Search from "./Search";
import Notify from "./Notify";
import Nav from "../common/utils/Nav";
import Severities from "./Severities";
import AddNotify from "./AddNotify";
import IconButton from "../common/utils/IconButton";
import EachAlert from "./EachAlert";

import useCommonSettings from "../common/hooks/useSettings";

import { alert_titles } from "./utils";

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}

const rows = [
  createData("India", "IN", 1324171354, 3287263),
  createData("China", "CN", 1403500365, 9596961),
  createData("Italy", "IT", 60483973, 301340),
  createData("United States", "US", 327167434, 9833520),
  createData("Canada", "CA", 37602103, 9984670),
  createData("Australia", "AU", 25475400, 7692024),
  createData("Germany", "DE", 83019200, 357578),
  createData("Ireland", "IE", 4857000, 70273),
  createData("Mexico", "MX", 126577691, 1972550),
  createData("Japan", "JP", 126317000, 377973),
  createData("France", "FR", 67022000, 640679),
  createData("United Kingdom", "GB", 67545757, 242495),
  createData("Russia", "RU", 146793744, 17098246),
  createData("Nigeria", "NG", 200962417, 923768),
  createData("Brazil", "BR", 210147125, 8515767),
];

const Splunk = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const { user, staffs, update, alarm } = useCommonSettings();
  const [openInfo, setOpeninfo] = useState(true);

  if (!staffs || !user) return null;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSelectSingle = (name) => {
    let _sel = [...selected];
    if (_sel.includes(name)) _sel = _sel.filter((s) => s !== name);
    else _sel.push(name);
    setSelected(_sel);
  };
  const handleMultipleSelect = () => {
    if (selected.length === rows.length) return setSelected([]);
    setSelected([...rows].map((r) => r.name));
  };

  if (!user) return null;

  return (
    <Box sx={{ display: "flex", height: "100vh", flexDirection: "column" }}>
      <Nav app="Splunk webhook" />
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          flexDirection: "column",
          overflow: "auto",
          p: 3,
        }}
      >
        <Box display="flex" my={2} justifyContent="space-between">
          <Typography variant="h4" fontWeight=" bold">
            Alerts
          </Typography>
          <Box>
            <IconButton
              Icon={ArrowForwardIosIcon}
              size="small"
              iprop={{
                sx: {
                  transform: `rotate(${openInfo ? 90 : 180}deg)`,
                  transition: "200ms transform",
                },
              }}
              onClick={() => setOpeninfo(!openInfo)}
            />
            <IconButton
              Icon={alarm ? NotificationsActiveIcon : NotificationsOffIcon}
              iprop={{ fontSize: "large" }}
              onClick={() => {
                update("alarm", alarm ? undefined : "ok");
              }}
            />
          </Box>
        </Box>

        <Box>
          <Collapse in={openInfo}>
            <Box display="flex" gap={4} flexWrap="wrap" pb={2}>
              <Severities />
              <Search />
              <Notify />
              <AddNotify />
            </Box>
            <Divider />
          </Collapse>
        </Box>
        <Paper
          sx={{ width: "100%", position: "sticky", top: 100 }}
          elevation={0}
        >
          <TableContainer>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell width={50}>
                    <PriorityHighIcon
                      fontSize="small"
                      sx={{ transform: "rotate(20deg)" }}
                    />
                  </TableCell>
                  <TableCell width={50}>
                    <Checkbox
                      onChange={handleMultipleSelect}
                      checked={selected.length === rows.length}
                    />
                  </TableCell>
                  {alert_titles.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                  <TableCell align="right" width={140} sx={{ pr: 3 }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <EachAlert
                      row={row}
                      key={row.code}
                      selected={selected.includes(row.name)}
                      onSelect={handleSelectSingle}
                    />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default Splunk;
