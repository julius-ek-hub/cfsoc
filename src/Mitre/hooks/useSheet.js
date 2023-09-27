import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";

import {
  addSheet as as,
  updateSheet as us,
  deleteSheet as ds,
} from "../store/ucm";

import { _l, field_separator as fs } from "../utils/utils";

import useToasts from "../../common/hooks/useToast";
import useCalculator from "./useCalculator";

const useSheet = () => {
  const { sheets } = useSelector(({ ucm }) => ucm);
  const { path } = useParams();
  const [sp, setSp] = useSearchParams();
  const active_sheet = sheets[path];
  const important_sheets = ["l4_uc", "l3_uc", "l2_uc", "l1_uc"];

  const sp_filter = {};

  [...sp.keys()].map((sk) => {
    const vals = [...new Set([...sp.getAll(sk)])].filter((v) => v);
    if (active_sheet && vals.length > 0 && active_sheet.columns[sk])
      sp_filter[sk] = vals;
  });

  const has_sp_filter = Object.entries(sp_filter).length > 0;

  const removeSP = () => setSp({});

  const { push } = useToasts();
  const calculte = useCalculator(sheets);

  const dispatch = useDispatch();

  const sheet_names = Object.values(sheets)
    .map(({ key, name, location }) => ({
      key,
      name,
      location,
    }))
    .sort((a, b) => a.location - b.location);

  const primary_field = (Object.entries(
    (active_sheet || {}).columns || {}
  ).find(([k, v]) => v.unique) || [])[0];

  const sheet_names_except_current =
    sheet_names.filter((s) => s.key != active_sheet?.key) || [];

  const filterBySP = (content, key) => {
    if (!has_sp_filter) return content;
    return content.filter((c) =>
      Object.entries(sp_filter).every(([spk, spv]) => {
        let target = c[spk].value;
        if (key === "l2_uc") target = _l(target).split(" ").join("-");
        return spv.some((_spv) => new RegExp(_spv, "i").test(target));
      })
    );
  };

  const active_content_with_calculations = (key = active_sheet?.key) => {
    if (!key || !sheets[key]) return [];
    const { columns, content } = sheets[key];
    if (!important_sheets.includes(key)) return content;

    const unique_key = (Object.entries(columns).find((c) => c[1].unique) ||
      [])[0];

    let cd = Object.entries(calculte(key));

    return filterBySP(
      content.map((doc) => {
        return {
          ...doc,
          ...(unique_key &&
            Object.fromEntries(
              cd.map(([k, v]) => [k, { value: v[doc[unique_key].value] || "" }])
            )),
        };
      }),
      key
    );
  };

  const updateSheet = (key, value) => dispatch(us({ key, value }));
  const deleteSheet = (key) => dispatch(ds({ key }));
  const addSheet = (sheet) => dispatch(as(sheet));

  const updateSheetWithDataFromDb = (json, key) => {
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

      updateSheet(`${key + fs}content`, [...sheets[key].content, ...json.data]);

      pushes.push({
        message: `Added ${json.data.length} new ${name}`,
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
    active_sheet,
    primary_field,
    active_content: active_sheet?.content || [],
    sheet_names,
    sheet_names_except_current,
    updateSheetWithDataFromDb,
    active_content_with_calculations,
    important_sheets,
    addSheet,
    updateSheet,
    deleteSheet,
    removeSP,
    sp_filter: has_sp_filter ? sp_filter : null,
  };
};

export default useSheet;
