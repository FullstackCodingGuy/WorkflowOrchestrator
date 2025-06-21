import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // CSS Variables for theme support
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: {
          DEFAULT: "var(--muted-foreground)",
          foreground: "var(--muted-foreground)",
        },
        card: {
          DEFAULT: "var(--card-bg)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover-bg)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          hover: "var(--primary-hover)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
          hover: "var(--secondary-hover)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
          hover: "var(--accent-hover)",
        },
        border: "var(--border-color)",
        input: {
          DEFAULT: "var(--input-bg)",
          border: "var(--input-border)",
        },
        ring: "var(--ring-color)",
        sidebar: "var(--sidebar-bg)",
        header: {
          DEFAULT: "var(--header-bg)",
          foreground: "var(--header-foreground)",
        },
        toolbar: "var(--toolbar-bg)",
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      fontSize: {
        'xs-plus': '0.8125rem', // 13px - between xs and sm
      },
      borderRadius: {
        'lg-plus': '10px',
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
} satisfies Config;
