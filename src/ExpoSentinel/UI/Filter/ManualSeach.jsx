import { useEffect, useState } from "react";

import InputAdornment from "@mui/material/InputAdornment";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";

import Middle from "../../../common/utils/Middle";
import IconButton from "../../../common/utils/IconButton";
import TextField from "../../../common/utils/form/uncontrolled/TextField";

import Search from "@mui/icons-material/Search";

import useSheet from "../../hooks/useSheet";
import useSettings from "../../hooks/useSettings";
import useLocalStorage from "../../../common/hooks/useLocalStorage";

const ManualSearch = () => {
  const { setSearch } = useSheet();
  const { settings, updateSettings } = useSettings();
  const [value, setValue] = useState("");
  const [_case, setCase] = useState(false);
  const { set, remove, get } = useLocalStorage();

  const cs = "case_sensitive_search";

  const handleSearch = () => {
    updateSettings("search", false);
    setSearch(value);
    _case ? set(cs, true) : remove(cs);
  };
  useEffect(() => {
    setCase(Boolean(get(cs)));
  }, []);

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
        }}
        helperText={
          <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              size="small"
              checked={_case}
              onChange={() => setCase(!_case)}
            />
            Case sensitive search
          </Box>
        }
      />
    </Middle>
  );
};

export default ManualSearch;
