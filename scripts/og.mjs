/**
 * Generates public/og.png (1200x630 social card) and public/apple-touch-icon.png.
 * Build-time only. Run with `npm run og` after touching the brand art.
 */
import { Resvg } from "@resvg/resvg-js";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MONO = "JetBrains Mono, ui-monospace, monospace";

// dusty-rose + ink palette, matching the dark theme tokens
const C = {
  bg: "#0d0e10",
  surface: "#16181c",
  border: "#24272e",
  ink: "#e8e9ea",
  muted: "#a0a4ab",
  faint: "#6c7079",
  accent: "#d68a9c",
  key: "#d2a8ff",
  fn: "#79c0ff",
  str: "#d68a9c",
};

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="82%" cy="-6%" r="62%">
      <stop offset="0%" stop-color="${C.accent}" stop-opacity="0.18"/>
      <stop offset="60%" stop-color="${C.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="${C.bg}"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <text x="90" y="150" font-family="${MONO}" font-weight="700" font-size="66" letter-spacing="-2">
    <tspan fill="${C.accent}">\`\`\`</tspan><tspan fill="${C.ink}" dx="18">fenced</tspan>
  </text>
  <text x="92" y="212" font-family="${MONO}" font-weight="400" font-size="30" fill="${C.muted}">decorated code blocks, real HTML, no screenshots.</text>

  <!-- mock fenced terminal window -->
  <g transform="translate(90 286)">
    <rect width="1020" height="262" rx="16" fill="${C.surface}" stroke="${C.border}" stroke-width="1.5"/>
    <rect width="1020" height="52" rx="16" fill="#1c1f24"/>
    <rect y="36" width="1020" height="16" fill="#1c1f24"/>
    <circle cx="34" cy="26" r="7.5" fill="#f38ba8"/>
    <circle cx="60" cy="26" r="7.5" fill="#f9e2af"/>
    <circle cx="86" cy="26" r="7.5" fill="#a6e3a1"/>
    <text x="988" y="33" text-anchor="end" font-family="${MONO}" font-size="19" fill="${C.faint}">typescript</text>
    <g font-family="${MONO}" font-size="25" letter-spacing="0">
      <text x="40" y="112"><tspan fill="${C.key}">export function</tspan><tspan fill="${C.fn}"> fence</tspan><tspan fill="${C.muted}">(</tspan><tspan fill="${C.ink}">code</tspan><tspan fill="${C.muted}">) {</tspan></text>
      <text x="40" y="156"><tspan fill="${C.ink}">  const html = </tspan><tspan fill="${C.fn}">highlight</tspan><tspan fill="${C.muted}">(</tspan><tspan fill="${C.ink}">code</tspan><tspan fill="${C.muted}">);</tspan></text>
      <text x="40" y="200"><tspan fill="${C.key}">  return</tspan><tspan fill="${C.str}"> \`&lt;pre&gt;\${html}&lt;/pre&gt;\`</tspan><tspan fill="${C.muted}">;</tspan></text>
      <text x="40" y="244"><tspan fill="${C.muted}">}</tspan></text>
    </g>
  </g>
</svg>`;

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="${C.bg}"/>
  <path d="M62 53 L101 90 L62 127" fill="none" stroke="${C.accent}" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="112" y="116" width="34" height="14" rx="7" fill="${C.accent}"/>
</svg>`;

function toPng(svg, width) {
  return new Resvg(svg, {
    fitTo: { mode: "width", value: width },
    font: { loadSystemFonts: true },
  })
    .render()
    .asPng();
}

writeFileSync(join(ROOT, "public/og.png"), toPng(ogSvg, 1200));
writeFileSync(join(ROOT, "public/apple-touch-icon.png"), toPng(iconSvg, 180));
console.log("wrote public/og.png and public/apple-touch-icon.png");
