import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";

import TBody from "./TBody";
import THead from "./THead";

const T = () => {
  return (
    <TableContainer
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        userSelect: "none",
        overflow: "auto",
        width: "100%",
      }}
    >
      <Table
        stickyHeader
        sx={{
          borderCollapse: "collapse",
          "& .MuiTableCell-root": {
            border: "none",
          },
        }}
      >
        <THead />
        <TBody />
      </Table>
    </TableContainer>
  );
};

export default T;
