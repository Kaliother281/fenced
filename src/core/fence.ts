/**
 * Light fence helpers, no Shiki dependency.
 *
 * This module stays free of the highlighter so it can sit in the main bundle
 * with the markdown pipeline. The highlighted `decorate()` lives in
 * highlight.ts (the deferred chunk) and reuses these helpers.
 */
export type FenceMode = "term" | "themed" | "plain";

export const escapeHtml = (s: string): string =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

/** Pretty label shown in the fence bar. */
export function langLabel(lang: string): string {
  const map: Record<string, string> = {
    ts: "typescript", tsx: "tsx", js: "javascript", jsx: "jsx",
    py: "python", rb: "ruby", sh: "shell", bash: "bash", text: "text",
    plaintext: "text", "": "text",
  };
  return map[lang.toLowerCase()] ?? lang.toLowerCase();
}

export function bar(mode: FenceMode, label: string): string {
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
export function themeVars(bg: string, fg: string, mode: "term" | "themed"): string {
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
 * Plain decoration: no highlighting, no highlighter needed. Used for plain
 * mode and as the instant-paint / offline fallback while Shiki loads.
 */
export function decoratePlain(code: string, lang: string): string {
  const src = code.replace(/\n$/, "");
  const body = `<pre><code>${escapeHtml(src)}</code></pre>`;
  return `<div class="fenced fenced--plain" data-lang="${escapeHtml(lang)}">${bar(
    "plain",
    langLabel(lang),
  )}<div class="fenced__body">${body}</div></div>`;
}
