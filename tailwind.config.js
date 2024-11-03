/** @type {import('tailwindcss').Config} */
const mtConfig = require("@material-tailwind/react").mtConfig;

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@material-tailwind/react/**/*.{js,ts,jsx,tsx}",
  ],
    theme: {
      extend: {
       colors: {
         background: "var(--background)",
         foreground: "var(--foreground)",
        },
      },
    },
  plugins: [
    require('flowbite/plugin'),
    mtConfig
  ],
};