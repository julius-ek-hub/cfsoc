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

  const { selected, key, columns, name } = active_sheet;

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
        ["name", "description"].includes(k)
          ? required(v.label)
          : k === "identifier"
          ? Yup.string()
              .matches(/TA[0-9]+/i)
              .required()
              .label(v.label)
          : Yup.string().label(v.label),
      ])
    )
  );

  const l3_uc_schema = Yup.object(
    Object.fromEntries(
      cols.map(([k, v]) => [
        k,
        ["scope", "comments"].includes(k)
          ? Yup.string().label(v.label)
          : ["coverage", "effectiveness"].includes(k)
          ? Yup.number().min(0).max(100).label(v.label)
          : k === "l2_uc_identifiers"
          ? Yup.array().min(1, "Atleast 1 tactic is required")
          : k === "identifier"
          ? Yup.string()
              .matches(/T[0-9]+/i)
              .required()
              .label(v.label)
          : required(v.label),
      ])
    )
  );

  const l4_uc_schema = Yup.object(
    Object.fromEntries(
      cols.map(([k, v]) => [
        k,
        ["scope", "comments"].includes(k)
          ? Yup.string().label(v.label)
          : ["coverage", "effectiveness"].includes(k)
          ? Yup.number().min(0).max(100).label(v.label)
          : k === "l3_uc_identifier"
          ? Yup.object().required().label(v.label)
          : k === "identifier"
          ? Yup.string()
              .matches(/T[0-9]+\.[0-9]+/i)
              .required()
              .label(v.label)
          : required(v.label),
      ])
    )
  );

  const car_schema = Yup.object(
    Object.fromEntries(
      cols.map(([k, v]) => [
        k,
        k === "identifier"
          ? Yup.string()
              .matches(/CAR-[0-9]+-[0-9]+-[0-9]+/i)
              .required()
              .label(v.label)
          : k === "implementations"
          ? Yup.string().label(v.label)
          : k === "application_platforms"
          ? Yup.array().label(v.label)
          : Yup.string().required().label(v.label),
      ])
    )
  );

  const uc_db_schema = Yup.object(
    Object.fromEntries(
      cols.map(([k, v]) => [
        k,
        k === "use_case"
          ? Yup.string().required().label(v.label)
          : k === "l1_uc_identifiers"
          ? Yup.array().min(1).label(v.label)
          : Yup.string(),
      ])
    )
  );

  const dev_uc_schema = Yup.object(
    Object.fromEntries(
      cols.map(([k, v]) => [
        k,
        k === "l3_uc_identifier"
          ? Yup.object().label(v.label).required()
          : k === "l4_uc_identifier"
          ? Yup.object().label(v.label)
          : Yup.array().min(1).label(v.label),
      ])
    )
  );

  const _delete = async () => {
    let failed = [],
      error,
      del = 0;

    await Promise.allSettled(
      selected.map(async (sel) => {
        const { json } = await dlete(`/data?sheet=${key}&_id=` + sel);
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

    updateSettings("deleted", key);

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
    const _data = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        typeof value === "object" && value.hasOwnProperty("value")
          ? value
          : { value },
      ])
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
      `/data?sheet=${
        key +
        (should_include_primary_key ? `&unique_key=${primary_field || ""}` : "")
      }`,
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
    car_schema,
    uc_db_schema,
    dev_uc_schema,
    l4_uc_schema,
    l1_uc_schema,
    l2_uc_schema,
    l3_uc_schema,
    cols,
    active_content,
  };
};
export default useAddModify;
