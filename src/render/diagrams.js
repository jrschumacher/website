// The two case-study plates. Static SVG — no state, no interaction — so they
// are built here rather than in public/journal/, and never reach the browser as
// code. Geometry ported from the design prototype unchanged.

import { escapeHtml } from "../format.js";

const e = escapeHtml;

function turbulence(id) {
  return `<defs><filter id="${id}" x="-15%" y="-15%" width="130%" height="130%"><feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves="3" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="7"/></filter></defs>`;
}

function note(x, y, body, opts = {}) {
  return `<text class="mono" x="${x}" y="${y}" font-size="${opts.size ?? 9.5}" fill="${e(opts.fill ?? "#7b5f3f")}"${opts.anchor ? ` text-anchor="${opts.anchor}"` : ""}${opts.spacing ? ` letter-spacing="${opts.spacing}"` : ""}${opts.style ? ` font-style="${opts.style}"` : ""}>${e(body)}</text>`;
}

const open = `<svg viewBox="0 0 360 232" class="cs-diagram">`;

/** fig. a — twelve services, folded to one. */
function consolidate(tint) {
  const f = "url(#csw1)";
  const boxes = [[24, 52], [62, 38], [100, 60], [30, 96], [72, 88], [110, 104], [26, 142], [66, 134], [104, 148], [46, 178], [88, 182], [134, 66]];
  const threads = boxes
    .map(([x, y]) => `<line x1="${x + 26}" y1="${y + 8}" x2="238" y2="112" stroke="#7b5f3f" stroke-opacity="0.3" stroke-dasharray="2 4" stroke-width="0.8"/>`)
    .join("");
  const services = boxes
    .map(([x, y]) => `<g class="wash"><rect x="${x}" y="${y}" width="26" height="17" fill="${e(tint)}" fill-opacity="0.3" stroke="${e(tint)}" stroke-opacity="0.7" stroke-width="0.9" filter="${f}"/></g>`)
    .join("");
  return `${open}${turbulence("csw1")}
${threads}
${services}
<g class="wash">
<rect x="240" y="74" width="92" height="76" fill="${e(tint)}" fill-opacity="0.32" filter="${f}"/>
<rect x="240" y="74" width="92" height="76" fill="${e(tint)}" fill-opacity="0.16" filter="${f}"/>
<rect x="240" y="74" width="92" height="76" fill="none" stroke="${e(tint)}" stroke-width="1.2" filter="${f}"/>
</g>
${note(180, 20, "before → after", { anchor: "middle", spacing: 2 })}
${note(80, 218, "twelve services · k8s only", { anchor: "middle" })}
${note(286, 170, "runs anywhere", { anchor: "middle", style: "italic", size: 8.5, fill: "#8a7a5f" })}
${note(286, 218, "one go binary", { anchor: "middle" })}
</svg>`;
}

/** fig. b — four hops and weeks of waiting, folded to one hop, same day. */
function selfserve(tint) {
  const f = "url(#csw2)";
  const dot = (x, y, c) => `<circle cx="${x}" cy="${y}" r="4" fill="#f1ead9" stroke="${e(c)}" stroke-width="1.3"/>`;
  return `${open}${turbulence("csw2")}
${note(28, 38, "before · branding as a services ticket", { spacing: 1.5 })}
<line x1="36" y1="74" x2="324" y2="74" stroke="#7b5f3f" stroke-opacity="0.5" stroke-dasharray="3 5"/>
${dot(36, 74, "#7b5f3f")}${dot(132, 74, "#7b5f3f")}${dot(228, 74, "#7b5f3f")}${dot(324, 74, "#7b5f3f")}
${note(36, 94, "customer", { anchor: "middle" })}
${note(132, 94, "ticket", { anchor: "middle" })}
${note(228, 94, "engineer", { anchor: "middle" })}
${note(324, 94, "weeks", { anchor: "middle", fill: "#b03b1e" })}
${note(180, 124, "the engineer leaves the loop", { anchor: "middle", style: "italic", size: 8.5, fill: "#8a7a5f" })}
${note(28, 148, "after · the customer themes it", { spacing: 1.5 })}
<g class="wash">
<rect x="36" y="180" width="288" height="8" fill="${e(tint)}" fill-opacity="0.3" filter="${f}"/>
<line x1="36" y1="184" x2="324" y2="184" stroke="${e(tint)}" stroke-opacity="0.8" stroke-width="1.2" filter="${f}"/>
</g>
${dot(36, 184, tint)}${dot(324, 184, tint)}
${note(36, 206, "customer", { anchor: "middle" })}
${note(324, 206, "same day", { anchor: "middle", fill: "#b03b1e" })}
</svg>`;
}

export function caseDiagram(type, tint) {
  return type === "consolidate" ? consolidate(tint) : selfserve(tint);
}
