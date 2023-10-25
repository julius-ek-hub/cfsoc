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
    hideColumn,
    unHideColumn,
  };
};

export default useFilter;
