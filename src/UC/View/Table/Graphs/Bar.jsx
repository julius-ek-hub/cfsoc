import { useEffect, useRef } from "react";

import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

import useDimension from "../../../../common/hooks/useDimensions";
import { Stack } from "@mui/material";

const Bar = ({ x = [], y = [], yn = "", title = "", tooltipLable }) => {
  const chatRef = useRef();
  const { t } = useDimension();

  const draw = () => {
    return new Chart(chatRef.current, {
      type: "bar",
      data: {
        labels: x,
        datasets: [
          {
            backgroundColor: t.palette.primary.main,
            data: y,
            label: yn,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: title,
            font: {
              size: 30,
            },
          },
          tooltip: {
            callbacks: {
              label: tooltipLable,
            },
          },
        },
      },
    });
  };

  useEffect(() => {
    const chat = draw();
    return () => chat.destroy();
  }, [t.palette.primary.main, x, y]);

  return <Box component="canvas" width="100%" ref={chatRef} />;
};

Bar.Loading = () => (
  <Stack
    direction="row"
    gap={1}
    height={500}
    position="relative"
    border={(t) => `1px solid ${t.palette.divider}`}
  >
    {[...new Array(100)].map((i, j) => (
      <Box
        key={j}
        height={`${Math.floor(Math.random() * (100 - 1)) + 0}%`}
        width={30}
        sx={{ alignSelf: "flex-end" }}
      >
        <Skeleton key={j} height={`100%`} width={30} />
      </Box>
    ))}
  </Stack>
);

export default Bar;
