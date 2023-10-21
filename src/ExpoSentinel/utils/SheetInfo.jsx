import useSheet from "../hooks/useSheet";
import useCommonSettings from "../../common/hooks/useSettings";

export default function SheetInfo() {
  const { active_sheet } = useSheet();
  const { getName } = useCommonSettings();

  if (!active_sheet) return null;

  const { creator, date_created } = active_sheet;

  return (
    <>
      Created by {getName(creator)} on {date_created}
    </>
  );
}
