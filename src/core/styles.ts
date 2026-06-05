/**
 * Shared visual layer.
 *
 * These strings are the single source of truth for how a converted document
 * and its fenced code blocks look. They are injected into the live preview at
 * runtime AND inlined into every exported .html file, so the app and the
 * download can never drift apart.
 *
 * Syntax colours come from Shiki as inline styles on each token, so the CSS
 * here only dresses the chrome (window bar, dots, borders, prose). Everything
 * is namespaced under `.fenced-doc` / `.fenced` so a pasted snippet stays
 * insulated from a host page's own styles.
 */

/** Minimal token set, emitted with literal values for self-contained export. */
const TOKENS: Record<"dark" | "light", Record<string, string>> = {
  dark: {
    bg: "#0d0e10",
    surface: "#16181c",
    "surface-2": "#1c1f24",
    border: "#24272e",
    "border-strong": "#30343c",
    ink: "#e8e9ea",
    "ink-muted": "#a0a4ab",
    "ink-faint": "#6c7079",
    accent: "#d68a9c",
  },
  light: {
    bg: "#ffffff",
    surface: "#fbfbfa",
    "surface-2": "#f4f4f3",
    border: "#e6e6e4",
    "border-strong": "#d8d8d5",
    ink: "#16181c",
    "ink-muted": "#5b5f66",
    "ink-faint": "#8b8f96",
    accent: "#b05a72",
  },
};

export type UiTheme = "dark" | "light";

function tokenBlock(theme: UiTheme): string {
  const t = TOKENS[theme];
  const vars = Object.entries(t)
    .map(([k, v]) => `  --${k}: ${v};`)
    .join("\n");
  return `:root {\n${vars}\n  --font-mono: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;\n  --font-sans: "Hanken Grotesk", ui-sans-serif, sans-serif;\n}`;
}

/** Prose: how the rendered Markdown body reads. */
export const PROSE_CSS = `
.fenced-doc {
  font-family: var(--font-sans);
  color: var(--ink);
  line-height: 1.7;
  max-width: 72ch;
  margin: 0 auto;
}
.fenced-doc h1, .fenced-doc h2, .fenced-doc h3 {
  font-family: var(--font-mono);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin: 1.8em 0 0.6em;
}
.fenced-doc h1 { font-size: 1.875rem; margin-top: 0; }
.fenced-doc h2 { font-size: 1.375rem; }
.fenced-doc h3 { font-size: 1.0625rem; }
.fenced-doc p, .fenced-doc ul, .fenced-doc ol, .fenced-doc blockquote { margin: 0 0 1.1em; }
.fenced-doc a { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }
.fenced-doc strong { font-weight: 600; }
.fenced-doc ul, .fenced-doc ol { padding-left: 1.4em; }
.fenced-doc li { margin-bottom: 0.35em; }
.fenced-doc li::marker { color: var(--accent); }
.fenced-doc blockquote {
  border-left: 3px solid var(--accent);
  padding-left: 1em;
  color: var(--ink-muted);
  font-style: italic;
}
.fenced-doc hr { border: 0; border-top: 1px solid var(--border); margin: 2em 0; }
.fenced-doc img { max-width: 100%; height: auto; border-radius: 8px; }
.fenced-doc table { border-collapse: collapse; width: 100%; font-size: 0.9375rem; }
.fenced-doc th, .fenced-doc td { border: 1px solid var(--border); padding: 0.5em 0.7em; text-align: left; }
/* inline code (not inside a fenced block) */
.fenced-doc :not(.fenced) > :not(pre) > code {
  font-family: var(--font-mono);
  font-size: 0.86em;
  background: var(--surface-2);
  color: var(--accent);
  padding: 0.15em 0.4em;
  border-radius: 5px;
}
`;

/** The signature: the three fenced code-block modes. */
export const FENCE_CSS = `
.fenced {
  margin: 1.4em 0;
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  background: var(--surface);
  box-shadow: 0 1px 0 rgba(255,255,255,0.02), 0 12px 32px rgba(0,0,0,0.18);
  font-family: var(--font-mono);
  font-size: 0.875rem;
}
.fenced__bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  color: var(--ink-faint);
  font-size: 0.8125rem;
}
.fenced__dots { display: flex; gap: 6px; }
.fenced__dots i { width: 11px; height: 11px; border-radius: 50%; background: var(--border-strong); }
.fenced__title { color: var(--ink-muted); }
.fenced__lang { margin-left: auto; color: var(--ink-faint); }
.fenced__body { padding: 14px 18px; overflow-x: auto; line-height: 1.7; }
.fenced__body pre { margin: 0; background: transparent !important; }
.fenced__body code { font-family: inherit; }

/* terminal mode: window chrome, lit dots */
.fenced--term .fenced__bar { background: var(--surface-2); }
.fenced--term .fenced__dots i:nth-child(1) { background: #f38ba8; }
.fenced--term .fenced__dots i:nth-child(2) { background: #f9e2af; }
.fenced--term .fenced__dots i:nth-child(3) { background: #a6e3a1; }

/* themed mode: clean bar, line numbers */
.fenced--themed .fenced__bar { background: transparent; }
.fenced--themed .fenced__body pre { counter-reset: ln; }
.fenced--themed .fenced__body .line {
  counter-increment: ln;
  display: inline-block;
  width: 100%;
}
.fenced--themed .fenced__body .line::before {
  content: counter(ln);
  display: inline-block;
  width: 2.2em;
  margin-right: 1em;
  text-align: right;
  color: var(--ink-faint);
  opacity: 0.55;
  user-select: none;
}

/* plain mode: barely-there chrome, no highlighting */
.fenced--plain { box-shadow: none; }
.fenced--plain .fenced__bar { background: transparent; }
.fenced--plain .fenced__body { color: var(--ink); }
.fenced--plain .fenced__body pre { white-space: pre; }
`;

/** Full CSS for a standalone exported document. */
export function buildExportCss(theme: UiTheme): string {
  return [
    tokenBlock(theme),
    `* { box-sizing: border-box; }`,
    `body { margin: 0; background: var(--bg); color: var(--ink); padding: 48px 24px; -webkit-font-smoothing: antialiased; }`,
    PROSE_CSS,
    FENCE_CSS,
  ].join("\n");
}

/** CSS injected into the live app so the preview matches the export exactly. */
export const PREVIEW_CSS = PROSE_CSS + FENCE_CSS;
