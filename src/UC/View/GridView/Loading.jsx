import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

const Loading = () => {
  return (
    <Box
      height={180}
      width={180}
      position="relative"
      border={(t) => `1px solid ${t.palette.divider}`}
      p={2}
      m={1}
      borderRadius={1.5}
      flexShrink={0}
    >
      <Skeleton width={"30%"} />
      <Skeleton width={"90%"} />
      <Skeleton width={"50%"} sx={{ position: "absolute", bottom: 10 }} />
    </Box>
  );
};

export default Loading;
