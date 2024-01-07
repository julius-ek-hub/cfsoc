import { useEffect, useState } from "react";

import Pie from "./Pie";

import useStats from "../../../hooks/useStats";
import useSheet from "../../../hooks/useSheet";

const TechnologyGraph = ({ width, height }) => {
  const [data, setData] = useState([]);
  const { techStats } = useStats();
  const { contents } = useSheet();

  useEffect(() => {
    setData(techStats());
  }, [contents]);

  if (data.length === 0) return <Pie.Loading />;

  return (
    <Pie
      type="doughnut"
      y={data.map((d) => d[1])}
      x={data.map((d) => d[0])}
      yn="UC Count"
      xn="Techniques"
      title="Technologies"
      width={width}
      height={height}
    />
  );
};

export default TechnologyGraph;
