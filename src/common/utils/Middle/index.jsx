import { Box, BoxProps } from "@mui/material";

/**
 * Centers its contents both vertically and horizontally
 * and defaults flexDirection to column
 * @param {BoxProps} props
 */

function Middle(props) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      {...props}
    />
  );
}

export default Middle;
