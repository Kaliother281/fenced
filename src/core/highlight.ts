/**
 * Shiki highlighting, fine-grained.
 *
 * We import only the themes and languages we actually offer, and use the
 * JavaScript regex engine instead of the WASM one. That keeps the bundle tight
 * and the whole thing client-side: tokens are emitted as inline styles so the
 * exported HTML needs no theme stylesheet, just the markup.
 */
import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

// themes
import mocha from "@shikijs/themes/catppuccin-mocha";
import macchiato from "@shikijs/themes/catppuccin-macchiato";
import frappe from "@shikijs/themes/catppuccin-frappe";
import latte from "@shikijs/themes/catppuccin-latte";
import githubDark from "@shikijs/themes/github-dark";
import oneDarkPro from "@shikijs/themes/one-dark-pro";
import tokyoNight from "@shikijs/themes/tokyo-night";
import nightOwl from "@shikijs/themes/night-owl";
import nord from "@shikijs/themes/nord";
import dracula from "@shikijs/themes/dracula";
import rosePine from "@shikijs/themes/rose-pine";
import vitesseDark from "@shikijs/themes/vitesse-dark";
import githubLight from "@shikijs/themes/github-light";
import vitesseLight from "@shikijs/themes/vitesse-light";
import rosePineDawn from "@shikijs/themes/rose-pine-dawn";

// languages
import ts from "@shikijs/langs/typescript";
import tsx from "@shikijs/langs/tsx";
import js from "@shikijs/langs/javascript";
import jsx from "@shikijs/langs/jsx";
import htmlLang from "@shikijs/langs/html";
import css from "@shikijs/langs/css";
import json from "@shikijs/langs/json";
import yaml from "@shikijs/langs/yaml";
import bash from "@shikijs/langs/bash";
import python from "@shikijs/langs/python";
import rust from "@shikijs/langs/rust";
import go from "@shikijs/langs/go";
import sql from "@shikijs/langs/sql";
import markdown from "@shikijs/langs/markdown";
import swift from "@shikijs/langs/swift";
import c from "@shikijs/langs/c";
import cpp from "@shikijs/langs/cpp";
import java from "@shikijs/langs/java";
import ruby from "@shikijs/langs/ruby";
import php from "@shikijs/langs/php";
import diff from "@shikijs/langs/diff";

/** Themes offered in the picker. Grouped for the UI; Mocha is the default. */
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

const THEME_MODULES = [
  mocha, macchiato, frappe, latte, githubDark, oneDarkPro, tokyoNight,
  nightOwl, nord, dracula, rosePine, vitesseDark, githubLight, vitesseLight,
  rosePineDawn,
];

const LANG_MODULES = [
  ts, tsx, js, jsx, htmlLang, css, json, yaml, bash, python, rust, go, sql,
  markdown, swift, c, cpp, java, ruby, php, diff,
];

/** Common aliases → canonical Shiki ids that we have loaded. */
const ALIAS: Record<string, string> = {
  ts: "typescript", js: "javascript", py: "python", rb: "ruby",
  sh: "bash", zsh: "bash", shell: "bash", yml: "yaml", "c++": "cpp",
  golang: "go", md: "markdown", text: "plaintext", txt: "plaintext",
};

let instance: HighlighterCore | null = null;
let loading: Promise<HighlighterCore> | null = null;

/** Lazily build (and cache) the singleton highlighter with every theme loaded. */
export async function getHighlighter(): Promise<HighlighterCore> {
  if (instance) return instance;
  if (!loading) {
    loading = createHighlighterCore({
      themes: THEME_MODULES,
      langs: LANG_MODULES,
      engine: createJavaScriptRegexEngine(),
    }).then((hl) => {
      instance = hl;
      return hl;
    });
  }
  return loading;
}

/** The background/foreground a theme paints its code surface with. */
export function getThemeColors(hl: HighlighterCore, theme: string): { bg: string; fg: string } {
  const t = hl.getTheme(theme);
  return { bg: t.bg || "#1e1e2e", fg: t.fg || "#cdd6f4" };
}

/** Resolve a user-written fence language to a loaded Shiki id (or plaintext). */
export function resolveLang(hl: HighlighterCore, lang: string): string {
  const raw = (lang || "").toLowerCase().trim();
  if (!raw) return "plaintext";
  const canonical = ALIAS[raw] ?? raw;
  return hl.getLoadedLanguages().includes(canonical) ? canonical : "plaintext";
}
