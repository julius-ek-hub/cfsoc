import Skeleton from "@mui/material/Skeleton";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

const Loading = ({ cols }) => {
  return (
    <TableRow>
      {[...cols, ["key"]].map(([k]) => (
        <TableCell key={k} sx={{ p: 0, px: 2 }}>
          <Skeleton height={80} />
        </TableCell>
      ))}
    </TableRow>
  );
};

export default Loading;
