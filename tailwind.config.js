/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          // VoteSmart Professional Palette: Deep Blue
          main: "#1E3A8A", // Deep Blue
          hover: "#1C357A", // Slightly darker blue for hover
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          // VoteSmart Professional Palette: Accent Color (e.g., Green)
          main: "#10B981", // Emerald Green
          hover: "#0F9D6B",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // VoteSmart specific theme colors
        votesmart: {
          blue: {
            deep: "#1E3A8A",
            medium: "#2563EB",
            light: "#DBEAFE",
          },
          gray: {
            dark: "#374151",
            medium: "#6B7280",
            light: "#F3F4F6",
            extralight: "#F9FAFB",
          },
          green: { // Accent
            DEFAULT: "#10B981", 
            hover: "#0F9D6B",
            light: "#D1FAE5",
          },
          purple: { // Alternative Accent
            DEFAULT: "#8B5CF6",
            hover: "#7C3AED",
            light: "#EDE9FE",
          }
        },
        // Dark Mode specific
        darkBackground: "#121212",
        darkText: "#E0E0E0",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-fast": {
          "0%, 100%": { opacity: 1, transform: "scale(1)" },
          "50%": { opacity: 0.7, transform: "scale(1.02)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 3s ease-in-out infinite",
        "pulse-fast": "pulse-fast 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      fontFamily: {
        sans: ['var(--font-family)', 'Inter', 'Roboto', 'Open Sans', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        opensans: ['Open Sans', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        // Add a dyslexic-friendly font if you import one, e.g., OpenDyslexic
        // opendyslexic: ['OpenDyslexic', 'sans-serif'], 
      },
      fontSize: {
        'xs': '0.75rem', // 12px
        'sm': '0.875rem', // 14px
        'base': '1rem', // 16px (default)
        'lg': '1.125rem', // 18px
        'xl': '1.25rem', // 20px (Headings H3-ish)
        '2xl': '1.5rem', // 24px (Headings H2-ish)
        '3xl': '1.875rem', // 30px (Headings H1-ish)
        '4xl': '2.25rem', // 36px
        '5xl': '3rem', // 48px
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}