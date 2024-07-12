import type { Config } from "tailwindcss";

const textSizeRange = Object.fromEntries(
	Array.from(Array(50)).map((_, i) => [`${i}`, `${i}px`])
);
const lineHeightRange = Object.fromEntries(
	Array.from(Array(100)).map((_, i) => [`${i}`, `${i}px`])
);

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			boxShadow: {
				common: "0px 0px 10px rgba(255, 255, 255, 0.30)",
			},
			borderRadius: {
				common: "10px",
			},
			fontSize: textSizeRange,
			lineHeight: lineHeightRange,
		},
	},
	plugins: [],
};
export default config;
