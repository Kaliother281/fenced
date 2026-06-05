/**
 * Lightweight theme metadata for the picker UI.
 *
 * Kept separate from highlight.ts (which statically imports every Shiki grammar
 * and theme) so the app shell and the theme dropdown carry zero Shiki weight.
 * The heavy highlighter loads on demand. The ids here must match the themes
 * registered in highlight.ts.
 */
export const THEMES: { group: string; items: { id: string; label: string }[] }[] = [
  {
    group: "catppuccin",
    items: [
      { id: "catppuccin-mocha", label: "mocha" },
      { id: "catppuccin-macchiato", label: "macchiato" },
      { id: "catppuccin-frappe", label: "frappé" },
      { id: "catppuccin-latte", label: "latte" },
    ],
  },
  {
    group: "dark",
    items: [
      { id: "github-dark", label: "github dark" },
      { id: "one-dark-pro", label: "one dark pro" },
      { id: "tokyo-night", label: "tokyo night" },
      { id: "night-owl", label: "night owl" },
      { id: "nord", label: "nord" },
      { id: "dracula", label: "dracula" },
      { id: "rose-pine", label: "rosé pine" },
      { id: "vitesse-dark", label: "vitesse dark" },
    ],
  },
  {
    group: "light",
    items: [
      { id: "github-light", label: "github light" },
      { id: "vitesse-light", label: "vitesse light" },
      { id: "rose-pine-dawn", label: "rosé pine dawn" },
    ],
  },
];

export const DEFAULT_THEME = "catppuccin-mocha";
