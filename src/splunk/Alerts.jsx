import { useEffect, useRef, useState } from "react";

import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import DoneAllIcon from "@mui/icons-material/DoneAll";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import EachAlert from "./EachAlert";
import NoAlerts from "./NoAlerts";
import Loading from "./Loading";
import IconButton from "../common/utils/IconButton";

import useLoading from "../common/hooks/useLoading";
import useAlerts from "./hooks/useAlerts";

import { alert_titles } from "./utils";
import useCommonSettings from "../common/hooks/useSettings";

const Alerts = () => {
  const [page, setPage] = useState(0);
  const intRef = useRef();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { alerts, checkUnreceivedAlerts, updateAlert } = useAlerts();
  const { loading } = useLoading();
  const { uname } = useCommonSettings();

  const unacknowledged = alerts
    .filter((a) => a.status !== "acknowledged")
    .map((a) => a._id);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    intRef.current = setInterval(checkUnreceivedAlerts, 5000);
    return () => clearInterval(intRef.current);
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
                    {unacknowledged.length > 0 && (
                      <IconButton
                        Icon={DoneAllIcon}
                        title="Acknowledge All"
                        onClick={() => {
                          updateAlert(unacknowledged, {
                            owner: uname,
                            status: "acknowledged",
                          });
                        }}
                      />
                    )}
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
                    <EachAlert alert={alert} key={alert._id} />
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
      {!loading.alerts && alerts.length === 0 && <NoAlerts />}
    </Paper>
  );
};

export default Alerts;
