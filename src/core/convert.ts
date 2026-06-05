/**
 * Markdown to decorated HTML.
 *
 * markdown-it handles the prose; every fenced code block is routed through a
 * `renderFence` callback so it comes out as a decorated `.fenced` window
 * instead of a bare `<pre>`. This module has no Shiki dependency: the caller
 * supplies the (highlighted) decorator, which lives in the deferred chunk.
 * The body markup is identical whether it lands in the preview or an export.
 */
import MarkdownIt from "markdown-it";
import { decoratePlain } from "./fence.ts";

export interface ConvertOptions {
  /** Turn a code block into decorated HTML. Supplied by the caller. */
  renderFence: (code: string, lang: string) => string;
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
  // No context means highlighter-free: render a plain fence.
  if (!ctx) return decoratePlain(token.content, lang);
  return ctx.renderFence(token.content, lang);
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

/** Render with plain fences only, no Shiki. For instant paint and offline. */
export function convertPlain(markdown: string): string {
  ctx = null;
  return md.render(markdown);
}
