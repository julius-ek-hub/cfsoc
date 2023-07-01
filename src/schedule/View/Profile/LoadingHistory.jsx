import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

const LoadingHistory = () => {
  return (
    <Box>
      {[...new Array(10)].map((i, k) => (
        <Skeleton height={80} key={k} />
      ))}
    </Box>
  );
};

export default LoadingHistory;
