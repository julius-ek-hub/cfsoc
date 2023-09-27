import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import {
  addSheet as as,
  updateSheet as us,
  deleteSheet as ds,
} from "../store/ucm";

import { field_separator } from "../utils/utils";

const usePagination = () => {
  const { sheets } = useSelector(({ ucm }) => ucm);
  const { path } = useParams();

  const dispatch = useDispatch();

  const sheet_names = Object.values(sheets)
    .map(({ key, name, location }) => ({
      key,
      name,
      location,
    }))
    .sort((a, b) => a.location - b.location);

  const active_sheet = sheets[path];

  const sheet_names_except_current =
    sheet_names.filter((s) => s.key != active_sheet?.key) || [];

  const active_content = active_sheet?.content || [];

  const activ_columns = () => {
    let columns = [];
    let widths = {};
    active_content.map((ac) => {
      const _keys = Object.keys(ac);
      if (_keys.length > columns.length) columns = _keys;
      _keys.map((key) => {
        const ok = widths[key];
        const nk = ac[key].length;
        if (!ok) widths[key] = 0;
        if (nk > ok) widths[key] = nk;
      });
    });
    return { columns, widths };
  };

  const updateSheet = (key, value) => dispatch(us({ key, value }));
  const deleteSheet = (key) => dispatch(ds({ key }));
  const addSheet = (sheet) => dispatch(as(sheet));

  const hideColumn = (column) => {
    updateSheet(`${active_sheet.key + field_separator}excluded_columns`, [
      ...active_sheet.excluded_columns,
      column,
    ]);
  };
  const unHideColumn = (column) => {
    updateSheet(
      `${active_sheet.key + field_separator}excluded_columns`,
      active_sheet.excluded_columns.filter((ec) => ec !== column)
    );
  };

  return {
    sheets,
    active_sheet,
    active_content,
    sheet_names,
    sheet_names_except_current,
    activ_columns,
    addSheet,
    hideColumn,
    unHideColumn,
    updateSheet,
    deleteSheet,
  };
};

export default usePagination;
