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
export const _u = (str) => String(str).toUpperCase().trim();

export const fix_percent = (value) => {
  if (!value) return 0;
  const _v = String(value).split("%");
  if (!isNaN(_v[0])) return Number(_v[0]);
  return 0;
};

export const fixNode = (node) =>
  node?.textContent.replace(/[\n\t]/g, "").trim();

export const arr = (list) => [].slice.call(list);

export const fetchDoc = async (
  endpoint,
  selector,
  url_getter,
  hostname = "attack.mitre.org"
) => {
  const url = `/ucm/html?path=${endpoint}&hostname=${hostname}`;
  const response = await fetch(url_getter ? url_getter(url) : url);
  const json = await response.json();
  const doc = new DOMParser().parseFromString(json.data, "text/html");
  return arr(doc.querySelectorAll(selector) || []);
};

export const getTechniqueObject = async (tactic_id, url_getter) => {
  const doc = await fetchDoc(
    `/tactics/${tactic_id}/`,
    "table.table-techniques tbody tr",
    url_getter
  );
  let technique = "";

  return doc.map((tr) => {
    const ch = arr(tr.children).map((td) => fixNode(td));
    const _id = ch[0];
    if (_id) technique = _id;

    return {
      identifier: (technique + (_id ? "" : ch[1])).trim(),
      name: _id ? ch[1] : ch[2],
      l2_uc_identifier: tactic_id,
      scope: "",
      comments: "",
      description: _id ? ch[2] : ch[3],
      coverage: "",
      effectiveness: "",
    };
  });
};

const get_id_from_url = (url = "") =>
  (url.endsWith("/")
    ? url.split("/").at(-2)
    : url.split("/").at(-1)
  ).toUpperCase();

export const getCarAnalyticsObject = async (serverURL) => {
  const doc = await fetchDoc(
    "/analytics/by_technique",
    "table tbody tr",
    serverURL,
    "car.mitre.org"
  );

  let l3_uc_identifier = "";

  return doc
    .map((tr) => {
      const ch = arr(tr.children);

      let l4_uc_identifier, car_uc_identifiers;

      if (ch.length > 2) {
        const id_el = ch[0].firstElementChild;
        if (id_el instanceof HTMLAnchorElement)
          l3_uc_identifier = get_id_from_url(id_el.getAttribute("href"));

        const sid_el = ch[1].firstElementChild;
        if (sid_el instanceof HTMLAnchorElement)
          l4_uc_identifier =
            l3_uc_identifier +
            "." +
            get_id_from_url(sid_el.getAttribute("href"));

        const a_el = ch[2].firstElementChild;
        if (a_el instanceof HTMLUListElement) {
          car_uc_identifiers = arr(a_el.children)
            .map((c) =>
              (c.firstElementChild.getAttribute("href") || "")
                .trim()
                .toUpperCase()
            )
            .filter((a) => a);
        }
      } else if (ch.length === 1) {
        const id_el = ch[0].firstElementChild;
        if (id_el instanceof HTMLAnchorElement)
          l3_uc_identifier = get_id_from_url(id_el.getAttribute("href"));
        return;
      } else if (ch.length === 2) {
        const sid_el = ch[0].firstElementChild;
        if (sid_el instanceof HTMLAnchorElement)
          l4_uc_identifier =
            l3_uc_identifier +
            "." +
            get_id_from_url(sid_el.getAttribute("href"));

        const a_el = ch[1].firstElementChild;
        if (a_el instanceof HTMLUListElement) {
          car_uc_identifiers = arr(a_el.children)
            .map((c) =>
              (c.firstElementChild.getAttribute("href") || "")
                .trim()
                .toUpperCase()
            )
            .filter((a) => a);
        }
      }

      if (car_uc_identifiers && (l3_uc_identifier || l4_uc_identifier))
        return {
          l3_uc_identifier: l3_uc_identifier || "",
          l4_uc_identifier: l4_uc_identifier || "",
          car_uc_identifiers: car_uc_identifiers || [],
        };

      return null;
    })
    .filter((c) => c);
};
