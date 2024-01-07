import { useEffect, useState } from "react";

import dayjs from "dayjs";

import { useSearchParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

import PickerWithNoInput from "../common/utils/form/uncontrolled/PickerWithNoInput.jsx";
import TextField from "../common/utils/form/uncontrolled/TextField";
import useDimension from "../common/hooks/useDimensions";
import IconButton from "../common/utils/IconButton";
import Middle from "../common/utils/Middle";
import Menu from "../common/utils/Menu";

import { _entr, _l } from "../common/utils/utils";
import { InputAdornment } from "@mui/material";

const But = (props) => (
  <Button
    sx={{ justifyContent: "left", whiteSpace: "nowrap" }}
    color="inherit"
    {...props}
  />
);

const Search = () => {
  const { up } = useDimension();
  const [dateopen, setDateOpen] = useState(false);
  const [draweropen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("24h");
  const [sv, setSV] = useState("");
  const [sp, ssp] = useSearchParams();

  const [custom, setCustom] = useState({
    from: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    to: new Date().toISOString(),
  });

  const times = {
    "4h": "4 hours ago",
    "24h": "24 hours ago",
    "1w": "1 week ago",
    "30d": "30 days",
    "1y": "1 year ago",
  };

  const handleCustomChange = (when, $d) => {
    setCustom({
      ...custom,
      [when]: $d.toISOString(),
    });
  };

  const handleAll = (q, t) => {
    setDateOpen(false);
    setDrawerOpen(false);
    const _t = sp.get("t");
    const _q = sp.get("q");
    ssp([
      ["t", typeof t === "undefined" ? (_t === null ? "" : _t) : t],
      ["q", typeof q === "undefined" ? (_q === null ? "" : _q) : q],
    ]);
  };

  const setCustomDate = () =>
    handleAll(undefined, `${custom.from}_${custom.to}`);

  const handleSearch = () => handleAll(sv.trim());

  const initialize = () => {
    const t = sp.get("t") || "";
    const q = sp.get("q") || "";
    setSV(q);
    if (times[t]) return setSelectedDate(t);

    const d = t.split("_");
    if (d.length !== 2) return;
    const from = new Date(d[0]);
    const to = new Date(d[1]);
    if ([from, to].some((_d) => _l(_d) === "invalid date")) return;
    if (from.getTime() > to.getTime()) return;

    setSelectedDate(t);
    setCustom({
      from: from.toISOString(),
      to: to.toISOString(),
    });
  };

  useEffect(() => {
    initialize();
  }, [sp]);

  return (
    <Middle>
      <Middle
        flexDirection="row"
        gap={2}
        my={2}
        sx={{ width: up.md ? 500 : "90vw" }}
      >
        <TextField
          size="small"
          placeholder="Search Logs..."
          fullWidth
          value={sv}
          onChange={(e) => setSV(e.target.value)}
          onEnterButtonPressed={handleSearch}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  Icon={sv ? CloseIcon : SearchIcon}
                  onClick={() => {
                    if (sv) {
                      setSV("");
                      handleAll("");
                    }
                  }}
                />
              </InputAdornment>
            ),
          }}
        />
        <Menu
          alpha={0.5}
          open={dateopen}
          onClose={() => setDateOpen(false)}
          Initiator={(props) => (
            <But
              color="primary"
              endIcon={<KeyboardArrowDownIcon />}
              startIcon={<AccessTimeIcon />}
              {...props}
              onClick={(e) => {
                setDateOpen(true);
                props.onClick(e);
              }}
            >
              {times[selectedDate] || "Custom range"}
            </But>
          )}
        >
          <Stack p={2}>
            {_entr(times).map(([k, v]) => (
              <But
                onClick={() => handleAll(undefined, k)}
                key={k}
                {...(k === selectedDate && { color: "primary" })}
              >
                {v}
              </But>
            ))}
            <But
              {...(selectedDate.split("_").length === 2 && {
                color: "primary",
              })}
              endIcon={<KeyboardArrowUp />}
              onClick={() => setDrawerOpen(true)}
            >
              Custom range
            </But>
          </Stack>
        </Menu>
      </Middle>
      <Drawer
        sx={{ zIndex: (t) => t.zIndex.modal }}
        onClose={() => setDrawerOpen(false)}
        open={draweropen}
        anchor="bottom"
      >
        <Box
          p={2}
          display="flex"
          flexDirection="column"
          height="100%"
          flexGrow={1}
          overflow="auto"
          alignItems="center"
        >
          <Box
            position="sticky"
            top={0}
            display="flex"
            justifyContent="end"
            width={"100%"}
            bgcolor="inherit"
          >
            <IconButton Icon={CloseIcon} onClick={() => setDrawerOpen(false)} />
          </Box>
          <Stack
            gap={2}
            flexGrow={1}
            overflow="auto"
            height="100%"
            flexDirection="row"
            justifyContent="space-between"
            width={up.md ? 900 : "100%"}
          >
            <Box>
              <PickerWithNoInput
                type="datetime"
                ampmInClock
                slotProps={{ actionBar: { sx: { display: "none" } } }}
                value={dayjs(custom.from)}
                onChange={(d) => handleCustomChange("from", d)}
                shouldDisableDate={(d) => {
                  return new Date(d).getTime() > new Date(custom.to).getTime();
                }}
              />
            </Box>

            <Middle>
              <Typography variant="h4">To</Typography>
            </Middle>

            <Box>
              <PickerWithNoInput
                type="datetime"
                ampmInClock
                slotProps={{ actionBar: { sx: { display: "none" } } }}
                value={dayjs(custom.to)}
                onChange={(d) => handleCustomChange("to", d)}
                shouldDisableDate={(d) => {
                  return (
                    new Date(d).getTime() < new Date(custom.from).getTime()
                  );
                }}
              />
            </Box>
          </Stack>
          <Box>
            <Button variant="contained" size="small" onClick={setCustomDate}>
              Set
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Middle>
  );
};

export default Search;
