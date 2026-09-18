/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // These resolve to CSS custom properties defined in index.css, which
        // flip between a dark (default) and light palette via the ".light"
        // class on <html>. Components never need dark:/light: variants —
        // e.g. `bg-surface` is always "correct" for the active theme.
        surface: {
          DEFAULT: "rgb(var(--bg) / <alpha-value>)",
          panel: "rgb(var(--bg-panel) / <alpha-value>)",
          raised: "rgb(var(--bg-raised) / <alpha-value>)",
          border: "rgb(var(--border) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--text) / <alpha-value>)",
          muted: "rgb(var(--text-muted) / <alpha-value>)",
          faint: "rgb(var(--text-faint) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          hover: "rgb(var(--accent-hover) / <alpha-value>)",
          soft: "rgb(var(--accent-soft) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["Sora", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,0.24), 0 8px 24px -12px rgba(0,0,0,0.4)",
      },
      keyframes: {
        pulseDot: {
          "0%, 80%, 100%": { transform: "scale(0.6)", opacity: "0.4" },
          "40%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        pulseDot: "pulseDot 1.2s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};
