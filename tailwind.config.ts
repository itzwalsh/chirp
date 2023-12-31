import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        text: "#e9f8fc",
        background: "#0B0E0F",
        primary: "#7c2613",
        secondary: "#031316",
        accent: "#c83d1e",
      },
    },
  },
  plugins: [],
} satisfies Config;
