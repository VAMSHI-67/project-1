/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#f3f7f2",
          100: "#dce7d7",
          200: "#b8d0ad",
          300: "#92b783",
          400: "#6d9c5d",
          500: "#4f8242",
          600: "#3c6832",
          700: "#2f5127",
          800: "#233b1d",
          900: "#182714"
        },
        clay: {
          100: "#f7efe7",
          200: "#ead7c2",
          300: "#d8b999",
          400: "#c19a74",
          500: "#a77f57"
        },
        gold: {
          300: "#f8d675",
          400: "#f2c14e",
          500: "#e9ab1b"
        }
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 30px rgba(233, 171, 27, 0.35)",
        glass: "0 20px 60px rgba(20, 30, 20, 0.2)"
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(120deg, rgba(12, 28, 16, 0.85), rgba(46, 83, 58, 0.55), rgba(233, 171, 27, 0.18))"
      }
    }
  },
  plugins: []
};
