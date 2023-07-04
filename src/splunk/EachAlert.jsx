import { useState } from "react";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";

import IconButton from "../common/utils/IconButton";

import { alert_titles } from "./utils";

const EachAlert = ({ alert, selected, onSelect }) => {
  const [open, setOpen] = useState(false);

  const Tc = (props) => (
    <TableCell {...(open && { sx: { borderBottom: "none" } })} {...props} />
  );
  return (
    <>
      <TableRow role="checkbox">
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
        <Tc>
          <Checkbox checked={selected} onChange={() => onSelect(alert._id)} />
        </Tc>
        {alert_titles.map((column) => {
          const value = alert[column.id];
          return <Tc key={column.id}>{value}</Tc>;
        })}
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
            <Box p={2}>Alert info</Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default EachAlert;
