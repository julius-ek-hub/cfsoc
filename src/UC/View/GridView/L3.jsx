import { useEffect, useState } from "react";

import Card from "./Card";

import useSheet from "../../hooks/useSheet";

const L3 = ({ data }) => {
  const { contents } = useSheet();
  const [uc, setUC] = useState();

  useEffect(() => {
    const id = data.identifier.value;
    setUC({
      ...data,
      $for: {
        l3_uc_identifier: id,
        l2_uc_identifier: data.l2_uc_identifiers.value[0],
        l1_uc_identifier: data.l1_uc_identifiers.value[0],
      },
      iKey: "l3_uc_identifiers",
      iValue: id,
    });
  }, [data]);

  if (!uc) return null;

  const identifier = uc.identifier.value;

  const footerGetter = () => {
    const l4_len = contents.l4_uc.filter((uc) =>
      uc.l3_uc_identifiers.value.includes(identifier)
    ).length;
    return `${l4_len} Sub Technique${l4_len > 1 ? "s" : ""}`;
  };

  return (
    <Card
      iKey={"l3_uc_identifiers"}
      iValue={identifier}
      name={uc.name.value}
      description={uc.description.value}
      footerGetter={footerGetter}
      $for={uc.$for}
    />
  );
};

export default L3;
