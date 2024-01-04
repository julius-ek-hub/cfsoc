import Confirm from "../common/utils/Comfirm";
import useFetcher from "./hooks/useFetcher";

const EmptyRB = ({ Initiator, onDone }) => {
  const { emptyRB } = useFetcher();
  return (
    <Confirm
      onConfirm={() => emptyRB(onDone)}
      ok_color="error"
      ok_text="Empty"
      Initiator={Initiator}
    >
      Empty Recycle Bin? This action can not be undone.
    </Confirm>
  );
};

export default EmptyRB;
