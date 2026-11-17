import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        ovo: ["var(--font-ovo)", "serif"],
        legan: ["var(--font-legan)", "serif"],
        wonder: ["var(--font-wonder)", "sans-serif"],
        thesignature: ["var(--font-thesignature)", "serif"],
        dancing: ["var(--font-dancing)", "cursive"],
        "great-vibes": ["var(--font-great-vibes)", "cursive"],
        cormorant: ["var(--font-cormorant)", "serif"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
        playfair: ["var(--font-playfair)", "serif"],
        alex: ["var(--font-alex)", "cursive"],
        madi: ["var(--font-dancing)", "cursive"],
        lligat: ["var(--font-lligat)", "sans-serif"],
        combo: ["var(--font-combo)", "sans-serif"],
      },
      colors: {
        cream: "#f5f0e8",
        "cream-dark": "#ede5d5",
        gold: "#b8976a",
        "gold-light": "#d4b896",
        brown: "#6b4f35",
        "brown-dark": "#4a3425",
        "text-wedding": "#3d2b1f",
        taupe: "#928573",
        "taupe-light": "#9E9180",
        beige: "#E1D6C7",
        mocha: "#B3A99C",
        smoke: "#ECECEC",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        upDown: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(60px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        upDown: "upDown 1s ease-in-out infinite",
        marquee: "marquee 25s linear infinite",
        fadeIn: "fadeIn 0.5s ease-out forwards",
        slideInRight: "slideInRight 0.35s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
