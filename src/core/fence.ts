/**
 * Turns one fenced code block into decorated, real HTML in one of three modes.
 * Output is plain markup with Shiki's inline-styled tokens, ready to live in
 * the preview or be inlined into an exported document.
 */
import type { HighlighterCore } from "shiki/core";
import { resolveLang } from "./highlight.ts";

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
  const cls = mode === "term" ? "fenced--term" : "fenced--themed";
  return `<div class="fenced ${cls}" data-lang="${escapeHtml(
    lang,
  )}">${bar(mode, label)}<div class="fenced__body">${highlighted}</div></div>`;
}
