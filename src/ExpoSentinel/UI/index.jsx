import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";

import ExcludedColumns from "../utils/HiddenColumns";
import Err_404 from "../../common/utils/404";
import Table from "./Table";

import useLoading from "../../common/hooks/useLoading";
import useSheet from "../hooks/useSheet";
import useSettings from "../hooks/useSettings";

const Ui = () => {
  const { active_sheet } = useSheet();
  const { settings } = useSettings();
  const { loading } = useLoading();

  const { error } = settings;

  const { path } = useParams();

  if (!active_sheet && !loading.all_mitre)
    return (
      <Err_404
        hide={loading.all_mitre}
        code={error && error.errorCode}
        errorMessage={
          error
            ? error.error
            : `Sheet '${path}' either does not exist or have been deleted`
        }
      />
    );

  return (
    <>
      {active_sheet && (
        <Box display="flex" flexGrow={1} flexDirection="column" overflow="auto">
          <ExcludedColumns />
          <Box
            id="main_table"
            sx={{
              "& .MuiTableContainer-root": {
                display: "flex",
                height: "100%",
                flexDirection: "column",
                table: { borderCollapse: "collapse" },
                "& .MuiTableCell-root": {
                  border: (t) => `1px solid ${t.palette.divider}`,
                },
              },
              flexGrow: 1,
              overflow: "auto",
            }}
          >
            <Table />
          </Box>
        </Box>
      )}
    </>
  );
};

export default Ui;
