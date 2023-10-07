import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";

import SettingsIcon from "@mui/icons-material/Settings";

import Accordion from "./Accordion";
import View from "./View";

import useSettings from "../../../../hooks/useSettings";
import useFetch from "../../../../../common/hooks/useFetch";
import useLoading from "../../../../../common/hooks/useLoading";
import useCommonSettings from "../../../../../common/hooks/useSettings";
import { Box } from "@mui/material";

function Settings() {
  const { max_days, update: uss } = useSettings();
  const { admin } = useCommonSettings();
  const { update: ul } = useLoading(15);

  const { post } = useFetch();

  const saveChanges = async (event) => {
    const max_days = event.target.value;
    if (!admin) return;
    ul(true);
    await post("/max_days", { max_days });
    uss("max_days", max_days);
    ul(false);
  };

  return (
    <Box size="small" sx={{ mt: 2, px: 2 }}>
      <InputLabel>Schedule interval:</InputLabel>
      <Select
        value={max_days}
        label="Schedule interval"
        onChange={saveChanges}
        disabled={!admin}
        margin="dense"
        size="small"
        fullWidth
      >
        <MenuItem value={15}>Every 2 weeks</MenuItem>
        <MenuItem value={30}>Every month</MenuItem>
      </Select>
      <FormHelperText>
        Set this before generating next schedule, will only affect future
        schedules.
      </FormHelperText>
    </Box>
  );
}

export default Settings;
