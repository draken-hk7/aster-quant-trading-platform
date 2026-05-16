import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#07090d",
        panel: "#0d1218",
        line: "rgba(180, 194, 210, 0.16)",
        buy: "#21c17a",
        sell: "#ff5567",
        amber: "#f5b942"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular"]
      },
      boxShadow: {
        terminal: "0 20px 80px rgba(0, 0, 0, 0.38)"
      }
    }
  },
  plugins: []
};

export default config;

