/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- Dark Premium Backgrounds ---
        "background": "#000000",
        "on-background": "#fafafa",
        
        "surface": "#0a0a0a",
        "on-surface": "#ffffff",
        "surface-variant": "#18181b",
        "on-surface-variant": "#a1a1aa",
        
        "surface-container-lowest": "#000000",
        "surface-container-low": "#18181b",
        "surface-container": "#27272a",
        "surface-container-high": "#3f3f46",
        "surface-container-highest": "#52525b",
        
        // --- Structural UI elements ---
        "outline": "#52525b",
        "outline-variant": "#27272a",
        
        // --- Accents (Orange Glow, Red, etc) ---
        "primary": "#c2652a",
        "on-primary": "#ffffff",
        "primary-container": "#e08850",
        "on-primary-container": "#ffffff",
        "primary-fixed": "#3f1a08",
        "primary-fixed-dim": "#f0a878",
        "on-primary-fixed": "#fbe8d8",
        "on-primary-fixed-variant": "#c2652a",

        "secondary": "#a1a1aa",
        "on-secondary": "#ffffff",
        "secondary-container": "#27272a",
        "on-secondary-container": "#fafafa",
        
        "tertiary": "#8c3c3c",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#3a2020",
        "on-tertiary-container": "#fce4e0",
        
        "error": "#ef4444",
        "on-error": "#000000",
        "error-container": "#7f1d1d",
        "on-error-container": "#fef2f2",
        
        // --- Extras ---
        "inverse-surface": "#fafafa",
        "inverse-on-surface": "#09090b",
        "inverse-primary": "#f0a878",
      },
      borderRadius: {
        "DEFAULT": "0.375rem", // 6px
        "lg": "0.5rem", // 8px
        "xl": "0.75rem", // 12px
        "2xl": "1rem", // 16px
        "3xl": "1.5rem", // 24px
        "full": "9999px"
      },
      boxShadow: {
        'glow': '0 0 20px -5px rgba(194, 101, 42, 0.4)', // Primary glow
        'glow-lg': '0 0 40px -10px rgba(194, 101, 42, 0.4)',
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        "headline": ["EB Garamond", "serif"],
        "body": ["Manrope", "sans-serif"],
        "label": ["Manrope", "sans-serif"],
        "serif": ["EB Garamond", "serif"],
        "sans": ["Manrope", "sans-serif"]
      }
    },
  },
  plugins: [],
}
