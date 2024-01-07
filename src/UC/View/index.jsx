import Box from "@mui/material/Box";

import TableView from "./Table";
import UseCaseGrid from "./GridView";
import Graphs from "./Table/Graphs";

const View = ({ location }) => {
  return (
    <Box display="flex" flexGrow={1} flexDirection="column" overflow="auto">
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
        }}
      >
        {location === "all_uc" ? (
          <UseCaseGrid />
        ) : location === "summary" ? (
          <Graphs />
        ) : (
          <TableView />
        )}
      </Box>
    </Box>
  );
};

export default View;
