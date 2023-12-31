import useFetch from "../../common/hooks/useFetch";
import useSheet from "./useSheet";

import * as Yup from "yup";

import { fix_data } from "../utils/utils";
import { _entr, entr_ } from "../../common/utils/utils";

import useSettings from "./useSettings";
import useToasts from "../../common/hooks/useToast";
import useFetcher from "./useFetcher";

const useAddModify = () => {
  const { contents, sheets } = useSheet();
  const { dlete, patch, post } = useFetch("/ucm");
  const { fetcUC } = useFetcher();

  const active_content = contents.all_uc;

  const { settings } = useSettings();

  const { push } = useToasts();

  const { columns } = sheets.all_uc;

  const cols = _entr(columns)
    .sort((a, b) => a[1].position - b[1].position)
    .filter(
      (c) =>
        !["l1_uc_names", "l2_uc_names", "l3_uc_names", "l4_uc_names"].includes(
          c[0]
        )
    );

  const all_uc_schema = Yup.object(
    Object.fromEntries(
      cols.map(([k, v]) => [
        k,
        [
          "l1_uc_identifiers",
          "l2_uc_identifiers",
          "l3_uc_identifiers",
          "l4_uc_identifiers",
        ].includes(k)
          ? Yup.array().label(v.label)
          : ["source", "technology", "customer"].includes(k)
          ? Yup.object({ id: Yup.number(), name: Yup.string() })
          : k === "url"
          ? Yup.string().url().default("")
          : k === "description"
          ? Yup.string().label(v.label)
          : Yup.string().required().label(v.label),
      ])
    )
  );

  const _delete = async (selected, onDone) => {
    let failed = [],
      error,
      del = 0;

    await Promise.allSettled(
      selected.map(async (sel) => {
        const { json } = await dlete(`/data?sheet=all_uc&_id=${sel}`);
        if (json.error) {
          error = json.error;
          failed.push(sel);
        } else del++;
      })
    );

    if (error)
      push({
        message: `Failed to delete ${failed.length} use case${
          failed.length === 1 ? "" : "s"
        }, Error: ${error}`,
        severity: "error",
      });
    else {
      await fetcUC();
      push({
        message: `Deleted ${del} use case${del > 1 ? "s" : ""}`,
        severity: "success",
      });
    }
    onDone?.call();
  };

  const for_edit_index = (_id) =>
    active_content.findIndex((ac) => ac._id.value === _id);

  const save = async (data, edit, onDone) => {
    const _data = fix_data(data);
    if (edit) {
      const { json } = await patch(`/data?sheet=all_uc`, {
        _id: edit,
        update: _data,
      });

      if (json.error)
        push({
          message: json.error,
          severity: "error",
        });
      else {
        await fetcUC();
        push({ message: `Done`, severity: "success" });
        return onDone();
      }
    } else {
      const { json } = await post(`/data?sheet=all_uc`, _data);

      if (json.error)
        push({
          message: json.error,
          severity: "error",
        });
      else {
        await fetcUC();
        push({ message: `Done`, severity: "success" });
        return onDone();
      }
    }
  };
  const paste = async (selected, copied = {}, onPaste) => {
    if (selected.length === 0 || _entr(copied).length === 0) return;
    const fixed = fix_data(copied);

    const done = await Promise.allSettled(
      selected.map(async (sel) => {
        const { json } = await patch(`/data?sheet=all_uc`, {
          _id: sel,
          update: fixed,
        });
        return json;
      })
    );

    const errLen = done.filter(
      (d) => d.status !== "fulfilled" || d.value?.error
    ).length;

    await fetcUC();
    if (errLen > 0)
      push({
        message: `Failed to paste on ${errLen} row${errLen === 1 ? "" : "s"}`,
        severity: "error",
      });
    else push({ message: `Done`, severity: "success" });
    onPaste?.call();
  };

  const for_edit = (_id) => active_content[for_edit_index(_id)] || {};

  return {
    _delete,
    save,
    for_edit,
    paste,
    all_uc_schema,
    cols,
    otherfields: entr_(
      (settings.uc_filter || []).map((f) => [
        f.key,
        f.options.map((name, id) => ({ id: id + 1, name })),
      ])
    ),
    active_content,
  };
};
export default useAddModify;
