// Escaping, shared by every builder in this directory. The figures interpolate
// user-invisible data (colours, ids, path strings) as well as prose, and the
// same helper covers both: text nodes and quoted attribute values.
export function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Round to one decimal — SVG path data does not need more, and pays for it. */
export function fmt(value) {
  return Number(value).toFixed(1);
}

/** A year float as the year a reader would say: 2026.65 -> "2026". */
export function yr(value) {
  return String(Math.floor(value));
}
