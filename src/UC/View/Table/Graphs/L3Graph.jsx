import { useEffect, useRef, useState } from "react";

import useSheet from "../../../hooks/useSheet";
import useStats from "../../../hooks/useStats";

import Bar from "./Bar";

const L3Graph = () => {
  const [data, setData] = useState();
  const { contents } = useSheet();
  const { get } = useStats();

  const loading = useRef();

  useEffect(() => {
    loading.current = setTimeout(() => {
      let _uc = contents.l3_uc.map((uc) => {
        const d = get("l3_uc", uc.identifier.value, {
          related: true,
          sub: true,
        });
        return {
          ...uc,
          uc_count: d.uc_count.value,
        };
      });
      setData(_uc);
    }, 1000);
    return () => clearTimeout(loading.current);
  }, [contents]);

  if (!data) return <Bar.Loading />;

  return (
    <Bar
      y={data.map((uc) => uc.uc_count).filter((ucc) => ucc > 0)}
      x={data
        .filter((uc) => uc.uc_count > 0)
        .map((uc, i) => uc.identifier.value)}
      yn="UC Count"
      xn="Techniques"
      title="L3UC"
      tooltipLable={(context) => [
        " " +
          contents.l3_uc.find((l1) => l1.identifier.value === context.label)
            ?.name?.value || "None",
        ` UC: ${context.formattedValue}`,
      ]}
    />
  );
};

export default L3Graph;
