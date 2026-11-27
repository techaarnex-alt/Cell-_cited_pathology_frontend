/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  corePlugins: {
    // Disable preflight reset to preserve existing project CSS and avoid conflicts
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
