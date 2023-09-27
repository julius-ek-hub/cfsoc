import { useEffect } from "react";

import Box from "@mui/material/Box";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";

import useSheet from "../hooks/useSheet";

import useSettings from "../hooks/useSettings";
import useFilter from "../hooks/useFilter";

import { field_separator } from "../utils/utils";

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

export default function Pagination() {
  const { active_sheet, updateSheet } = useSheet();
  const { filtered } = useFilter(true);
  const { updateSettings } = useSettings();

  const f = filtered();

  const { key, pagination } = active_sheet;
  const { page = 0, rowsPerPage = 30 } = pagination;

  const handleChangePage = (event, newPage) => {
    updateSheet(`${key + field_separator}pagination`, {
      ...active_sheet.pagination,
      page: newPage,
    });
    updateSettings("changed", true);
  };
  const handleChangeRowsPerPage = (event) => {
    updateSheet(`${key + field_separator}pagination`, {
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
    <TablePagination
      component="div"
      sx={{ ml: "auto" }}
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
  );
}
