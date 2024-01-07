import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import L1Graph from "./L1Graph";
import L2Graph from "./L2Graph";
import L3Graph from "./L3Graph";
import L4Graph from "./L4Graph";
import SourceGraph from "./SourceGraph";
import TechnologyGraph from "./TechnologyGrap";
import CustomerGraph from "./CustomerGraph";
import Middle from "../../../../common/utils/Middle";

import useDimension from "../../../../common/hooks/useDimensions";

const Graphs = () => {
  const { up } = useDimension();
  const pWidth = up.md ? 500 : "90vw";

  return (
    <>
      <Middle my={4} flexShrink={0}>
        <Typography variant="h3" fontWeight="bold">
          Summary
        </Typography>
      </Middle>
      <Stack
        direction="row"
        justifyContent="space-around"
        mt={5}
        gap={5}
        flexWrap="wrap"
      >
        <Box width={pWidth} height={pWidth}>
          <L1Graph width={pWidth} height={pWidth} />
        </Box>
        <Box width={pWidth} height={pWidth}>
          <L2Graph width={pWidth} height={pWidth} />
        </Box>
        <Box width={pWidth} height={pWidth}>
          <CustomerGraph width={pWidth} height={pWidth} />
        </Box>
        <Box width={pWidth} height={pWidth}>
          <TechnologyGraph width={pWidth} height={pWidth} />
        </Box>
        <Box width={pWidth} height={pWidth}>
          <SourceGraph width={pWidth} height={pWidth} />
        </Box>
      </Stack>
      {[L3Graph, L4Graph].map((L34, i) => (
        <Box key={i} height={500} mt={8}>
          {<L34 />}
        </Box>
      ))}
    </>
  );
};

export default Graphs;
