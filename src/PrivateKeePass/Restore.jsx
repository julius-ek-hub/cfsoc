import Confirm from "../common/utils/Comfirm";
import useFetcher from "./hooks/useFetcher";

const RestoreEntryOrGroup = ({
  Initiator,
  $location,
  name = "Entry",
  path = "/entry",
}) => {
  const { restoreEntryOrGroup } = useFetcher();
  return (
    <Confirm
      onConfirm={() => {
        restoreEntryOrGroup($location, path);
      }}
      ok_text="Restore"
      Initiator={Initiator}
    >
      Restore {name}?
    </Confirm>
  );
};

export default RestoreEntryOrGroup;
