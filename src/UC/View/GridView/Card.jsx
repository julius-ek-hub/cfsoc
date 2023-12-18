import { lighten } from "@mui/material/styles";

import MuiCard from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const Card = ({ title, content = "", action, type, bg_alpha = 0, onClick }) => (
  <Box
    onClick={onClick}
    p={0.4}
    tabIndex={1}
    sx={{
      border: "2px solid transparent",
      "&:focus": {
        border: (t) => `2px solid ${t.palette.primary.main}`,
      },
    }}
  >
    <MuiCard
      title={content}
      variant="outlined"
      sx={{
        flexShrink: 0,
        height: 150,
        minWidth: 150,
        cursor: "pointer",
        position: "relative",
        ...(bg_alpha > 0 && {
          bgcolor: (t) =>
            lighten(t.palette.primary.main, bg_alpha === 1 ? 0 : bg_alpha),
          color: bg_alpha === 0.8 ? "common.black" : "common.white",
        }),
      }}
    >
      <CardContent sx={{ pb: 0 }}>
        <Typography
          fontWeight="bolder"
          {...(type === "technique" && {
            variant: "h6",
          })}
        >
          {title}
        </Typography>
        <Typography>{`${content.substring(0, 20)}${
          content.length > 20 ? "..." : ""
        }`}</Typography>
      </CardContent>
      <CardActions
        sx={{
          fontSize: "small",
          mt: "auto",
          position: "absolute",
          bottom: 0,
          left: "8px",
          backgroundColor: "inherit",
        }}
      >
        {action}
      </CardActions>
    </MuiCard>
  </Box>
);

export default Card;
