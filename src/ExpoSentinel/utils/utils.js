export const field_separator = "<@>";
export const mitre_base_url = "https://attack.mitre.org";

export const default_styles = {
  textAlign: {
    type: "list",
    value: ["center", "left", "right"],
    label: "Text Align",
    default: "left",
  },
  verticalAlign: {
    type: "list",
    value: ["middle", "top", "bottom"],
    label: "Vertical Align",
    default: "middle",
  },
  fontWeight: { type: "text", label: "Font Weight", default: "normal" },
  border: {
    type: "list",
    label: "Border",
    default: "thin",
    value: ["thin", "thick", "none"],
  },
  fontSize: { type: "number", label: "Font Size", default: "" },
  padding: { type: "text", label: "Padding", default: "" },
  bgcolor: {
    type: "color",
    label: "Background Color",
    default: "background.paper",
  },
  color: { type: "color", label: "Text Ccolor", default: "inherit" },
};

export const getSX = (sx = {}) => ({
  ...(sx.bgcolor && { bgcolor: sx.bgcolor }),
  ...(sx.border === "none" && { borderColor: "transparent!important" }),
  ...(sx.fontSize && { fontSize: `${sx.fontSize}px!important` }),
  ...(sx.verticalAlign && {
    verticalAlign: `${sx.verticalAlign}!important`,
  }),
  ...(sx.textAlign && { textAlign: `${sx.textAlign}!important` }),
  ...(sx.fontWeight && { fontWeight: `${sx.fontWeight}!important` }),
  ...(sx.padding && { padding: `${sx.padding}!important` }),
  ...(sx.color && { color: `${sx.color}!important` }),
});

export const all_permissions = {
  read: { name: "Read", description: "Has read access to this sheet" },
  write: { name: "Write", description: "Can add content to this sheet" },
  delete: { name: "Delete", description: "Can remove content from this dheet" },
  modify: { name: "Modify", description: "Can modify existing content" },
};

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
export const _keys = (ob) => Object.keys(ob);
export const _values = (ob) => Object.values(ob);
export const entr_ = (arr) => Object.fromEntries(arr);

export const _l = (str) => String(str).toLowerCase().trim();
export const _u = (str) => String(str).toUpperCase().trim();
export const fix_data = (data) =>
  entr_(
    _entr(data).map(([key, value]) => [
      key,
      {
        value: value?.hasOwnProperty("value") ? value.value : value,
        sx: value?.sx || {},
      },
    ])
  );

export const fix_percent = (value) => {
  if (!value) return 0;
  const _v = String(value).split("%");
  if (!isNaN(_v[0])) return Number(_v[0]);
  return 0;
};

export const fixNode = (node) =>
  node?.textContent.replace(/[\n\t]/g, "").trim();

export const arr = (list) => [].slice.call(list);
