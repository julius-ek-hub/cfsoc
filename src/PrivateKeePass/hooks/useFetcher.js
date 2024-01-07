import useFetch from "../../common/hooks/useFetch";
import useFile from "../../common/hooks/useFile";
import useLocalStorage from "../../common/hooks/useLocalStorage";
import useCommonSettings from "../../common/hooks/useSettings";
import useToasts from "../../common/hooks/useToast";
import useKeepass from "./useKeepass";
import useSettings from "./useSettings";

import { _keys } from "../../common/utils/utils";

const useFetcher = () => {
  const { get, post, patch, dlete, serverURL } = useFetch("/pkeepass");
  const { push } = useToasts();
  const { updateSettings, settings } = useSettings();
  const { uname } = useCommonSettings();
  const { addDB, updateDB, selectedDB, exists, dbs } = useKeepass();
  const { get: gl, set, remove } = useLocalStorage({ sufix: "private_" });
  const { pickFile } = useFile();

  const fetchDBs = async (then) => {
    const { json } = await get(`/dbs?uname=${uname}`);
    if (!json.error) addDB(json);
    then?.call();
  };

  const fetchContent = async (pass) => {
    const { json } = await post("/content", {
      pass,
      db: selectedDB.name,
      uname,
    });

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
        const { json } = await post("/content", { pwd_token, db: k, uname });
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
    fd.append("uname", uname);
    const res = await fetch("/pkeepass/new-db", { method: "post", body: fd });
    const json = await res.json();
    if (!json.error) {
      updateDB("0.groups", []);
      updateDB("0.fetched", false);
      remove("pwd_tokens");
      _keys(settings).map((k) => {
        if (k.startsWith("expanded_")) updateSettings(k, undefined);
      });
      await fetchDBs();
    } else
      push({
        message: json.error,
        severity: "error",
      });
  };

  const addEntry = async (entry, $location, edit) => {
    const pwds = gl("pwd_tokens") || {};
    const db = selectedDB.name;
    const credentials = { pwd_token: pwds[db], db, uname };
    const { json } = await (edit ? patch : post)("/entry", {
      entry,
      $location,
      credentials,
    });

    if (!json.error) {
      updateDB(`${selectedDB.index}.groups`, json.groups);
      updateSettings(
        `expanded_${$location.split(".").join("_").split("_entries")[0]}`,
        true
      );
    }
  };

  const addGroup = async (name, $location, edit, onDone) => {
    const pwds = gl("pwd_tokens") || {};
    const db = selectedDB.name;
    const credentials = { pwd_token: pwds[db], db, uname };
    const { json } = await (edit ? patch : post)("/group", {
      name,
      $location,
      credentials,
    });

    if (!json.error) {
      updateDB(`${selectedDB.index}.groups`, json.groups);
      updateSettings(`expanded_${$location.split(".").join("_")}`, true);
      onDone?.call();
    }
  };

  const deletEntryOrGroup = async ($location, path) => {
    const pwds = gl("pwd_tokens") || {};
    const db = selectedDB.name;
    const { json } = await dlete(
      `/${path}?pwd_token=${pwds[db]}&db=${db}&$location=${JSON.stringify(
        $location
      )}&uname=${uname}`
    );
    if (!json.error) {
      updateDB(`${selectedDB.index}.groups`, json.groups);
      $location.map(($l) => {
        updateSettings(`expanded_${$l.split(".").join("_")}`, undefined);
      });
    }
  };

  const restoreEntryOrGroup = async ($location, path) => {
    const pwds = gl("pwd_tokens") || {};
    const db = selectedDB.name;
    const credentials = { pwd_token: pwds[db], db, uname };
    const { json } = await patch(`/restore${path}`, {
      $location,
      credentials,
    });
    if (!json.error) {
      updateDB(`${selectedDB.index}.groups`, json.groups);
      $location.map(($l) => {
        updateSettings(`expanded_${$l.split(".").join("_")}`, undefined);
      });
    }
  };

  const emptyRB = async (onDone) => {
    const pwds = gl("pwd_tokens") || {};
    const db = selectedDB.name;
    const { json } = await dlete(
      `/empty-rb?pwd_token=${pwds[db]}&db=${db}&uname=${uname}`
    );
    if (!json.error) {
      updateDB(`${selectedDB.index}.groups`, json.groups);
      onDone?.call();
    }
  };

  const restoreRB = async (onDone) => {
    const pwds = gl("pwd_tokens") || {};
    const db = selectedDB.name;
    const credentials = { pwd_token: pwds[db], db, uname };
    const { json } = await patch(`/restore-rb`, {
      credentials,
    });
    if (!json.error) {
      updateDB(`${selectedDB.index}.groups`, json.groups);
      onDone?.call();
    }
  };

  const moveEntryOrGroup = async ($target, $to, onDone) => {
    const pwds = gl("pwd_tokens") || {};
    const db = selectedDB.name;
    const credentials = { pwd_token: pwds[db], db, uname };
    const { json } = await patch(`/move`, {
      $target,
      $to,
      credentials,
    });
    if (!json.error) {
      updateDB(`${selectedDB.index}.groups`, json.groups);
      updateSettings(`expanded_${$to.split(".").join("_")}`, true);
      $target.map(($t) => {
        updateSettings(`expanded_${$t.split(".").join("_")}`, undefined);
      });
      onDone?.call();
    }
  };

  const deleteDB = async (db, onDone) => {
    const { json } = await dlete(`/db?uname=${uname}&db=${db.name}`);
    if (!json.error) {
      remove("pwd_tokens");
      fetchDBs(onDone);
      _keys(settings).map((k) => {
        if (k.startsWith("expanded_")) updateSettings(k, undefined);
      });
    }
  };

  const downloadDB = async (db, onDone) => {
    const res = await fetch(
      serverURL(`/pkeepass/download?uname=${uname}&db=${db.name}`)
    );

    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = db.name;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    onDone?.call();
  };

  return {
    fetchDBs,
    uploadDB,
    addEntry,
    deleteDB,
    downloadDB,
    addGroup,
    emptyRB,
    restoreRB,
    deletEntryOrGroup,
    fetchContent,
    moveEntryOrGroup,
    restoreEntryOrGroup,
    fetchContentForCache,
  };
};

export default useFetcher;
