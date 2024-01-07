const fixObject = (value) => {
  if (typeof value !== "object" || !value) return value;
  if (Array.isArray(value)) return value.map(fixObject);
  return Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      return [k.trim() || "null", fixObject(v)];
    })
  );
};

const structure = (body) => {
  return (Array.isArray(body) ? body : [body]).map((data) => {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        {
          ...(typeof value === "object" && !Array.isArray(value) && value),
          value: typeof value?.value === "undefined" ? value : value.value,
        },
      ])
    );
  });
};

function numberToLetters(num) {
  let letters = "";
  while (num >= 0) {
    letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[num % 26] + letters;
    num = Math.floor(num / 26) - 1;
  }
  return letters;
}

module.exports = {
  structure,
  fixObject,
  numberToLetters,
};
