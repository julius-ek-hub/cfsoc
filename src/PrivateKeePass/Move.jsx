import Confirm from "../common/utils/Comfirm";
import useFetcher from "./hooks/useFetcher";

import useSettings from "./hooks/useSettings";

const MoveEntryOrGroup = ({ Initiator, $location, name = "Entry", onDone }) => {
  const { updateSettings } = useSettings();
  const one = $location.length === 1;
  const _name = one ? name : name === "Entry" ? "Entries" : name + "s";
  return (
    <Confirm
      onConfirm={() => {
        updateSettings("move_group_entity", $location);
        onDone?.call();
      }}
      title="One moment!"
      ok_text="Move"
      Initiator={Initiator}
    >
      After clicking "Move", navigate to the group you want to move to, open the
      menu and click "Move {_name} Here"
    </Confirm>
  );
};

MoveEntryOrGroup.Move = ({
  Initiator,
  $target,
  name = "Entry",
  $to,
  onDone,
}) => {
  const { updateSettings } = useSettings();
  const { moveEntryOrGroup } = useFetcher();
  const one = $target.length === 1;
  return (
    <Confirm
      onConfirm={() => {
        moveEntryOrGroup($target, $to, () => {
          updateSettings("move_group_entity", undefined);
          onDone?.call();
        });
      }}
      ok_text="Move"
      Initiator={Initiator}
    >
      Move {one ? name : name === "Entry" ? "Entries" : name + "s"} here?
    </Confirm>
  );
};

export default MoveEntryOrGroup;
