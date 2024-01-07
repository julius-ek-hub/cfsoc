import { useEffect, useRef } from "react";

import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

const Pie = ({
  x = [],
  y = [],
  width,
  height,
  type = "pie",
  title = "",
  tooltipLable,
}) => {
  const chatRef = useRef();

  const draw = () => {
    return new Chart(chatRef.current, {
      type,
      data: {
        labels: x,
        datasets: [
          {
            data: y,
          },
        ],
      },
      options: {
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
  }, [x, y]);

  return <Box component="canvas" width={width} height={height} ref={chatRef} />;
};

Pie.Loading = () => <Skeleton height={400} width={400} variant="circular" />;

export default Pie;
