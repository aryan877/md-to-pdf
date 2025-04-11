/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        "primary-dark": "var(--primary-dark)",
        secondary: "var(--secondary)",
        muted: "var(--muted)",
        border: "var(--border)",
        "card-bg": "var(--card-bg)",
      },
      fontFamily: {
        montserrat: ["var(--font-montserrat)"],
        inter: ["var(--font-inter)"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(89, 29, 221, 0.4)",
        card: "0px -2px 40px rgba(187, 155, 255, 0.15), 0px -2px 10px rgba(233, 223, 255, 0.3), inset 0px 0.5px 0px rgba(255, 255, 255, 0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
