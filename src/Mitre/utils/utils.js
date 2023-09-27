export const field_separator = "<@>";
export const mitre_base_url = "https://attack.mitre.org";

export const deepKey = (key, obj, update) => {
  const keys = key.split(field_separator);
  const lastKey = keys.at(-1);
  const object = keys
    .reverse()
    .slice(1)
    .reverse()
    .reduce((prev, next) => {
      return (
        prev[isNaN(next) ? next : Number(next)] ||
        (Array.isArray(prev) ? [] : {})
      );
    }, obj);
  return update ? { object, lastKey } : object[lastKey];
};

export const objectExcept = (obj, keys) => {
  const newObject = {};
  for (const k in obj) {
    if (keys.includes(k)) continue;
    newObject[k] = obj[k];
  }
  return newObject;
};

export const _entr = (ob) => Object.entries(ob);
export const _l = (str) => String(str).toLowerCase().trim();

export const fix_percent = (value) => {
  if (!value) return 0;
  const _v = String(value).split("%");
  if (!isNaN(_v[0])) return Number(_v[0]);
  return 0;
};

export const fixNode = (node) =>
  node?.textContent.replace(/[\n\t]/g, "").trim();

export const arr = (list) => [].slice.call(list);

export const fetchDoc = async (endpoint, selector) => {
  const response = await fetch(mitre_base_url + endpoint);
  const htmlStr = await response.text();
  const doc = new DOMParser().parseFromString(htmlStr, "text/html");
  return arr(doc.querySelectorAll(selector) || []);
};

export const getTechniqueObject = async (tactic_id) => {
  const doc = await fetchDoc(
    `/tactics/${tactic_id}`,
    "table.table-techniques tbody tr"
  );
  let technique = "";

  return doc.map((tr) => {
    const ch = arr(tr.children).map((td) => fixNode(td));
    const _id = ch[0];
    if (_id) technique = _id;

    const baseURL = `${mitre_base_url}/techniques/${technique}`;

    return {
      identifier: (technique + (_id ? "" : ch[1])).trim(),
      name: _id ? ch[1] : ch[2],
      l2_uc_identifier: tactic_id,
      scope: "",
      comments: "",
      description: _id ? ch[2] : ch[3],
      mitre_url: _id ? baseURL : `${baseURL}/${ch[1].split(".")[1]}`,
      coverage: "",
      effectiveness: "",
    };
  });
};
