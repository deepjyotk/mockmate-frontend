// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f7fafc", // Neutral light background
        foreground: "#1a202c", // Darker text for readability
        primary: "#2563eb",    // Slightly desaturated blue
        danger: "#dc2626",     // Softer red
        muted: "#a0aec0",      // Warmer gray for subtext
        secondary: "#10b981",  // Green for complementary accents
      },
    },
  },
  plugins: [],
};

export default config;
