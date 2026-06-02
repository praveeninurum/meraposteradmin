import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:                   "#a14200",
        "primary-dim":             "#8d3900",
        "primary-container":       "#ffae86",
        "primary-fixed":           "#ffae86",
        "primary-fixed-dim":       "#ff9a65",
        "on-primary":              "#fff7f5",
        "on-primary-container":    "#692900",
        "on-primary-fixed":        "#481900",
        "on-primary-fixed-variant":"#772f00",

        secondary:                  "#6834eb",
        "secondary-dim":            "#5c20df",
        "secondary-container":      "#e8deff",
        "secondary-fixed":          "#e8deff",
        "secondary-fixed-dim":      "#dacdff",
        "on-secondary":             "#fdf7ff",
        "on-secondary-container":   "#5b1edd",
        "on-secondary-fixed":       "#4700bd",
        "on-secondary-fixed-variant":"#652fe7",

        tertiary:                   "#006c5c",
        "tertiary-dim":             "#005e51",
        "tertiary-container":       "#61f4d8",
        "tertiary-fixed":           "#61f4d8",
        "tertiary-fixed-dim":       "#4fe5ca",
        "on-tertiary":              "#e3fff6",
        "on-tertiary-container":    "#00594c",
        "on-tertiary-fixed":        "#00443a",
        "on-tertiary-fixed-variant":"#006455",

        error:                 "#aa371c",
        "error-dim":           "#821a01",
        "error-container":     "#fa7150",
        "on-error":            "#fff7f6",
        "on-error-container":  "#671200",

        surface:                      "#fff8f5",
        "surface-dim":                "#ffd1b2",
        "surface-bright":             "#fff8f5",
        "surface-variant":            "#ffdcc5",
        "surface-tint":               "#a14200",
        "surface-container-lowest":   "#ffffff",
        "surface-container-low":      "#fff1e9",
        "surface-container":          "#ffeade",
        "surface-container-high":     "#ffe3d1",
        "surface-container-highest":  "#ffdcc5",

        "on-surface":         "#4f2907",
        "on-surface-variant": "#845430",
        "on-background":      "#4f2907",
        background:           "#fff8f5",

        outline:         "#a36f48",
        "outline-variant":"#e1a57a",

        "inverse-surface":    "#1c0900",
        "inverse-on-surface": "#bb957c",
        "inverse-primary":    "#fd6c00",
      },
      borderRadius: {
        DEFAULT: "1rem",
        sm:      "0.5rem",
        lg:      "2rem",
        xl:      "3rem",
        full:    "9999px",
      },
      fontFamily: {
        headline: ["var(--font-headline)", "Plus Jakarta Sans", "sans-serif"],
        body:     ["var(--font-body)", "Be Vietnam Pro", "sans-serif"],
        label:    ["var(--font-body)", "Be Vietnam Pro", "sans-serif"],
      },
      boxShadow: {
        float:   "0 8px 24px rgba(79,41,7,0.06)",
        primary: "0 8px 24px rgba(161,66,0,0.22)",
        fab:     "0 12px 32px rgba(161,66,0,0.30)",
      },
    },
  },
  plugins: [],
};
export default config;
