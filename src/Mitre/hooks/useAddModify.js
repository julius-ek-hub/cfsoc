import useFetch from "../../common/hooks/useFetch";
import useSheet from "./useSheet";

import * as Yup from "yup";

import { field_separator as fs } from "../utils/utils";
import useSettings from "./useSettings";
import useToasts from "../../common/hooks/useToast";

const required = (name, inst = Yup.string()) => {
  return inst.required(`${name} is required.`);
};

const useAddModify = () => {
  const {
    active_content,
    updateSheet,
    active_sheet,
    primary_field,
    sheets,
    updateSheetWithDataFromDb,
  } = useSheet();
  const { dlete, patch, post } = useFetch("/ucm");

  const { updateSettings } = useSettings();

  const { push } = useToasts();

  const { selected, key, columns } = active_sheet;

  const cols = Object.entries(columns)
    .filter((c) => !c[1].calculate)
    .sort((a, b) => a[1].position - b[1].position);

  const l1_uc_schema = Yup.object(
    Object.fromEntries(
      cols.map(([k, v]) => [
        k,
        required(
          v.label,
          k === "l2_uc_identifiers"
            ? Yup.array().min(1, "Atleast 1 tactic is required")
            : undefined
        ),
      ])
    )
  );

  const l2_uc_schema = Yup.object(
    Object.fromEntries(
      cols.map(([k, v]) => [
        k,
        ["identifier", "name", "description", "mitre_url"].includes(k)
          ? required(v.label)
          : Yup.string().label(v.label),
      ])
    )
  );

  const _delete = async () => {
    let failed = 0,
      error,
      del = 0;

    await Promise.allSettled(
      selected.map(async (sel) => {
        const { json } = await dlete(`/data?sheet=${key}&_id=` + sel);
        if (json.error) {
          error = json.error;
          failed++;
        } else del++;
      })
    );

    updateSheet(
      `${key + fs}content`,
      sheets[key].content.filter((ac) => !selected.includes(ac._id.value))
    );

    updateSettings("deleted", key);

    updateSheet(`${key + fs}selected`, []);

    if (error)
      push({
        message: `Failed to delete ${failed} rows, Error: ${error}`,
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

  const save = async (data, edit, onDone) => {
    const _data = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, { value }])
    );

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
      }
      return onDone();
    }

    const { json } = await post(
      `/data?sheet=${key}&unique_key=${primary_field || ""}`,
      _data
    );

    updateSheetWithDataFromDb(json, key);

    onDone();
  };

  const for_edit = (_id) => active_content[for_edit_index(_id)] || {};

  return {
    _delete,
    save,
    for_edit,
    l1_uc_schema,
    l2_uc_schema,
    cols,
    active_content,
  };
};
export default useAddModify;
