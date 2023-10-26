import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import useSheet from "../../../hooks/useSheet";

import { _values, objectExcept } from "../../../utils/utils";
import useCommonSettings from "../../../../common/hooks/useSettings";

function ViewRelated({ _ids }) {
  const { active_sheet, sheets, active_content } = useSheet();
  const { getName } = useCommonSettings();
  const nav = useNavigate();

  const { key, excluded_columns } = active_sheet;

  const go = [
    ...new Set(
      active_content
        .filter((c) => _ids.includes(c._id.value))
        .map((c) =>
          _values(objectExcept(c, ["_id", ...excluded_columns])).map(
            (v) => v.value
          )
        )
        .flat()
        .filter((v) => v)
    ),
  ];

  if (go.length === 0) return null;

  const goSearchRelated = (to) =>
    nav(`/expo-sentinel/${to + `?q=${go.join(`&q=`)}`}`);

  return (
    <>
      Search selected row{_ids.length > 1 ? "s" : ""} in:
      {_values(sheets)
        .filter((sheet) => sheet.key !== key && sheet.key !== "welcome")
        .map((sheet) => (
          <Button
            key={sheet.key}
            color="inherit"
            endIcon={<OpenInNewIcon />}
            onClick={() => goSearchRelated(sheet.key)}
          >
            {sheet.name} by {getName(sheet.creator).split(" ")[0]}
          </Button>
        ))}
    </>
  );
}

export default ViewRelated;
