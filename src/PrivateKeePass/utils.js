export const th = {
  title: { label: "Title" },
  username: { label: "UserName" },
  password: { label: "Password" },
  url: { label: "URL" },
  notes: { label: "Notes" },
};

export const shortenFileName = (fn = "") => {
  const _fn = fn.split(".");
  const len = _fn.length;
  const __fn = _fn.slice(0, len - 1).join(".");
  if (__fn.length > 15)
    return `${__fn.slice(0, 3)}....${__fn.slice(3, 3)}.${_fn.at(-1)}`;
  return fn;
};
