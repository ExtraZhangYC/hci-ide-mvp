/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        // Console surfaces — remapped onto the existing `ink` scale so the
        // whole app inherits the new base without touching every class.
        ink: {
          950: "#090b10", // void / app base
          900: "#0e121a", // deck / sidebar
          850: "#121724", // panel / card
          800: "#19202e",
          700: "#222b3c",
          600: "#2e394d",
        },
        line: {
          DEFAULT: "#1e2636",
          bright: "#2a3346",
        },
        // Command azure — routine machine actions, selection, "active"
        command: {
          DEFAULT: "#4d8df0",
          soft: "#6fa3f4",
          deep: "#2f6fd6",
        },
        // Human amber — reserved for human-authority moments only
        human: {
          DEFAULT: "#ffb454",
          soft: "#ffc880",
          deep: "#e8932c",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(77,141,240,0.35), 0 0 22px -6px rgba(77,141,240,0.55)",
        "glow-human":
          "0 0 0 1px rgba(255,180,84,0.4), 0 0 22px -6px rgba(255,180,84,0.6)",
        panel: "0 10px 30px -18px rgba(0,0,0,0.8)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        blink: {
          "0%, 45%": { opacity: "1" },
          "55%, 100%": { opacity: "0.25" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out",
        "pulse-ring": "pulse-ring 1.6s ease-in-out infinite",
        blink: "blink 1.4s steps(1, end) infinite",
      },
    },
  },
  plugins: [],
};
