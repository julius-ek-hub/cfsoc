import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

import { th } from "./utils";
import { _entr } from "../common/utils/utils";

const HiddenColumns = ({ hidden = [], onDelete }) => {
  if (hidden.length === 0) return null;
  return (
    <Box display="flex" gap={2} mx={2} alignItems="center">
      <Typography fontWeight="bold" whiteSpace="nowrap">
        Hidden Columns:
      </Typography>
      <Stack flexDirection="row" gap={1} overflow="auto">
        {_entr(th)
          .filter(([k]) => hidden.includes(k))
          .map(([k, v]) => (
            <Chip
              size="small"
              key={k}
              label={v}
              onDelete={() => onDelete(k)}
              variant="outlined"
              color="primary"
            />
          ))}
      </Stack>
    </Box>
  );
};

export default HiddenColumns;
