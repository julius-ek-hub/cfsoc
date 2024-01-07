import { useEffect, useState } from "react";

import Stack from "@mui/material/Stack";

import Card from "./Card";
import L3 from "./L3";

import useSheet from "../../hooks/useSheet";

const L2 = ({ data }) => {
  const { contents } = useSheet();

  const [uc, setUC] = useState();

  useEffect(() => {
    const id = data.identifier.value;
    const $for = {
      l2_uc_identifier: id,
      l1_uc_identifier: data.l1_uc_identifiers.value[0],
    };
    setUC({
      data: { ...data, $for, iKey: "l2_uc_identifiers", iValue: id },
      l3s: contents.l3_uc.filter((l3) =>
        l3.l2_uc_identifiers.value.includes(id)
      ),
    });
  }, [data]);

  if (!uc) return null;

  const identifier = uc.data.identifier.value;

  const footerGetter = () => {
    const l3_len = contents.l3_uc.filter((uc) =>
      uc.l2_uc_identifiers.value.includes(identifier)
    ).length;
    return `${l3_len} Technique${l3_len > 1 ? "s" : ""}`;
  };

  return (
    <Stack>
      <Card
        iKey={"l2_uc_identifiers"}
        iValue={uc.data.identifier.value}
        description={uc.data.description.value}
        name={uc.data.name.value}
        footerGetter={footerGetter}
        $for={data.$for}
      />
      {uc.l3s.map((l3) => (
        <L3 data={l3} key={l3.identifier.value} />
      ))}
    </Stack>
  );
};

export default L2;
