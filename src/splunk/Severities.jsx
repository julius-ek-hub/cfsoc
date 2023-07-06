import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

const Severities = () => {
  return (
    <Box mb={4}>
      <Typography variant="h6" mb={1}>
        Ugency
      </Typography>
      <Stack color="common.white" gap={0.1}>
        <Box
          display="flex"
          justifyContent="space-between"
          sx={{
            backgroundImage: "linear-gradient(to bottom, #d85d3c, #bb4f32)",
          }}
          p={1}
        >
          <Typography>CRITICAL</Typography>
          <Typography>0</Typography>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          sx={{
            backgroundImage: "linear-gradient(to bottom, #db8e55, #c47b44)",
          }}
          p={1}
        >
          <Typography>HIGH</Typography>
          <Typography>0</Typography>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          sx={{
            backgroundImage: "linear-gradient(to bottom, #e1d53b, #cec228)",
          }}
          p={1}
        >
          <Typography>MEDIUM</Typography>
          <Typography>0</Typography>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          sx={{
            backgroundImage: "linear-gradient(to bottom, #b9d577, #a5bf66)",
          }}
          p={1}
        >
          <Typography>LOW</Typography>
          <Typography>0</Typography>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          sx={{
            backgroundImage: "linear-gradient(to bottom, #86c0e3, #6fa8ca)",
          }}
          p={1}
        >
          <Typography>INFORMATIONAL</Typography>
          <Typography>0</Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default Severities;
