import { useRef, useState, Fragment } from "react";

import { alpha } from "@mui/material/styles";

import TableCell from "@mui/material/TableCell";
import MessageIcon from "@mui/icons-material/Message";

import Menu from "../../../common/utils/Menu";
import EmptyCell from "./Empty";
import Worker from "./Editor/Worker";
import Middle from "../../../common/utils/Middle";

import useCommonSettings from "../../../common/hooks/useSettings";
import useActiveSchedule from "../../hooks/useSchedules/active";
import useSelection from "../../hooks/useSelection";
import useSchedules from "../../hooks/useSchedules";

import {
  has_comments,
  cell_selected,
  int_to_time as itt,
} from "../../utils/utils";

const Td = ({ date, shift_swap, comments, id }) => {
  const [open, setOpen] = useState(false);
  const { uname, getName, user } = useCommonSettings();
  const { active } = useActiveSchedule();
  const { statuses } = useSchedules();
  const [selected, setSel] = useState([]);
  const cellRef = useRef();
  const { getSelected, selectTarget, unselectAll } = useSelection();

  const handleClose = () => {
    setOpen(false);
    unselectAll();
    setSel([]);
  };

  const can_select = !shift_swap && user && !active.locked;
  const status = statuses.find((s) => s.name === date.status);

  const com = has_comments(comments) && user;

  const sh = `${itt(date.shift.from)} - ${itt(date.shift.to)}`;

  return (
    <Menu
      open={open}
      onClose={handleClose}
      Clickable={(props) => (
        <TableCell
          ref={cellRef}
          onContextMenu={(e) => {
            e.preventDefault();
            if (!can_select) return;
            selectTarget(cellRef.current);
            const sel = getSelected();
            setSel(sel);
            props.onClick(e);
            setOpen(true);
          }}
          align="center"
          date_index={id.dateIndex}
          staff={id.staff}
          sx={{
            bgcolor: shift_swap ? "#dddeee" : status.color,
            p: 0,
            cursor: shift_swap ? "auto" : "pointer",
            border: "none !important",
          }}
          {...(can_select && { className: "selectable" })}
        >
          <EmptyCell
            position="relative"
            title={
              `${getName(id.staff)}.\n` +
              (shift_swap
                ? `Moved to ${sh} shift`
                : `${new Date(date.date).toDateString()}, ${sh} shift -- ${
                    status.name
                  }\n\n${
                    com
                      ? `COMMENTS\n\n${Object.entries(comments)
                          .map(([staff, comment]) =>
                            comment
                              ? (staff === uname ? "You" : getName(staff)) +
                                "\n" +
                                comment
                              : ""
                          )
                          .join("\n")}`
                      : ""
                  }`)
            }
          >
            {shift_swap ? "" : status.label}
            {has_comments(comments) && !shift_swap && (
              <MessageIcon
                color="error"
                sx={{
                  position: "absolute",
                  top: 5,
                  fontSize: "15px",
                  right: 5,
                }}
              />
            )}
            {can_select && (
              <Middle
                position="absolute"
                display={cell_selected(selected, id) ? "flex" : "none"}
                top={0}
                bottom={0}
                width="100%"
                bgcolor={(t) => alpha(t.palette.primary.main, 0.2)}
              />
            )}
          </EmptyCell>
        </TableCell>
      )}
    >
      <Worker onClose={handleClose} selected={selected} />
    </Menu>
  );
};

export default Td;
