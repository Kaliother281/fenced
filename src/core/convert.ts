/**
 * Markdown to decorated HTML.
 *
 * markdown-it handles the prose; every fenced code block is routed through
 * core/fence.ts so it comes out as a decorated `.fenced` window instead of a
 * bare `<pre>`. The body markup is identical whether it lands in the live
 * preview or an exported file.
 */
import MarkdownIt from "markdown-it";
import type { HighlighterCore } from "shiki/core";
import { decorate, type FenceMode } from "./fence.ts";

export interface ConvertOptions {
  hl: HighlighterCore;
  mode: FenceMode;
  theme: string;
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: false,
});

// Mutable context the fence rule reads from on each render pass.
let ctx: ConvertOptions | null = null;

md.renderer.rules.fence = (tokens, idx) => {
  const token = tokens[idx];
  const lang = token.info.trim().split(/\s+/)[0] ?? "";
  if (!ctx) return `<pre><code>${token.content}</code></pre>`;
  return decorate(ctx.hl, token.content, lang, ctx.mode, ctx.theme);
};

/** Render Markdown into the inner HTML of a `.fenced-doc` body. */
export function convert(markdown: string, opts: ConvertOptions): string {
  ctx = opts;
  try {
    return md.render(markdown);
  } finally {
    ctx = null;
  }
}
