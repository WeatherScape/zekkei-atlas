import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        atlas: {
          ink: "#020617",
          midnight: "#07111f",
          ocean: "#0a2540",
          cyan: "#67e8f9",
          gold: "#f6d365"
        }
      },
      boxShadow: {
        glow: "0 24px 80px rgba(56, 189, 248, 0.18)",
        glass: "0 20px 70px rgba(2, 6, 23, 0.4)"
      },
      backgroundImage: {
        "atlas-grid":
          "linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px)",
        "night-rim":
          "linear-gradient(135deg, rgba(8, 47, 73, 0.92), rgba(2, 6, 23, 0.96) 45%, rgba(17, 24, 39, 0.94))"
      }
    }
  },
  plugins: []
};

export default config;
