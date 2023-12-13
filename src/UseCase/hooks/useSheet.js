import { useMemo } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";

import { addSheet as as, setUCTable as ac } from "../store/ucm";

import { _entr, _l } from "../utils/utils";

import useSettings from "./useSettings";

const useSheet = () => {
  const { sheets, contents } = useSelector(({ ucm }) => ucm);
  const { path } = useParams();
  const [sp, setSp] = useSearchParams();
  const active_sheet = sheets[path];
  const { settings } = useSettings();

  const dispatch = useDispatch();

  const sp_filter = useMemo(() => {
    const all_f = settings.uc_filter || [];
    const f = {};

    [...sp.keys()].map((sk) => {
      const vals = [...new Set([...sp.getAll(sk)])];
      if (
        ["uc_search", "view"].includes(sk) ||
        all_f.find((af) => af.key === sk)
      )
        f[sk] = vals;
    });
    return f;
  }, [sp, Boolean(settings.uc_filter)]);

  const sorted_columns = _entr(active_sheet?.columns || {}).sort(
    (a, b) => a[1].position - b[1].position
  );

  const removeSP = () => setSp({});
  const resetSP = (key, value) => {
    const _sp = { ...sp_filter };
    if (!value || value?.length === 0) {
      delete _sp[key];
      return setSp({ ..._sp });
    }
    setSp({ ..._sp, [key]: value });
  };

  const sheet_names = Object.values(sheets)
    .map(({ key, name, location }) => ({
      key,
      name,
      location,
    }))
    .sort((a, b) => a.location - b.location);

  const addSheet = (sheet) => dispatch(as(sheet));
  const setUCTable = (payload) => dispatch(ac(payload));

  return {
    sheets,
    contents,
    active_sheet,
    sheet_names,
    addSheet,
    removeSP,
    setUCTable,
    resetSP,
    sorted_columns,
    sp_filter,
  };
};

export default useSheet;
