import useFetch from "../../common/hooks/useFetch";
import useFile from "../../common/hooks/useFile";
import useLocalStorage from "../../common/hooks/useLocalStorage";
import useToasts from "../../common/hooks/useToast";
import useKeepass from "./useKeepass";
import useSettings from "./useSettings";

const useFetcher = () => {
  const { get, post } = useFetch("/keepass");
  const { push } = useToasts();
  const { updateSettings } = useSettings();
  const { addDB, updateDB, selectedDB, exists, dbs } = useKeepass();
  const { get: gl, set, remove } = useLocalStorage();
  const { pickFile } = useFile();

  const fetchDBs = async (then) => {
    const { json } = await get("/dbs");
    if (!json.error) addDB(json);
    then?.call();
  };

  const fetchContent = async (pass) => {
    const { json } = await post("/content", { pass, db: selectedDB.name });

    if (json.error) return push({ message: json.error, severity: "error" });

    updateDB(`${selectedDB.index}.groups`, json.groups);
    updateDB(`${selectedDB.index}.fetched`, true);
    updateSettings("selected_gp_index", `0.groups.0`);

    const pwd_tokens = gl("pwd_tokens") || {};

    pwd_tokens[selectedDB.name] = json.pwd_token;

    set("pwd_tokens", pwd_tokens);
  };

  const fetchContentForCache = async () => {
    if (dbs.length === 0) return;
    const pwds = gl("pwd_tokens") || {};
    const ent = Object.entries(pwds).filter(([k]) => exists(k));

    updateSettings("selected_dbname", dbs[0].name);

    await Promise.allSettled(
      ent.map(async ([k, pwd_token]) => {
        const db = exists(k);
        if (db.groups.length > 0) return;
        const { json } = await post("/content", { pwd_token, db: k });
        if (json.error) return json;
        updateDB(`${db.index}.groups`, json.groups);
        updateDB(`${db.index}.fetched`, true);
        return json;
      })
    );
    if (ent.length > 0) {
      updateSettings("selected_gp_index", `0.groups.0`);
    }
  };

  const uploadDB = async () => {
    const files = await pickFile(".kdbx");
    const f = files[0];
    if (!(f.name || "").endsWith(".kdbx"))
      return push({
        message: "Invalid file type, only .kdbx files allowed",
        severity: "error",
      });
    const fd = new FormData();
    fd.append("file", new Blob(files, { type: f.type }));
    fd.append("name", f.name);
    const res = await fetch("/keepass/new-db", { method: "post", body: fd });
    const json = await res.json();
    if (!json.error) {
      updateDB("0.groups", []);
      updateDB("0.fetched", false);
      remove("pwd_tokens");
      await fetchDBs();
    } else
      push({
        message: json.error,
        severity: "error",
      });
  };

  return {
    fetchDBs,
    uploadDB,
    fetchContent,
    fetchContentForCache,
  };
};

export default useFetcher;
