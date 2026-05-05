import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        golfBlue: "#00aaff",
        golfOrange: "#ff8200",
        golfNavy: "#003c70",
        golfCyan: "#03face",
      },
      boxShadow: {
        soft: "0 18px 60px rgba(0, 60, 112, 0.10)",
      },
    },
  },
  plugins: [],
};
export default config;
