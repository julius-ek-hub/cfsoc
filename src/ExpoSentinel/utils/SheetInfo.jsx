import useSheet from "../hooks/useSheet";
import useCommonSettings from "../../common/hooks/useSettings";

export default function SheetInfo() {
  const { active_sheet } = useSheet();
  const { getName, uname } = useCommonSettings();

  if (!active_sheet) return null;

  const { creator, date_created } = active_sheet;

  const d = new Date(date_created);

  return (
    <>
      Created on {d.toDateString()}, {d.toLocaleTimeString()} by{" "}
      {uname === creator ? "You" : getName(creator)}
    </>
  );
}
