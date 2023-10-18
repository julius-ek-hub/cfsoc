import { useEffect } from "react";

import Box from "@mui/material/Box";
import TablePagination from "@mui/material/TablePagination";
import LargePagination from "@mui/material/Pagination";
import IconButton from "@mui/material/IconButton";

import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";

import useSheet from "../hooks/useSheet";

import useSettings from "../hooks/useSettings";
import useFilter from "../hooks/useFilter";

import { field_separator as fs } from "../utils/utils";
import useFetcher from "../hooks/useFetcher";

function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0}>
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0}>
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        <LastPageIcon />
      </IconButton>
    </Box>
  );
}

const HeaveSheetPagination = () => {
  const { active_sheet, updateSheet } = useSheet();
  const { fetchSheetContent } = useFetcher();
  const { num_rows, large_page, key } = active_sheet;

  if (num_rows <= 5000) return null;

  const handleChange = (e, newPage) => {
    updateSheet(`${key + fs}large_page`, newPage);
    fetchSheetContent(key, true, newPage);
  };

  return (
    <>
      <HorizontalRuleIcon />
      <LargePagination
        page={large_page || 1}
        onChange={handleChange}
        count={Math.ceil(60000 / 1000)}
        color="primary"
        sx={{ ul: { flexWrap: "nowrap" } }}
      />
    </>
  );
};

export default function Pagination() {
  const { active_sheet, updateSheet } = useSheet();
  const { filtered } = useFilter(true);
  const { updateSettings } = useSettings();

  const f = filtered();

  const { key, pagination } = active_sheet;
  const { page = 0, rowsPerPage = 30 } = pagination;

  const handleChangePage = (event, newPage) => {
    updateSheet(`${key + fs}pagination`, {
      ...active_sheet.pagination,
      page: newPage,
    });
    updateSettings("changed", true);
  };
  const handleChangeRowsPerPage = (event) => {
    updateSheet(`${key + fs}pagination`, {
      ...active_sheet.pagination,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0,
    });
    updateSettings("changed", true);
  };

  useEffect(() => {
    handleChangeRowsPerPage({ target: { value: 30 } });
  }, [key]);

  if (!active_sheet || f.length === 0) return null;

  return (
    <Box display="flex" ml="auto" flexShrink={0} alignItems="center">
      <TablePagination
        component="div"
        sx={{ flexShrink: 0 }}
        rowsPerPageOptions={[30, 60, 100, 200]}
        colSpan={3}
        count={f.length}
        rowsPerPage={rowsPerPage}
        page={page}
        SelectProps={{
          native: true,
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        ActionsComponent={TablePaginationActions}
      />
      <HeaveSheetPagination />
    </Box>
  );
}
