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
        ink: {
          DEFAULT: "#070b12",
          50: "#e8edf5",
          100: "#c5d0e0",
          /** Secondary body — ≥4.5:1 on ink-950 */
          200: "#b6c2d4",
          /** Muted labels / footer / subtitles — ≥4.5:1 on ink-950 */
          300: "#a3b4c9",
          /** Tertiary / meta / decorative level nums — ≥4.5:1 on ink-950 */
          400: "#8fa3bc",
          500: "#334155",
          600: "#1e293b",
          700: "#152033",
          800: "#0f172a",
          900: "#0a101c",
          950: "#070b12",
        },
        steel: {
          DEFAULT: "#1a2740",
          light: "#243554",
          dark: "#121c2e",
        },
        signal: {
          /** Button fill — white text ≥4.5:1; do not use as small text on dark */
          DEFAULT: "#2f6fed",
          /** Small text / badges / links on dark — ≥4.5:1 on ink-950 */
          bright: "#5b93ff",
          /** Large decorative numerals (01–04) — solid, ≥3:1 on ink-950 */
          soft: "#6ba0ff",
          dim: "#1e4db8",
        },
        ember: {
          DEFAULT: "#e8a54b",
          dim: "#c4842e",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Segoe UI", "sans-serif"],
      },
      backgroundImage: {
        "grid-steel":
          "linear-gradient(rgba(47,111,237,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(47,111,237,0.06) 1px, transparent 1px)",
        "hero-glow":
          "radial-gradient(ellipse 80% 60% at 70% 20%, rgba(47,111,237,0.22), transparent 55%), radial-gradient(ellipse 50% 40% at 10% 80%, rgba(232,165,75,0.08), transparent 50%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.35)",
        signal: "0 0 0 1px rgba(47,111,237,0.35), 0 8px 24px rgba(47,111,237,0.15)",
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease-out both",
        "fade-in": "fadeIn 0.5s ease-out both",
        "draw-radar": "drawRadar 1.2s ease-out both",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        drawRadar: {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
