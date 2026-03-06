import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#2C1A0E",
          cream: "#E8E3DA",
          terra: "#C6A97E",
          bg: "#FAF9F6",
          light: "#E8E3DA",
          muted: "#BFBEB8",
          sage: "#A7B7A5",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        border: "var(--border)",
      },
      fontFamily: {
        serif: ['var(--font-noto-serif-kr)', "serif"],
        sans: ['var(--font-noto-sans-kr)', "sans-serif"],
      },
    },
  },
  plugins: [],
}

export default config
