import { useDispatch, useSelector } from "react-redux";

import { addDB as ad, updateDB as ud } from "../store/kp";
import { deepKey } from "../../common/utils/utils";

const useKeepass = () => {
  const { dbs, settings } = useSelector(({ keepass }) => keepass);

  const dispatch = useDispatch();

  const addDB = (db) => dispatch(ad(db));
  const updateDB = (key, value) => dispatch(ud({ key, value }));

  const selectedDB = dbs.find((db) => db.name === settings.selected_dbname);

  const gid = settings.selected_gp_index;

  const selectedGP = gid ? deepKey(gid, dbs) : undefined;

  const exists = (dbname) => dbs.find((db) => db.name === dbname);

  return {
    addDB,
    updateDB,
    exists,
    dbs,
    selectedDB,
    selectedGP,
  };
};

export default useKeepass;
