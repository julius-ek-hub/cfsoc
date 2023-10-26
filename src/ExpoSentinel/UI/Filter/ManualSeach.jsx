import { useState } from "react";

import InputAdornment from "@mui/material/InputAdornment";

import Middle from "../../../common/utils/Middle";
import IconButton from "../../../common/utils/IconButton";
import TextField from "../../../common/utils/form/uncontrolled/TextField";

import Search from "@mui/icons-material/Search";
import Close from "@mui/icons-material/Close";

import useSheet from "../../hooks/useSheet";
import useSettings from "../../hooks/useSettings";

const ManualSearch = () => {
  const { setSearch } = useSheet();
  const { settings, updateSettings } = useSettings();
  const [value, setValue] = useState("");

  const handleSearch = () => {
    updateSettings("search", false);
    setSearch(value);
  };
  const handleClose = () => {
    updateSettings("search", false);
    setSearch([]);
  };

  if (!settings.search) return null;

  return (
    <Middle flexDirection="row" mx={2} my={1}>
      <TextField
        type="search"
        size="small"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onEnterButtonPressed={handleSearch}
        placeholder="Search anything..."
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton Icon={Search} onClick={handleSearch} />
            </InputAdornment>
          ),
          startAdornment: (
            <InputAdornment position="start">
              <IconButton Icon={Close} onClick={handleClose} />
            </InputAdornment>
          ),
        }}
        helperText="Search anything withing this sheet."
      />
    </Middle>
  );
};

export default ManualSearch;
