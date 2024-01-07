import { useEffect, useState } from "react";

import useSheet from "../../../hooks/useSheet";
import useStats from "../../../hooks/useStats";

import Pie from "./Pie";

const L2Graph = ({ width, height }) => {
  const [data, setData] = useState();
  const { contents } = useSheet();
  const { get } = useStats();

  useEffect(() => {
    let _uc = contents.l2_uc.map((uc) => {
      const d = get("l2_uc", uc.identifier.value, { related: true, sub: true });
      return {
        ...uc,
        uc_count: d.uc_count.value,
      };
    });
    setData(_uc);
  }, [contents]);

  if (!data) return <Pie.Loading />;

  return (
    <Pie
      y={data.map((uc) => uc.uc_count)}
      x={data.map((uc) => uc.identifier.value)}
      yn="UC Count"
      xn="Techniques"
      title="L2UC"
      width={width}
      height={height}
      tooltipLable={(context) => [
        " " +
          contents.l2_uc.find((l1) => l1.identifier.value === context.label)
            ?.name?.value || "None",
        ` UC: ${context.formattedValue}`,
      ]}
    />
  );
};

export default L2Graph;
