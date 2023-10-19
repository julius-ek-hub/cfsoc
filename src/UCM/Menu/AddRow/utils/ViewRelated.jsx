import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import useSheet from "../../../hooks/useSheet";

import { _l } from "../../../utils/utils";

function ViewRelated({ _ids }) {
  const { active_sheet, sheets, active_content_with_calculations } = useSheet();

  const { key } = active_sheet;

  const selected = (k, arr) => {
    const ret = [
      ...new Set(
        active_content_with_calculations()
          .filter((c) => _ids.includes(c._id.value))
          .map((c) => c[k].value)
      ),
    ];
    return arr ? ret.map((i) => i.split(", ")).flat() : ret;
  };

  const nav = useNavigate();

  const handle = (to) => {
    const ret = {};
    if (key === "l1_uc") ret.l1_uc_identifiers = selected("identifier");
    else if (key === "l2_uc") {
      if (to === "l1_uc") ret.identifier = selected("l1_uc_identifiers");
      else ret.l2_uc_identifiers = selected("identifier");
    } else if (key === "l3_uc") {
      if (to === "l1_uc") ret.identifier = selected("l1_uc_identifiers", true);
      else if (to === "l2_uc")
        ret.identifier = selected("l2_uc_identifiers", true);
      else ret.l3_uc_identifiers = selected("identifier");
    } else if (key === "l4_uc") {
      if (to === "l1_uc") ret.identifier = selected("l1_uc_identifiers", true);
      else if (to === "l2_uc")
        ret.identifier = selected("l2_uc_identifiers", true);
      else if (to === "l3_uc")
        ret.identifier = selected("l3_uc_identifiers", true);
      else ret.l4_uc_identifiers = selected("identifier");
    } else if (key === "all_uc") {
      ret.identifier = selected(`${to}_identifiers`, true);
    }

    return ret;
  };

  const goSearchRelated = (to) => {
    const sp = Object.entries(handle(to))[0];

    nav(
      `/use-case-management/${
        to + (sp ? `?${sp[0]}=${sp[1].join(`&${sp[0]}=`)}` : "")
      }`
    );
  };

  const But = ({ tos }) => {
    return tos
      .filter((to) => sheets[to])
      .map((to) => (
        <Button
          key={to}
          color="inherit"
          endIcon={<OpenInNewIcon />}
          onClick={() => goSearchRelated(to)}
        >
          View Related {sheets[to].name}
        </Button>
      ));
  };
  return (
    <>
      {key === "l1_uc" && <But tos={["l2_uc", "l3_uc", "l4_uc", "all_uc"]} />}
      {key === "l2_uc" && <But tos={["l1_uc", "l3_uc", "l4_uc", "all_uc"]} />}
      {key === "l3_uc" && <But tos={["l1_uc", "l2_uc", "l4_uc", "all_uc"]} />}
      {key === "l4_uc" && <But tos={["l1_uc", "l2_uc", "l3_uc", "all_uc"]} />}
      {key === "all_uc" && <But tos={["l1_uc", "l2_uc", "l3_uc", "l4_uc"]} />}
    </>
  );
}

export default ViewRelated;
