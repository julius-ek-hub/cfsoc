import { useState } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import CheckBox from "@mui/icons-material/CheckBox";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import CheckBoxOutlineBlank from "@mui/icons-material/CheckBoxOutlineBlank";

import DataObjectIcon from "@mui/icons-material/DataObject";
import BorderAllIcon from "@mui/icons-material/BorderAll";
import DownloadIcon from "@mui/icons-material/Download";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import MyMenu from "../../common/utils/Menu";
import useSheet from "../hooks/useSheet";

const Download = ({ onChange }) => {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState([]);

  const { sheet_names } = useSheet();
  const sn_keys = sheet_names.map((sn) => sn.key);

  const handleDownload = (format) => {
    setOpen(false);
    onChange(format, checked);
  };

  const MenuOption = ({ Icon, id = "json" }) => (
    <MenuItem onClick={() => handleDownload(id)}>
      <ListItemIcon>
        <Icon fontSize="small" />
      </ListItemIcon>
      <ListItemText>{id === "json" ? "JSON" : "Excel"}</ListItemText>
      <ListItemIcon>
        <DownloadIcon fontSize="small" />
      </ListItemIcon>
    </MenuItem>
  );

  return (
    <MyMenu
      open={open}
      onClose={() => setOpen(false)}
      Clickable={(props) => (
        <Button
          color="inherit"
          onClick={(e) => {
            setOpen(true);
            props.onClick(e);
          }}
          startIcon={<DownloadIcon />}
          endIcon={<KeyboardArrowDownIcon />}
        >
          Download
        </Button>
      )}
    >
      <Box minWidth={200}>
        <Typography px={2} pt={2}>
          Choose sheets to download
        </Typography>
        <MenuList>
          <Checkbox
            sx={{ ml: 1 }}
            checked={checked.length === sn_keys.length}
            onChange={() =>
              setChecked(checked.length === sn_keys.length ? [] : sn_keys)
            }
          />
          <Stack
            ml={2}
            sx={{
              maxHeight: (window.innerHeight * 60) / 100,
              overflow: "auto",
            }}
          >
            {sheet_names.map((sn) => (
              <Button
                onClick={() => {
                  setChecked(
                    checked.includes(sn.key)
                      ? checked.filter((c) => c !== sn.key)
                      : [...checked, sn.key]
                  );
                }}
                key={sn.key}
                startIcon={
                  checked.includes(sn.key) ? (
                    <CheckBox color="primary" />
                  ) : (
                    <CheckBoxOutlineBlank />
                  )
                }
                color="inherit"
                sx={{ justifyContent: "start" }}
              >
                {sn.name}
              </Button>
            ))}
          </Stack>
          {checked.length > 0 && (
            <Box ml={2}>
              <Typography ml={2} my={1} color="primary">
                Choose format:
              </Typography>
              <MenuOption id="json" Icon={DataObjectIcon} />
              <MenuOption id="table" Icon={BorderAllIcon} />
            </Box>
          )}
        </MenuList>
      </Box>
    </MyMenu>
  );
};

export default Download;
