import L1UCForm from "./L1UCForm";
import L2UCForm from "./L2UCForm";
import L3UCForm from "./L3UCForm";
import L4UCForm from "./L4UCForm";
import OtherForm from "./OtherForm";

import WithButtons from "./utils/WithButtons";

import useSheet from "../../hooks/useSheet";

const AddRow = () => {
  const { active_sheet } = useSheet();
  const { key, columns, name } = active_sheet;

  if (Object.keys(columns || {}).length === 0) return null;

  const uc = {
    l1_uc: { Form: L1UCForm, name },
    l2_uc: { Form: L2UCForm, name },
    l3_uc: { Form: L3UCForm, name },
    l4_uc: { Form: L4UCForm, name },
  }[key] || { Form: OtherForm, name: "" };

  return <WithButtons Form={uc.Form} name={uc.name} />;
};

export default AddRow;
