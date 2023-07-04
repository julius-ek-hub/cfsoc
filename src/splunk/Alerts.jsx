import { useEffect, useState } from "react";

import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

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
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import EachAlert from "./EachAlert";
import NoAlerts from "./NoAlerts";
import Loading from "./Loading";

import useLoading from "../common/hooks/useLoading";
import useAlerts from "./hooks/useAlerts";

import { alert_titles } from "./utils";

const Alerts = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const { alerts, checkUnreceivedAlerts } = useAlerts();
  const { loading } = useLoading();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSelectSingle = (_id) => {
    let _sel = [...selected];
    if (_sel.includes(_id)) _sel = _sel.filter((s) => s !== _id);
    else _sel.push(_id);
    setSelected(_sel);
  };
  const handleMultipleSelect = () => {
    if (selected.length === alerts.length) return setSelected([]);
    setSelected([...alerts].map((a) => a._id));
  };

  useEffect(() => {
    const check_unreceived_alerts = setInterval(checkUnreceivedAlerts, 5000);
    return () => clearInterval(check_unreceived_alerts);
  }, []);

  return (
    <Paper sx={{ width: "100%", position: "sticky", top: 100 }} elevation={0}>
      <Typography variant="h5" fontWeight="bold" pb={2}>
        Alerts
      </Typography>
      <Loading abs={false} loading={loading.alerts} />
      {alerts.length > 0 && (
        <>
          <Divider />
          <TableContainer>
            {selected.length > 0 && (
              <Box mt={1}>
                <Button size="small">Acknowledge</Button>
                <Button size="small" color="error">
                  Deleted
                </Button>
              </Box>
            )}
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
                      checked={selected.length === alerts.length}
                    />
                  </TableCell>
                  {alert_titles.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {alerts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((alert) => (
                    <EachAlert
                      alert={alert}
                      key={alert._id}
                      selected={selected.includes(alert._id)}
                      onSelect={handleSelectSingle}
                    />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={alerts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
      {!loading.alerts && alert.length === 0 && <NoAlerts />}
    </Paper>
  );
};

export default Alerts;
