import { useEffect } from "react";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import Add from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";

import useCommonSettings from "../../../common/hooks/useSettings";
import useActiveSchedule from "../../hooks/useSchedules/active";

import { accepted_schedule } from "../../utils/utils";
import { u } from "../../../common/utils/utils";

const OwnerNav = () => {
  const { uname } = useCommonSettings();
  const {
    active,
    set_active_by,
    active_by,
    generateSchedule,
    may_create_own,
    setSelected,
  } = useActiveSchedule();

  const suggested = Object.keys(active?.suggestions || {});
  const accepted = accepted_schedule(active?.suggestions || {});
  const sug = [accepted];
  suggested.map((s) => !sug.includes(s) && sug.push(s));

  const handleChange = (event, newValue) => {
    setSelected([]);
    if (newValue >= sug.length) return generateSchedule();
    set_active_by(sug[newValue]);
  };

  const ind = (staff) => {
    const ind = sug.findIndex((s) => s === staff);
    return ind < 0 ? 0 : ind;
  };

  useEffect(() => {
    if (active.error) return;
    if (!sug.find((s) => s === active_by))
      set_active_by(Object.keys(active.suggestions)[0]);
  }, [active]);

  if (!active.suggestions || active.error) return null;

  return (
    <Box>
      <Tabs
        variant="scrollable"
        onChange={handleChange}
        value={ind(active_by)}
        scrollButtons={true}
        sx={{ "& .MuiTab-root": { minHeight: "unset" } }}
      >
        {sug.map((sk) => (
          <Tab
            key={sk}
            {...(sk === accepted && {
              icon: <CheckIcon fontSize="small" />,
              iconPosition: "start",
            })}
            label={
              sk === uname
                ? "You"
                : sk === "system"
                ? "SYSTEM"
                : u(sk.split(".")[0])
            }
          />
        ))}

        {may_create_own() && uname !== "guest" && (
          <Tab
            label="Create blanc"
            icon={<Add fontSize="small" />}
            iconPosition="start"
          />
        )}
      </Tabs>
    </Box>
  );
};

export default OwnerNav;
