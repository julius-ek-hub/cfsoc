import useSheet from "./useSheet";

import { field_separator, _l } from "../utils/utils";
import useSettings from "./useSettings";

const useFilter = (calculated) => {
  const {
    active_sheet,
    updateSheet,
    active_content,
    active_content_with_calculations: acwc,
  } = useSheet();
  const { updateSettings } = useSettings();

  const { pagination, excluded_columns } = active_sheet;
  const { page = 0, rowsPerPage: rpp = 30 } = pagination;

  const unfiltered = () => (calculated ? acwc() : active_content);
  const filtered = () =>
    unfiltered().filter((t) => {
      return Object.entries(t).every(([_key, _value]) => {
        const f = active_sheet.filters[_key];
        if (!f) return true;
        const v_f = f.map(_l);
        return v_f.includes(_l(_value.value));
      });
    });

  const hideColumn = (column) => {
    updateSheet(`${active_sheet.key + field_separator}excluded_columns`, [
      ...active_sheet.excluded_columns,
      column,
    ]);
    updateSettings("changed", true);
  };

  const unHideColumn = (column) => {
    updateSheet(
      `${active_sheet.key + field_separator}excluded_columns`,
      active_sheet.excluded_columns.filter((c) => c !== column)
    );
    updateSettings("changed", true);
  };

  const has_filter = (column) =>
    (active_sheet.filters[column] || []).length > 0;

  const columns = () => {
    const _ac = unfiltered();
    let _columns = [];
    let widths = {};
    let oneObject = _ac[0];

    _ac.map((ac) => {
      const _keys = Object.keys(ac);
      if (_keys.length > _columns.length) {
        _columns = _keys;
        oneObject = ac;
      }

      _keys.map((key) => {
        const ok = widths[key];
        const nk = ac[key].value.length;
        if (!ok) widths[key] = 0;
        if (nk > ok) widths[key] = nk;
      });
    });
    return { _columns, widths, oneObject };
  };

  const paginated = () =>
    rpp > 0 ? filtered().slice(page * rpp, page * rpp + rpp) : filtered();

  return {
    paginated,
    filtered,
    unfiltered,
    rowsPerPage: rpp,
    excluded_columns: excluded_columns,
    page,
    has_filter,
    columns,
    hideColumn,
    unHideColumn,
  };
};

export default useFilter;
