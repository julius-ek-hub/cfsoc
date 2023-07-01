import { useState } from "react";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import Collapse from "@mui/material/Collapse";
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
  const [open, setOpen] = useState(false);
  const { dlete } = useFetch();
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

  const Tc = (props) => (
    <TableCell {...(open && { sx: { borderBottom: "none" } })} {...props} />
  );

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
        <Tc>
          <IconButton
            Icon={ArrowForwardIosIcon}
            size="small"
            iprop={{
              fontSize: "small",
              sx: {
                transform: `rotate(${open ? 90 : 0}deg)`,
                transition: "200ms transform",
              },
            }}
            onClick={() => setOpen(!open)}
          />
        </Tc>
        {columns.map((column) => {
          let value = row[column.id];
          value = column.id === "admin" ? (value ? "Admin" : "User") : value;
          return (
            <Tc key={column.id} align={column.align}>
              {value}
            </Tc>
          );
        })}
        <Tc>
          {admin && (
            <Box visibility="hidden" whiteSpace="nowrap">
              {uname !== row.username && (
                <Confirm
                  ok_color="error"
                  ok_text="Yes"
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
            </Box>
          )}
        </Tc>
      </TableRow>
      <TableRow>
        <TableCell
          colSpan={8}
          sx={{
            paddingBottom: 0,
            paddingTop: 0,
            border: "none",
            ...(open && {
              borderBottom: (t) => `1px solid ${t.palette.divider}`,
            }),
          }}
        >
          <Collapse in={open}>
            <Box p={2}>Some staff info</Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const Staffs = () => {
  const { user, staffs: st } = useCommonSettings();
  if (!user || !st) return null;

  const staffs = Object.values(st);

  return (
    <>
      <Typography variant="h4" fontWeight=" bold">
        All Staffs
      </Typography>
      <Paper elevation={0} sx={{ overflow: "auto", maxWidth: "100%" }}>
        <AddUser />
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
