import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff4f2",
          100: "#ffe3df",
          500: "#e83f36",
          600: "#c82f29",
          700: "#9f211d"
        },
        accent: {
          yellow: "#ffd84d",
          blue: "#2866c7"
        },
        ink: "#17223b",
        line: "#e3d7cf"
      },
      boxShadow: {
        soft: "0 12px 32px rgba(23, 32, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
