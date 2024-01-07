import { useRef } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import L2 from "./L2";

import useSheet from "../../hooks/useSheet";

const UCGrid = () => {
  const { contents } = useSheet();

  const boxRef = useRef();

  const { l2_uc } = contents;

  return (
    <>
      <Box
        ref={boxRef}
        display="flex"
        flexGrow={1}
        flexDirection="column"
        overflow="auto"
        alignItems="center"
      >
        <Stack direction="row">
          {l2_uc.map((l2) => (
            <L2 data={l2} key={l2.identifier.value} />
          ))}
        </Stack>
      </Box>
    </>
  );
};

export default UCGrid;
