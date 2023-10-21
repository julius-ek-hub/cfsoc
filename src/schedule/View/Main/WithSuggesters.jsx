import { useEffect, useState } from "react";

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import IconButton from "../../../common/utils/IconButton";
import Menu from "../../../common/utils/Menu";

import useActiveSchedule from "../../hooks/useSchedules/active";
import useCommonSettings from "../../../common/hooks/useSettings";

import { u } from "../../../common/utils/utils";

const WithSuggested = ({ Icon, onChoose, okText, ...rest }) => {
  const [open, setOpen] = useState(false);
  const { active } = useActiveSchedule();
  const { uname } = useCommonSettings();
  const all = Object.keys(active.suggestions);
  const [selected, setSelected] = useState(all);

  const all_elected = all.every((s) => selected.includes(s));

  const onChange = (staff) => {
    if (typeof staff === "object") {
      if (all_elected) return setSelected([]);
      return setSelected(all);
    }
    if (selected.includes(staff))
      return setSelected([...selected.filter((s) => s !== staff)]);
    setSelected([...selected, staff]);
  };

  const onOk = () => {
    setOpen(false);
    onChoose(selected);
  };

  useEffect(() => {
    setSelected(Object.keys(active.suggestions));
  }, [active]);

  return (
    <Menu
      open={open}
      onClose={() => setOpen(false)}
      Clickable={(props) => (
        <IconButton
          Icon={Icon}
          {...props}
          onClick={(e) => {
            setOpen(true);
            props.onClick(e);
          }}
          {...rest}
        />
      )}
    >
      <FormGroup sx={{ p: 1, px: 2 }}>
        {rest.title}
        <Divider sx={{ my: 1 }} />
        By:
        <FormControlLabel
          control={<Checkbox checked={all_elected} onChange={onChange} />}
          label="All"
        />
        {all.map((staff) => (
          <FormControlLabel
            key={staff}
            control={
              <Checkbox
                checked={selected.includes(staff)}
                onChange={() => onChange(staff)}
              />
            }
            label={
              staff === "system"
                ? "SYSTEM"
                : staff === uname
                ? "You"
                : u(staff.split(".")[0])
            }
          />
        ))}
        {selected.length > 0 && (
          <Button variant="contained" sx={{ mt: 1 }} onClick={onOk}>
            {okText}
          </Button>
        )}
      </FormGroup>
    </Menu>
  );
};

export default WithSuggested;
