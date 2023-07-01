import Box from "@mui/material/Box";

import AccessTimeIcon from "@mui/icons-material/AccessTime";

import Accordion from "./Accordion";
import AddStatus from "./AddStatus";
import MenuItem from "./MenuItem";

import useSchedules from "../../../../hooks/useSchedules";
import useCommonSettings from "../../../../../common/hooks/useSettings";

import { u } from "../../../../../common/utils/utils";

function ShiftsStatuses() {
  const { admin } = useCommonSettings();
  const { statuses } = useSchedules();

  return (
    <Accordion title="Shift statuses" TitltIcon={AccessTimeIcon}>
      {statuses.map((status) => (
        <MenuItem
          key={status.name}
          Editor={(props) => <AddStatus {...props} edit={status} />}
          no_edit={["work", "off"].includes(status.name)}
          no_delete
        >
          <Box
            component="span"
            width={12}
            height={12}
            bgcolor={status.color}
            borderRadius={6}
            mr={1}
            border={(t) => `1px solid ${t.palette.divider}`}
          />
          {u(status.name)}
        </MenuItem>
      ))}
      {admin && <AddStatus />}
    </Accordion>
  );
}

export default ShiftsStatuses;
