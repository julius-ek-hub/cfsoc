import useFetch from "../../common/hooks/useFetch";
import useSheet from "./useSheet";

import { _entr, entr_, field_separator as fs, fix_data } from "../utils/utils";

import useToasts from "../../common/hooks/useToast";

const useAddModify = () => {
  const {
    active_content,
    updateSheet,
    active_sheet,
    primary_field,
    sheets,
    updateSheetWithDataFromDb,
  } = useSheet();
  const { dlete, patch, post } = useFetch("/expo-sentinel");

  const { push } = useToasts();

  const { selected, key, columns, name } = active_sheet;

  const cols = _entr(columns)
    .filter((c) => !c[1].calculate)
    .sort((a, b) => a[1].position - b[1].position);

  const _delete = async () => {
    let failed = [],
      error,
      del = 0;

    await Promise.all(
      selected.map(async (sel) => {
        const { json } = await dlete(`/data?sheet=${key}&_id=${sel}`);
        if (json.error) {
          error = json.error;
          failed.push(sel);
        } else del++;
      })
    );

    const deletedKeys = [...selected.filter((s) => !failed.includes(s))];
    const $new = sheets[key].content.filter(
      (ac) => !deletedKeys.includes(ac._id.value)
    );

    updateSheet(`${key + fs}content`, $new);
    updateSheet(
      `${key + fs}num_rows`,
      sheets[key].num_rows - deletedKeys.length
    );

    updateSheet(`${key + fs}selected`, []);

    if (error)
      push({
        message: `Failed to delete ${failed.length} ${name}, Error: ${error}`,
        severity: "error",
      });
    else
      push({
        message: `Deleted ${del} row${del > 1 ? "s" : ""}`,
        severity: "success",
      });
  };

  const for_edit_index = (_id) => {
    return active_content.findIndex((ac) => ac._id.value === _id);
  };

  const save = async (
    data,
    edit,
    onDone,
    should_include_primary_key = true
  ) => {
    if (!edit && active_content.length >= 5000)
      return push({
        message: `Maximum of 5000 rows allowed per sheet`,
        severity: "error",
      });

    if (Array.isArray(data)) {
      let error = 0;
      const jsons = await Promise.all(
        data.map(async (d) => {
          const { json } = await post(`/data?sheet=${key}`, fix_data(d));
          if (json.error) error++;
          return json;
        })
      );
      const noerrjson = jsons
        .filter((json) => !json.error)
        .map((json) => json.data)
        .flat();

      updateSheet(`${key + fs}content`, [...sheets[key].content, ...noerrjson]);

      const lenjs = noerrjson.length;

      if (error > 0)
        push({
          message: `Failed to add ${error} blanc row${
            error > 1 ? "s" : ""
          } to ${name}`,
          severity: "error",
        });
      else
        push({
          message: `Added ${lenjs} blanc row${lenjs > 1 ? "s" : ""} to ${name}`,
          severity: "success",
        });
      return onDone?.call();
    }

    const _data = fix_data(data);

    if (edit) {
      const { json } = await patch(`/data?sheet=${key}`, {
        _id: edit,
        update: _data,
      });

      if (!json.error) {
        updateSheet(`${key + fs}content${fs + for_edit_index(edit)}`, {
          ..._data,
          _id: { value: edit },
        });
        updateSheet(
          `${key + fs}selected`,
          selected.filter((s) => s !== edit)
        );
      }
      return onDone?.call();
    }

    const { json } = await post(
      `/data?sheet=${
        key +
        (should_include_primary_key ? `&unique_key=${primary_field || ""}` : "")
      }`,
      _data
    );

    updateSheetWithDataFromDb(json, key);
    return onDone?.call();
  };

  const for_edit = (_id) => active_content[for_edit_index(_id)] || {};

  return {
    _delete,
    save,
    for_edit,
    cols,
  };
};
export default useAddModify;
