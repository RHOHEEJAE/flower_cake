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
          cream: "#F5ECD7",
          terra: "#C8744D",
          bg: "#FDFAF5",
          light: "#EDE0C8",
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
