import Chip from "@mui/material/Chip";

import AccessTimeIcon from "@mui/icons-material/AccessTime";

import Accordion from "./Accordion";
import AddShift from "../../../../utils/AddShift";
import MenuItem from "./MenuItem";

import useSchedules from "../../../../hooks/useSchedules";
import useCommonSettings from "../../../../../common/hooks/useSettings";

import { int_to_time as itt } from "../../../../utils/utils";

function Shifts() {
  const { admin } = useCommonSettings();
  const { shifts } = useSchedules();

  return (
    <Accordion title="Shifts" TitltIcon={AccessTimeIcon}>
      {shifts.map((s) => (
        <MenuItem key={s.from} no_edit no_delete>
          {itt(s.from)} &#8212; {itt(s.to)}
          {s.label && <Chip label={s.label} size="small" sx={{ ml: 1 }} />}
        </MenuItem>
      ))}
      {admin && <AddShift>Add</AddShift>}
    </Accordion>
  );
}

export default Shifts;
