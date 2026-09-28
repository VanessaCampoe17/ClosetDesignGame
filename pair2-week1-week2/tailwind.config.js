/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1e2530",
        linen: "#f7f2eb",
        clay: "#b85f47",
        moss: "#516b58",
        denim: "#2f5f7f",
        plum: "#624760"
      },
      boxShadow: {
        drawer: "0 18px 60px rgba(30, 37, 48, 0.18)"
      }
    }
  },
  plugins: []
};
