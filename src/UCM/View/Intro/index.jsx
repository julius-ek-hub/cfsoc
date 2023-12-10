import Typography from "@mui/material/Typography";
import Middle from "../../../common/utils/Middle";
import useDimension from "../../../common/hooks/useDimensions";

const Intro = () => {
  const { up } = useDimension();

  return (
    <Middle flexGrow={1} overflow="auto" position="relative">
      <Typography
        variant="h1"
        sx={{
          whiteSpace: "nowrap",
          fontWeight: "bold",
          position: "relative",
          ...(!up.md && { transform: "scale(0.4)" }),
          "&:after": {
            content: '""',
            position: "absolute",
            width: 55,
            height: 15,
            bgcolor: "rgb(255,71,19)",
            right: -15,
            top: -8,
          },
          "&:before": {
            content: '""',
            position: "absolute",
            width: 18,
            height: 52.5,
            bgcolor: "background.paper",
            right: 45,
            top: 37,
          },
        }}
      >
        BEACON RED
      </Typography>
      <Typography
        mt={2}
        color="text.secondary"
        {...(!up.md && { sx: { transform: "scale(0.8)" } })}
      >
        THE GREATEST RISK IS COMPLACENCY
      </Typography>
      <Typography
        position="absolute"
        bottom={40}
        color="text.secondary"
        fontSize="small"
      >
        USE CASE MANAGEMENT
      </Typography>
    </Middle>
  );
};

export default Intro;
