import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";

import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

import EditUC from "../View/Table/EditUC";
import Middle from "../../common/utils/Middle";
import MainFilterDropdown from "./MainFilterDropdow";
import IconButton from "../../common/utils/IconButton";
import TextField from "../../common/utils/form/uncontrolled/TextField";

import useSheet from "../hooks/useSheet";

import { _entr } from "../utils/utils";

export default function MainFilter() {
  const { sheets, sp_filter, resetSP, contents } = useSheet();
  const [val, setVal] = useState("");

  const { columns } = sheets.all_uc;

  const search = (sp_filter.uc_search || []).join("");

  const updateSearch = (search) => {
    resetSP("uc_search", search ? [search] : undefined);
  };
  useEffect(() => {
    setVal(search);
  }, [search]);

  const total = contents.all_uc.length;

  const Divide = () => (
    <Box
      sx={{
        border: (t) => `1px solid ${t.palette.divider}`,
        width: 30,
        transform: "rotate(90deg)",
        flexShrink: 0,
      }}
    />
  );

  return (
    <Middle flexShrink={0} width="100%">
      <Middle
        flexDirection="row"
        borderBottom={(t) => `1px solid ${t.palette.divider}`}
        py={2}
        width="100%"
        overflow="auto"
        flexShrink={0}
        flexWrap="wrap"
        gap={2}
      >
        <TextField
          value={val}
          onEnterButtonPressed={(e) => updateSearch(e.target.value.trim())}
          onChange={(e) => setVal(e.target.value)}
          size="small"
          sx={{ minWidth: "20%", flexShrink: 0 }}
          placeholder={`Search Use cases by ${[
            ...new Set(_entr(columns).map((sc) => sc[1].label)),
          ].join(", ")}`}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            ...(search && {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton Icon={CloseIcon} onClick={() => updateSearch()} />
                </InputAdornment>
              ),
            }),
          }}
        />
        <Stack direction="row" spacing={1}>
          {["source", "customer", "technology"].map((col) => (
            <MainFilterDropdown column={col} key={col} />
          ))}
        </Stack>
      </Middle>
      <Middle
        mt={1}
        pb={1}
        color="text.secondary"
        borderBottom={(t) => `1px solid ${t.palette.divider}`}
        width="100%"
        flexDirection="row"
      >
        {`${total} use case${total === 1 ? "" : "s"}`}
        <Divide />
        <EditUC />
      </Middle>
    </Middle>
  );
}
