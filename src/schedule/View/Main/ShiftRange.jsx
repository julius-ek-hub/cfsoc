import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { int_to_time } from "../../utils/utils";

const ShiftRange = ({ from, to, label, colspan }) => {
  return (
    <TableCell
      sx={{
        p: 0,
        color: "common.white",
        bgcolor: "primary.main",
      }}
      scope="row"
      colSpan={colspan}
    >
      <Box display="flex" alignItems="center" ml={2}>
        {int_to_time(from)}
        <Typography px={1}>&#8212;</Typography>
        {int_to_time(to)}
        <Typography ml={2}>{label}</Typography>
      </Box>
    </TableCell>
  );
};

export default ShiftRange;
