import useSheet from "./useSheet";

import { field_separator, _l } from "../utils/utils";

const useFilter = () => {
  const { active_sheet, updateSheet, active_content } = useSheet();

  const { pagination, excluded_columns } = active_sheet;
  const { page = 0, rowsPerPage: rpp = 30 } = pagination;

  const filtered = () => {
    return active_content.filter((t) => {
      return Object.entries(t).every(([_key, _value]) => {
        const f = active_sheet.filters[_key];
        if (!f) return true;
        const v_f = f.map(_l);
        return v_f.includes(_l(_value.value));
      });
    });
  };

  const hideColumn = (column) => {
    updateSheet(`${active_sheet.key + field_separator}excluded_columns`, [
      ...active_sheet.excluded_columns,
      column,
    ]);
  };

  const unHideColumn = (column) => {
    updateSheet(
      `${active_sheet.key + field_separator}excluded_columns`,
      active_sheet.excluded_columns.filter((c) => c !== column)
    );
  };

  const has_filter = (column) =>
    (active_sheet.filters[column] || []).length > 0;

  const columns = () => {
    let widths = {};
    active_content.map((ac) => {
      const _keys = Object.keys(ac);
      _keys.map((key) => {
        const ok = widths[key];
        const nk = ac[key].value?.length;
        if (!ok) widths[key] = 0;
        if (nk > ok) widths[key] = nk;
      });
    });
    return { widths };
  };

  const paginated = () => {
    return rpp > 0
      ? filtered().slice(page * rpp, page * rpp + rpp)
      : filtered();
  };

  return {
    paginated,
    filtered,
    unfiltered: active_content,
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
