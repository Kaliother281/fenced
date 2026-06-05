/** Demo document loaded by the "sample" button. */
export const SAMPLE = `# fenced

Decorated code blocks, real HTML, no screenshots. Everything below renders in
your browser and downloads as one self-contained file.

## why it exists

Screenshots of code go stale, you cannot copy from them, and they read poorly
on small screens. **fenced** keeps the code as real, selectable text and just
dresses it up.

## a fenced block

\`\`\`ts
export function fence(code: string, lang = "ts") {
  const html = highlight(code, lang);
  return \`<pre data-lang="\${lang}">\${html}</pre>\`;
}
\`\`\`

Inline \`code\` still works, and so do the usual things:

- lists
- **bold** and *italic*
- [links](https://fenced.dev)

> One accent colour, hairlines over shadows, monospace as the voice.

## another language

\`\`\`python
def greet(name: str) -> str:
    return f"hello, {name}"
\`\`\`

Switch the mode and theme up top to see the same content redecorated.
`;
