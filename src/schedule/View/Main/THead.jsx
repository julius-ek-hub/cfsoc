import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import EmptyCell from "./Empty";
import Middle from "../../../common/utils/Middle";

import * as u from "../../utils/utils";

import useActiveSchedule from "../../hooks/useSchedules/active";

const SMB = (props) => <Button size="small" color="inherit" {...props} />;

const THead = () => {
  const { active_assiduity, active } = useActiveSchedule();
  if (!active_assiduity[0]) return null;

  if (!active) return null;
  const { from, to } = active;
  const [f, t] = u.schedule_date_range_ui(from, to);

  return (
    <TableHead onContextMenu={(e) => e.preventDefault()}>
      <TableRow>
        {[...u.create_th(active_assiduity), [0, 0], [1, 1]].map((_, i) => (
          <TableCell key={i} align="center" sx={{ p: 0 }}>
            <EmptyCell sx={{ height: 35, bgcolor: "#eeeee" }}>
              {i > 0 && u.numberToLetters(i - 1)}
            </EmptyCell>
          </TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell align="center" sx={{ p: 0 }}>
          <EmptyCell sx={{ height: 28 }}>1</EmptyCell>
          <EmptyCell sx={{ height: 28 }}>2</EmptyCell>
        </TableCell>
        <TableCell
          rowSpan={2}
          sx={{
            whiteSpace: "nowrap",
            bgcolor: "rgb(198,89,17)",
            color: "common.white",
            p: 0,
          }}
        >
          <EmptyCell sx={{ height: 52 }}>
            <Middle flexDirection="row">
              <SMB>{f}</SMB>
              <Typography>&#8212;</Typography>
              <SMB>{t}</SMB>
            </Middle>
          </EmptyCell>
        </TableCell>

        {u.create_th(active_assiduity).map(([m_d, w_d, f_date]) => (
          <TableCell
            key={f_date}
            align="center"
            sx={{
              bgcolor: "rgb(128,128,128)",
              color: "common.white",
              p: 0,
            }}
          >
            <EmptyCell sx={{ height: 28, minWidth: 60 }}>{m_d}</EmptyCell>
            <EmptyCell sx={{ height: 28, minWidth: 60 }}>{w_d}</EmptyCell>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default THead;
