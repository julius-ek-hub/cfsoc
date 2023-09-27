import { Fragment, useEffect } from "react";

import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

import Td from "./Td";
import ShiftRange from "./ShiftRange";
import EmptyCell from "./Empty";
import AddShift from "../../utils/AddShift";

import useActiveSchedule from "../../hooks/useSchedules/active";
import useSchedules from "../../hooks/useSchedules";
import useSelection from "../../hooks/useSelection";
import useCommonSettings from "../../../common/hooks/useSettings";

import { staffs_in_shift } from "../../utils/utils";

const TBody = () => {
  const { active_assiduity, active, active_by } = useActiveSchedule();
  const { shifts } = useSchedules();
  const { init } = useSelection();
  const { admin, user, getName } = useCommonSettings();

  useEffect(() => {
    user && !active.locked && init();
  }, [user, active_by]);

  let max_row = 2;

  if (active_assiduity?.length == 0) return null;

  const RowNum = ({ num, ex }) => (
    <TableCell align="center" sx={{ p: 0 }}>
      <EmptyCell sx={{ ...ex, px: 1 }}>{num}</EmptyCell>
    </TableCell>
  );

  return (
    <TableBody id="tbody-selectable">
      <>
        {shifts.map((shift, i) => {
          const ass = staffs_in_shift(shift, active_assiduity);
          return (
            <Fragment key={shift.from + shift.to}>
              {ass.length > 0 && (
                <TableRow className="no-select">
                  <RowNum ex={{ height: 30 }} cx={{ p: 0 }} num={++max_row} />
                  <ShiftRange
                    {...shift}
                    colspan={active_assiduity[0].dates.length + 1}
                  />
                </TableRow>
              )}
              {ass.map(({ dates, staff }) => {
                return (
                  <TableRow key={staff}>
                    <RowNum num={++max_row} />
                    <TableCell sx={{ p: 0 }}>
                      <EmptyCell alignItems="start" pl={2}>
                        {getName(staff)}
                      </EmptyCell>
                    </TableCell>
                    {dates.map((d, dateIndex) => {
                      const id = { dateIndex, staff };
                      return (
                        <Td
                          key={d.date}
                          id={id}
                          date={d}
                          staff={staff}
                          comments={d.comments}
                          shift_swap={
                            !(
                              d.shift.from === shift.from &&
                              d.shift.to === shift.to
                            )
                          }
                        />
                      );
                    })}
                  </TableRow>
                );
              })}
            </Fragment>
          );
        })}

        <TableRow>
          <RowNum num={++max_row} />
          <TableCell align="left" sx={{ p: 0 }}>
            <EmptyCell
              sx={{
                alignItems: "start",
                pl: 2,
                fontWeight: "bold",
                bgcolor: "primary.main",
                color: "common.white",
              }}
            >
              Staff Count
            </EmptyCell>
          </TableCell>
          {active_assiduity[0].dates.map(({ date }) => (
            <TableCell align="left" sx={{ p: 0 }} key={date}>
              <EmptyCell
                sx={{
                  pl: 1,
                  fontWeight: "bold",
                  bgcolor: "primary.main",
                  color: "common.white",
                }}
              >
                {
                  active_assiduity.filter((ac) =>
                    ac.dates.find((d) => d.date === date && d.status === "work")
                  ).length
                }
              </EmptyCell>
            </TableCell>
          ))}
        </TableRow>

        {admin && (
          <TableRow>
            <RowNum num={++max_row} />
            <TableCell
              align="left"
              sx={{ p: 0 }}
              colSpan={active_assiduity[0].dates.length + 1}
            >
              <EmptyCell sx={{ alignItems: "start", pl: 1 }}>
                <AddShift />
              </EmptyCell>
            </TableCell>
          </TableRow>
        )}
      </>
    </TableBody>
  );
};

export default TBody;
