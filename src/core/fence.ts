/**
 * Turns one fenced code block into decorated, real HTML in one of three modes.
 * Output is plain markup with Shiki's inline-styled tokens, ready to live in
 * the preview or be inlined into an exported document.
 */
import type { HighlighterCore } from "shiki/core";
import { resolveLang, getThemeColors } from "./highlight.ts";

export type FenceMode = "term" | "themed" | "plain";

const escapeHtml = (s: string): string =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

/** Pretty label shown in the fence bar. */
function langLabel(lang: string): string {
  const map: Record<string, string> = {
    ts: "typescript", tsx: "tsx", js: "javascript", jsx: "jsx",
    py: "python", rb: "ruby", sh: "shell", bash: "bash", text: "text",
    plaintext: "text", "": "text",
  };
  return map[lang.toLowerCase()] ?? lang.toLowerCase();
}

function bar(mode: FenceMode, label: string): string {
  const dots =
    mode === "term"
      ? '<span class="fenced__dots"><i></i><i></i><i></i></span>'
      : "";
  return `<div class="fenced__bar">${dots}<span class="fenced__lang">${escapeHtml(label)}</span></div>`;
}

/**
 * Inline --fence-* overrides so a term/themed block wears its Shiki theme's
 * own colours, derived from the theme bg/fg via color-mix. Terminal gets a
 * darker bar (mantle effect); themed keeps a seamless bar on the body.
 */
function themeVars(bg: string, fg: string, mode: "term" | "themed"): string {
  const muted = `color-mix(in srgb, ${fg} 55%, ${bg})`;
  const border = `color-mix(in srgb, ${fg} 16%, ${bg})`;
  const ln = `color-mix(in srgb, ${fg} 36%, ${bg})`;
  const barBg = mode === "term" ? `color-mix(in srgb, ${bg} 86%, #000)` : bg;
  return [
    `--fence-bg:${bg}`,
    `--fence-fg:${fg}`,
    `--fence-bar-bg:${barBg}`,
    `--fence-border:${border}`,
    `--fence-muted:${muted}`,
    `--fence-ln:${ln}`,
  ].join(";");
}

/**
 * Decorate a single block. `hl` must already be loaded (codeToHtml is sync).
 */
export function decorate(
  hl: HighlighterCore,
  code: string,
  lang: string,
  mode: FenceMode,
  theme: string,
): string {
  const src = code.replace(/\n$/, "");
  const label = langLabel(lang);

  if (mode === "plain") {
    const body = `<pre><code>${escapeHtml(src)}</code></pre>`;
    return `<div class="fenced fenced--plain" data-lang="${escapeHtml(lang)}">${bar(
      "plain",
      label,
    )}<div class="fenced__body">${body}</div></div>`;
  }

  const resolved = resolveLang(hl, lang);
  const highlighted = hl.codeToHtml(src, {
    lang: resolved,
    theme,
    structure: "classic",
  });
  const { bg, fg } = getThemeColors(hl, theme);
  const cls = mode === "term" ? "fenced--term" : "fenced--themed";
  return `<div class="fenced ${cls}" data-lang="${escapeHtml(
    lang,
  )}" style="${themeVars(bg, fg, mode)}">${bar(mode, label)}<div class="fenced__body">${highlighted}</div></div>`;
}
