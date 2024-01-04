import Confirm from "../common/utils/Comfirm";
import useFetcher from "./hooks/useFetcher";

const RestoreRB = ({ Initiator, onDone }) => {
  const { restoreRB } = useFetcher();
  return (
    <Confirm
      onConfirm={() => restoreRB(onDone)}
      ok_text="Restore"
      Initiator={Initiator}
    >
      Restore all Items in the Recycle Bin?
    </Confirm>
  );
};

export default RestoreRB;
