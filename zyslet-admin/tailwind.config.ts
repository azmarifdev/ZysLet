import type {Config} from "tailwindcss";

const config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
    ],
    prefix: "",
    theme: {
        extend: {
            boxShadow: {
                custom: "0px 4px 17.6px 0px rgba(40, 99, 132, 0.26)",
            },
            colors: {
                primary: "#155dfc",
                white: "#FAFCFF",
                black: "#212121",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
