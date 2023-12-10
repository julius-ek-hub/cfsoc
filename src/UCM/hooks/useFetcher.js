import useFetch from "../../common/hooks/useFetch";
import useToasts from "../../common/hooks/useToast";
import useSheet from "./useSheet";
import useSettings from "./useSettings";

import { _entr, _u, _l } from "../utils/utils";

const useFetcher = () => {
  const { get, post, dlete } = useFetch("/ucm");
  const { push } = useToasts();
  const { updateSettings, settings } = useSettings();
  const { setUCTable, sp_filter, sheets, addSheet } = useSheet();

  const fetcUC = async () => {
    const { json: sh } = await get(
      `/uc_table?uc_filter=${JSON.stringify(sp_filter)}`
    );

    if (!sh.error) setUCTable(sh);
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

  const fetchAllFromDB = async () => {
    const { json: filters } = await get("/filters", "all_mitre");

    !filters.error && updateSettings("uc_filter", filters);

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

  return {
    fetchAllFromDB,
    fetcUC,
    addUCFilter,
    removeUCFilter,
  };
};

export default useFetcher;
