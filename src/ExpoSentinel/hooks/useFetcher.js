import useLoading from "../../common/hooks/useLoading";

import useSheet from "./useSheet";
import useSettings from "./useSettings";
import useFile from "../../common/hooks/useFile";
import useToasts from "../../common/hooks/useToast";
import useFetch from "../../common/hooks/useFetch";
import useCommonSettings from "../../common/hooks/useSettings";

import { field_separator as fs, _entr, _u, _l } from "../utils/utils";

const useFetcher = () => {
  const { update } = useLoading();
  const { get, post, serverURL, patch } = useFetch("/expo-sentinel");
  const { push } = useToasts();
  const { updateSettings } = useSettings();
  const { uname } = useCommonSettings();
  const {
    active_sheet,
    updateSheet,
    sheets,
    sheets_by,
    replaceSheet,
    updateSheetWithDataFromDb,
  } = useSheet();

  const { key } = active_sheet || {};

  const { pickFile } = useFile();

  const saveChanges = async () => {
    const changes = _entr(sheets).map(([k, v]) => [
      k,
      {
        location: v.location,
        excluded_columns: v.excluded_columns,
        pagination: v.pagination,
        columns: v.columns,
      },
    ]);
    const { json } = await patch(`/update-structure`, changes);
    if (!json.error) updateSettings("changed", false);
  };

  const fetchSheetContent = async (_key = key, force, page) => {
    if (!_key || !sheets[_key]) return;
    if (sheets[_key].content.length > 0 && !force) return;

    const { json: sh } = await get(
      `/data?sheet=${_key + (page ? `&page=${page}` : "")}`,
      "all_mitre"
    );

    if (!sh.error) updateSheet(`${_key + fs}content`, sh);
  };

  const extractFromFile = async (columns, unique_key) => {
    const type = ".xlsx,.csv,.json";
    const [file] = await pickFile(type);
    let sheet_index = "0";

    if (file.type !== "application/json")
      sheet_index = prompt(
        "What is the zero-based index of the worksheet you want to extract? ",
        0
      );
    if (!sheet_index) return;
    const data = new FormData();
    data.append("extract", file);
    data.append("columns", JSON.stringify(columns));
    data.append("sheet", key);
    data.append("sheet_index", sheet_index);
    data.append("unique_key", unique_key || "");
    const { json } = await post(`/extract`, data, "all_mitre", true);
    const _update = updateSheetWithDataFromDb(json, key, false);
    if (!_update) return false;
    await fetchSheetContent(key, true, json.length >= 5000 ? 1 : undefined);
    return true;
  };

  const fetchAllFromDB = async (__key) => {
    if (uname) {
      const { json: sh } = await get(
        `/sheets?staff=${uname}&by=${JSON.stringify(sheets_by)}`,
        "all_mitre"
      );
      if (!sh.error)
        replaceSheet(
          sh.map((sheet) => ({
            ...sheet,
            content: sheets[sheet.key]?.content || [],
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
    if (!active_sheet) return;

    if (sheets[__key || key].content.length === 0)
      return fetchSheetContent(
        active_sheet.key,
        false,
        active_sheet.num_rows > 1000 ? 1 : undefined
      );
  };

  const downloadData = async (format) => {
    const payload = [key].map((_sheet) => ({
      sheet: _sheet,
      columns: sheets[_sheet].columns,
      data: sheets[_sheet].content,
      name: sheets[_sheet].name,
      excluded_columns: sheets[_sheet].excluded_columns || [],
    }));
    try {
      update(true);
      const endpoint = "/expo-sentinel/download";
      const f = await fetch(serverURL(endpoint), {
        body: JSON.stringify({ payload, format }),
        method: "post",
        headers: { "Content-Type": "application/json" },
      });

      const blob = await f.blob();

      const filename = `Expo Sentinel.${format === "json" ? "json" : "xlsx"}`;
      const download_url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = download_url;
      anchor.download = filename;
      anchor.hidden = true;
      document.body.appendChild(anchor);
      anchor.click();
      window.URL.revokeObjectURL(download_url);
      document.body.removeChild(anchor);
      push({ message: `${filename} downloaded`, severity: "success" });
    } catch (error) {
      push({ message: "Download failed", severity: "error" });
      console.log(error);
    } finally {
      update(false);
    }
  };

  return {
    fetchAllFromDB,
    downloadData,
    saveChanges,
    fetchSheetContent,
    extractFromFile,
  };
};

export default useFetcher;
