import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";

import {
  addSheet as as,
  updateSheet as us,
  deleteSheet as ds,
} from "../store/expo-sentinel";

import {
  _entr,
  _keys,
  _l,
  all_permissions,
  field_separator as fs,
  objectExcept,
} from "../utils/utils";

import useToasts from "../../common/hooks/useToast";
import useCommonSettings from "../../common/hooks/useSettings";

const useSheet = () => {
  const { sheets } = useSelector(({ expo_sentinel }) => expo_sentinel);
  const { path } = useParams();
  const { push } = useToasts();
  const dispatch = useDispatch();
  const { uname } = useCommonSettings();
  const [sp, setSp] = useSearchParams();

  const sp_filter = [...new Set([...sp.getAll("q")])].filter((v) => v);

  const removeSP = () => setSp({});

  const active_sheet = sheets[path];

  const sorted_columns = _entr(active_sheet?.columns || {}).sort(
    (a, b) => a[1].position - b[1].position
  );

  const sheet_names = Object.values(sheets)
    .map((sn) => objectExcept(sn, ["content"]))
    .sort((a, b) => a.location - b.location);

  const primary_field = (_entr((active_sheet || {}).columns || {}).find(
    ([k, v]) => v.unique
  ) || [])[0];

  const sheet_names_except_current =
    sheet_names.filter((s) => s.key != active_sheet?.key) || [];

  const is_creator = active_sheet?.creator === uname || uname === "system";

  const permission = is_creator
    ? _keys(all_permissions)
    : ((active_sheet || {}).permissions || {})[uname] || [];

  const filterBySP = (content) => {
    if (sp_filter.length === 0) return content;
    return content.filter((c) =>
      sp_filter.some((spv) =>
        _entr(c).some((_c) => new RegExp(spv, "i").test(_c[1].value))
      )
    );
  };

  const updateSheet = (key, value) => dispatch(us({ key, value }));
  const deleteSheet = (key) => dispatch(ds({ key }));
  const addSheet = (sheet) => dispatch(as(sheet));

  const updateSheetWithDataFromDb = (json, key, update = true) => {
    const pushes = [];
    let _return;
    if (!json.error) {
      if (Object.keys(sheets[key].columns).length === 0) {
        updateSheet(`${key + fs}columns`, json.new_columns);
      }

      if (json.warnings && json.warnings.length > 0)
        pushes.push({
          message: json.warnings.join(", "),
          severity: "warning",
        });

      update &&
        updateSheet(`${key + fs}content`, [
          ...sheets[key].content,
          ...json.data,
        ]);

      pushes.push({
        message: `Added ${
          typeof json.length === "number" ? json.length : 1
        } new ${sheets[key].name}`,
        severity: "success",
      });
      _return = true;
    } else {
      push({
        message: json.error,
        severity: "error",
      });
      _return = false;
    }
    pushes.length > 0 && push(pushes);
    return _return;
  };

  return {
    sheets,
    sp_filter,
    active_sheet,
    primary_field,
    permission,
    is_creator,
    active_content: filterBySP(active_sheet?.content || []),
    sheet_names,
    sheet_names_except_current,
    updateSheetWithDataFromDb,
    removeSP,
    addSheet,
    updateSheet,
    deleteSheet,
    sorted_columns,
  };
};

export default useSheet;
