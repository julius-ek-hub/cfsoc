import { useEffect, useState } from "react";

import Pie from "./Pie";

import useStats from "../../../hooks/useStats";
import useSheet from "../../../hooks/useSheet";

const SourceGraph = ({ width, height }) => {
  const [data, setData] = useState([]);
  const { sourceStats } = useStats();
  const { contents } = useSheet();

  useEffect(() => {
    setData(sourceStats());
  }, [contents]);

  if (data.length === 0) return <Pie.Loading />;

  return (
    <Pie
      type="doughnut"
      y={data.map((d) => d[1])}
      x={data.map((d) => d[0])}
      yn="UC Count"
      xn="Techniques"
      title="Sources"
      width={width}
      height={height}
    />
  );
};

export default SourceGraph;
