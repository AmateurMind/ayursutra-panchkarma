/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': '#10B981', // Emerald green for Ayurveda
        'secondary': '#F59E0B', // Golden yellow
        'accent': '#059669', // Darker green
        'earth': '#92400E', // Earth brown
        'sage': '#6B7280' // Sage gray
      },
      gridTemplateColumns: {
        auto: "repeat(auto-fill, minmax(200px, 1fr))",
      },
    },
  },
  plugins: [],
};
