import useLoading from "../../common/hooks/useLoading";

import useFetch from "../../common/hooks/useFetch";
import useToasts from "../../common/hooks/useToast";
import useSheet from "./useSheet";
import useFile from "../../common/hooks/useFile";
import useSettings from "./useSettings";

import {
  field_separator as fs,
  fixNode,
  arr,
  fetchDoc,
  getTechniqueObject,
  _entr,
  objectExcept,
  getCarAnalyticsObject,
  _u,
  _l,
} from "../utils/utils";

const useFetcher = () => {
  const { update } = useLoading();
  const { get, post, serverURL, patch } = useFetch("/ucm");
  const { push } = useToasts();
  const { updateSettings, settings } = useSettings();
  const {
    active_sheet,
    updateSheet,
    sheets,
    addSheet,
    updateSheetWithDataFromDb,
    active_content_with_calculations,
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

  const lockUnlock = async () => {
    const $new = !Boolean(active_sheet.locked);
    const { json } = await patch(`/update-structure`, [
      [key, { locked: $new }],
    ]);
    if (!json.error) updateSheet(`${key + fs}locked`, $new);
  };

  const fetchSheetContent = async (_key = key, force, page) => {
    if (!_key || !sheets[_key]) return;
    if (sheets[_key].content.length > 0 && !settings.deleted && !force) return;

    const { json: sh } = await get(
      `/data?sheet=${_key + (page ? `&page=${page}` : "")}`,
      settings.deleted ? false : "all_mitre"
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
    await fetchSheetContent(key, true, json.length > 1000 ? 1 : undefined);
    return true;
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
    if (!active_sheet) return;

    return fetchSheetContent(
      active_sheet.key,
      false,
      active_sheet.num_rows > 1000 ? 1 : undefined
    );
  };

  const updateWithMitreData = async () => {
    update(true, "all_mitre");
    const _techniques = [];
    const doc = await fetchDoc(
      "/tactics/enterprise/",
      "table tbody tr",
      serverURL
    );

    const car_doc = await fetchDoc(
      "/analytics/",
      "table tbody tr",
      serverURL,
      "car.mitre.org"
    );

    const l2_uc = doc.map((tr) => {
      const ch = arr(tr.children).map((td) => fixNode(td));
      const identifier = ch[0];
      return {
        identifier,
        name: ch[1],
        description: ch[2],
        business_drivers: "",
        internal_policy: "",
        external_regulator_1: "",
        external_regulator_2: "",
      };
    });

    const car_uc = car_doc.map((tr) => {
      const ch = arr(tr.children).map((td) => fixNode(td));
      const identifier = ch[0];
      return {
        identifier,
        name: ch[1],
        submission_date: ch[2],
        implementations: ch[4],
        application_platforms: ch[5]
          .trim()
          .split(",")
          .filter((p) => _l(p) !== "n/a")
          .map((a) => a.trim()),
      };
    });

    const dev_uc = await getCarAnalyticsObject(serverURL);

    let l3_uc = [];
    let l4_uc = [];

    await Promise.all(
      l2_uc.map(async ({ identifier }) => {
        const tecs = await getTechniqueObject(identifier, serverURL);
        _techniques.push(tecs);
      })
    );

    _techniques.flat().map((tec) => {
      const sub = tec.identifier.split(".").length === 2;
      if (sub) {
        const ex = l4_uc.findIndex((l4) => l4.identifier == tec.identifier);
        if (ex !== -1) l4_uc[ex].l2_uc_identifiers.push(tec.l2_uc_identifier);
        else {
          l4_uc.push({ ...tec, l2_uc_identifiers: [tec.l2_uc_identifier] });
        }
      } else {
        const ex = l3_uc.findIndex((l3) => l3.identifier == tec.identifier);
        if (ex !== -1) l3_uc[ex].l2_uc_identifiers.push(tec.l2_uc_identifier);
        else {
          l3_uc.push({ ...tec, l2_uc_identifiers: [tec.l2_uc_identifier] });
        }
      }
    });

    l4_uc = l4_uc.map((l4) =>
      objectExcept({ ...l4, l3_uc_identifier: l4.identifier.split(".")[0] }, [
        "l2_uc_identifier",
      ])
    );

    l3_uc = l3_uc.map((l4) => objectExcept(l4, ["l2_uc_identifier"]));

    await post("/override", {
      l2_uc,
      car_uc,
      dev_uc,
      l3_uc,
      l4_uc,
    });

    window.location.reload();
  };

  const downloadData = async (format, _sheets) => {
    await Promise.all(_sheets.map(fetchSheetContent));
    const payload = _sheets.map((_sheet) => ({
      sheet: _sheet,
      columns: sheets[_sheet].columns,
      data: active_content_with_calculations(_sheet),
      name: sheets[_sheet].name,
      excluded_columns: sheets[_sheet].excluded_columns || [],
    }));
    try {
      update(true);
      const endpoint = "/ucm/download";
      const f = await fetch(serverURL(endpoint), {
        body: JSON.stringify({ payload, format }),
        method: "post",
        headers: { "Content-Type": "application/json" },
      });

      const blob = await f.blob();

      const filename = `CFSOC UC Management.${
        format === "json" ? "json" : "xlsx"
      }`;
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
    updateWithMitreData,
    fetchAllFromDB,
    downloadData,
    saveChanges,
    fetchSheetContent,
    extractFromFile,
    lockUnlock,
  };
};

export default useFetcher;
