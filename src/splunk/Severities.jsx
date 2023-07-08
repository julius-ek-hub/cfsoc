import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import useAlerts from "./hooks/useAlerts";

const Severities = () => {
  const { alerts } = useAlerts();

  const Sev = ({ sev, colf, colt }) => (
    <Box
      sx={{
        backgroundImage: `linear-gradient(to bottom, ${colf}, ${colt})`,
        justifyContent: "space-between",
        display: "flex",
        p: 1,
        cursor: "pointer",
      }}
    >
      <Typography>{sev.toUpperCase()}</Typography>
      <Typography>
        {alerts.filter((a) => a.urgency?.toLowerCase() === sev).length}
      </Typography>
    </Box>
  );

  return (
    <Box mb={4}>
      <Typography variant="h6" mb={1}>
        Ugency
      </Typography>
      <Stack color="common.white" gap={0.2}>
        <Sev sev="critical" colf="#d85d3c" colt="#bb4f32" />
        <Sev sev="high" colf="#db8e55" colt="#c47b44" />
        <Sev sev="medium" colf="#e1d53b" colt="#cec228" />
        <Sev sev="low" colf="#b9d577" colt="#a5bf66" />
        <Sev sev="informational" colf="#86c0e3" colt="#6fa8ca" />
      </Stack>
    </Box>
  );
};

export default Severities;
