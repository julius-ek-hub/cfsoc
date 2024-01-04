import Confirm from "../common/utils/Comfirm";
import useFetcher from "./hooks/useFetcher";

const DeleteEntryOrgroup = ({
  Initiator,
  $location,
  name = "Entry",
  path = "/entry",
  permanent,
}) => {
  const { deletEntryOrGroup } = useFetcher();
  const one = $location.length === 1;
  const _name = one ? name : name === "Entry" ? "Entries" : name + "s";
  return (
    <Confirm
      onConfirm={() => {
        deletEntryOrGroup($location, path);
      }}
      ok_color="error"
      ok_text="Delete"
      Initiator={Initiator}
    >
      {permanent
        ? `${one ? "This" : "These"} ${_name} will be lost forever`
        : `Delete ${_name}`}
    </Confirm>
  );
};

export default DeleteEntryOrgroup;
