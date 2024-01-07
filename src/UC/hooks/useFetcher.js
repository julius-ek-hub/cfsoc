import useFetch from "../../common/hooks/useFetch";
import useToasts from "../../common/hooks/useToast";
import useSheet from "./useSheet";
import useSettings from "./useSettings";

import { _entr, _u, _l } from "../../common/utils/utils";

const useFetcher = () => {
  const { get, post, dlete, serverURL } = useFetch("/ucm");
  const { push } = useToasts();
  const { updateSettings, settings } = useSettings();
  const { setUCTable, sp_filter, sheets, addSheet } = useSheet();

  const fetcUC = async () => {
    const { json } = await get(
      `/uc_table?uc_filter=${JSON.stringify(sp_filter)}`
    );

    if (!json.error) setUCTable(json);
    else push({ message: json.error, severity: "error" });
  };

  const addUCFilter = async (body, cb) => {
    const { json } = await post("/filters", body);
    if (json.error) return push({ message: json.error, severity: "error" });
    const ucf = [...(settings.uc_filter || [])];
    const ind = ucf.findIndex((f) => f.key === body.key);
    const target = { ...ucf[ind] };
    target.options = [...target.options, body.value];
    ucf[ind] = target;
    updateSettings("uc_filter", ucf);
    push({ message: "Done", severity: "success" });
    cb?.call();
  };

  const removeUCFilter = async (body, cb) => {
    const { json } = await dlete(
      `/filters?key=${body.key}&value=${body.value}`
    );
    if (json.error) return push({ message: json.error, severity: "error" });
    const ucf = [...(settings.uc_filter || [])];
    const ind = ucf.findIndex((f) => f.key === body.key);
    const target = { ...ucf[ind] };
    target.options = target.options.filter((o) => o !== body.value);
    ucf[ind] = target;
    updateSettings("uc_filter", ucf);
    push({ message: "Done", severity: "success" });
    cb?.call();
  };

  const fetchFilters = async () => {
    const { json: filters } = await get("/filters", "all_mitre");

    !filters.error && updateSettings("uc_filter", filters);
  };

  const fetchAllFromDB = async () => {
    if (Object.keys(sheets).length === 0) {
      const { json: sh } = await get("/sheets", "all_mitre");

      if (!sh.error)
        addSheet(
          sh.map((sheet) => ({
            ...sheet,
            content: [],
            pagination: sheet.pagination || [],
            filters: sheet.filters || [],
            excluded_columns: sheet.excluded_columns || [],
            selected: [],
          }))
        );
      else {
        push({ message: sh.error, severity: "error" });
        updateSettings("error", sh);
      }
    }
  };

  const downloadUC = async (rows, name = "Use_Cases") => {
    const resp = await fetch(serverURL(`/ucm/download`), {
      method: "POST",
      body: JSON.stringify({ rows, columns: sheets.all_uc.columns }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const blob = await resp.blob();
    const d = new Date();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `${
      name.split(" ").join("_") +
      "_Use_Cases_" +
      [(d.getMonth() + 1).toString(), d.getDate().toString()]
        .map((i) => (i.length === 1 ? 0 + i : i))
        .join("_")
    }.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return {
    fetchAllFromDB,
    downloadUC,
    fetcUC,
    addUCFilter,
    fetchFilters,
    removeUCFilter,
  };
};

export default useFetcher;
