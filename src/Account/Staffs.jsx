import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LockResetIcon from "@mui/icons-material/LockReset";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import IconButton from "../common/utils/IconButton";
import Confirm from "../common/utils/Comfirm";
import RestPass from "./ResetPass";
import AddUser from "./AddUser";

import useLoading from "../common/hooks/useLoading";
import useFetch from "../common/hooks/useFetch";
import useCommonSettings from "../common/hooks/useSettings";

const columns = [
  { id: "name", label: "Name", minWidth: 170 },
  { id: "position", label: "Job title", minWidth: 170 },
  {
    id: "level",
    label: "Level",
    minWidth: 10,
    align: "right",
  },
  {
    id: "admin",
    label: "Role",
    minWidth: 30,
    align: "right",
  },
];

const Tr = ({ row }) => {
  const { dlete } = useFetch("/auth");
  const { update: ul } = useLoading();
  const { update: us, staffs, uname, admin } = useCommonSettings();

  const handleDelete = async () => {
    try {
      ul(true);
      const { json } = await dlete(`/staffs?username=${row.username}`);
      if (json.error) console.error(json.error);
      else {
        let $new = { ...staffs };
        delete $new[row.username];
        us("staffs", $new);
      }
      ul(false);
    } catch (error) {
      ul(false);
    }
  };

  return (
    <>
      <TableRow
        role="checkbox"
        sx={{
          "&:hover td:last-child .MuiBox-root": {
            visibility: "visible",
          },
        }}
      >
        {columns.map((column) => {
          let value = row[column.id];
          value = column.id === "admin" ? (value ? "Admin" : "User") : value;
          return (
            <TableCell key={column.id} align={column.align}>
              {value}
            </TableCell>
          );
        })}
        <TableCell>
          {admin && (
            <Box visibility="hidden" whiteSpace="nowrap">
              {uname !== row.username && (
                <Confirm
                  ok_color="error"
                  ok_text="Yes"
                  fullWidth
                  onConfirm={handleDelete}
                  Clickable={(props) => (
                    <IconButton
                      title="Remove"
                      color="error"
                      Icon={DeleteIcon}
                      {...props}
                    />
                  )}
                >
                  Are you sure you want to remove {row.name}
                </Confirm>
              )}
              <AddUser
                edit={row}
                ClickComponent={(props) => (
                  <IconButton
                    title="Edit"
                    sx={{ ml: 1 }}
                    Icon={EditIcon}
                    {...props}
                  />
                )}
              />
              <RestPass
                staff={row}
                ClickComponent={(props) => (
                  <IconButton
                    title={`Reset ${row.name.split(" ")[0]}'s Password`}
                    sx={{ ml: 1 }}
                    Icon={LockResetIcon}
                    {...props}
                  />
                )}
              />
            </Box>
          )}
        </TableCell>
      </TableRow>
    </>
  );
};

const Staffs = () => {
  const { user, staffs: st, admin } = useCommonSettings();
  if (!user || !st) return null;

  const staffs = Object.values(st).filter((st) => st.username !== "system");

  return (
    <>
      <Typography variant="h4" fontWeight=" bold">
        All Staffs
      </Typography>
      <Paper elevation={0} sx={{ overflow: "auto", maxWidth: "100%" }}>
        {admin && <AddUser />}
        <TableContainer>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {staffs.map((staff) => (
                <Tr row={staff} key={staff._id} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default Staffs;
