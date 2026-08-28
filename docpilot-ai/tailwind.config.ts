import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f0ff",
          100: "#e6e1ff",
          200: "#cabdff",
          300: "#a892ff",
          400: "#8b6bff",
          500: "#7042ff",
          600: "#5f2be0",
          700: "#4d20b8",
          800: "#3d1c8f",
          900: "#301970",
          950: "#1c0e47"
        },
        ink: {
          50: "#f6f7f9",
          100: "#eceef2",
          200: "#d5d9e2",
          300: "#aeb5c4",
          400: "#828ba0",
          500: "#636d85",
          600: "#4d566c",
          700: "#3f4658",
          800: "#2a2f3c",
          900: "#181b24",
          950: "#0c0e13"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-cal)", "system-ui", "sans-serif"]
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "gradient-x": "gradientX 8s ease infinite",
        "shimmer": "shimmer 2s linear infinite"
      },
      keyframes: {
        fadeUp: { "0%": { opacity: "0", transform: "translateY(24px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-14px)" } },
        gradientX: { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        shimmer: { "0%": { backgroundPosition: "-1000px 0" }, "100%": { backgroundPosition: "1000px 0" } }
      },
      boxShadow: {
        glow: "0 0 60px -15px rgba(112, 66, 255, 0.5)",
        card: "0 2px 8px rgba(16, 24, 40, 0.06), 0 1px 2px rgba(16,24,40,0.04)"
      }
    },
  },
  plugins: [],
};
export default config;
