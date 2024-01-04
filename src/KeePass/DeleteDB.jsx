import Confirm from "../common/utils/Comfirm";
import useFetcher from "./hooks/useFetcher";

const DeleteDB = ({ Initiator, db }) => {
  const { deleteDB } = useFetcher();
  return (
    <Confirm
      onConfirm={() => {
        deleteDB(db);
      }}
      ok_color="error"
      ok_text="Delete"
      Initiator={Initiator}
    >
      This database will be lost forever
    </Confirm>
  );
};

export default DeleteDB;
