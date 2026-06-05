/**
 * Build a self-contained .html document from rendered body markup.
 *
 * All CSS is inlined and the JetBrains Mono / Hanken Grotesk webfonts are
 * pulled from Google Fonts via a <link>. The file is portable: open it
 * anywhere, host it anywhere, or lift a single `.fenced` block into a CMS.
 * Nothing here phones home beyond the font request.
 */
import { buildExportCss, type UiTheme } from "./styles.ts";

const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&family=Hanken+Grotesk:wght@400;500;600;700&display=swap";

export interface ExportOptions {
  title: string;
  bodyHtml: string;
  theme: UiTheme;
}

export function buildDocument({ title, bodyHtml, theme }: ExportOptions): string {
  const safeTitle = title.replace(/[<>&]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c]!,
  );
  return `<!doctype html>
<html lang="en" data-theme="${theme}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${safeTitle}</title>
<meta name="generator" content="fenced · fenced.dev">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS_HREF}" rel="stylesheet">
<style>
${buildExportCss(theme)}
</style>
</head>
<body>
<article class="fenced-doc">
${bodyHtml}
</article>
</body>
</html>
`;
}

/** Trigger a browser download of a string as a file. */
export function downloadFile(filename: string, contents: string, mime = "text/html"): void {
  const blob = new Blob([contents], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
