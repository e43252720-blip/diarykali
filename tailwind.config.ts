import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#f7f8fb",
        accent: {
          DEFAULT: "#4f46e5",
          muted: "#6366f1",
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.05)",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
};

export default config;
