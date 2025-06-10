import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      layout: {
        dividerWeight: "1px", 
        disabledOpacity: 0.45, 
        fontSize: {
          tiny: "0.75rem",   // 12px
          small: "0.875rem", // 14px
          medium: "0.9375rem", // 15px
          large: "1.125rem", // 18px
        },
        lineHeight: {
          tiny: "1rem", 
          small: "1.25rem", 
          medium: "1.5rem", 
          large: "1.75rem", 
        },
        radius: {
          small: "6px", 
          medium: "8px", 
          large: "12px", 
        },
        borderWidth: {
          small: "1px", 
          medium: "1px", 
          large: "2px", 
        },
      },
      themes: {
        light: {
          colors: {
            background: {
              DEFAULT: "#f8f8f0" // Fondo crema claro en lugar de blanco
            },
            content1: {
              DEFAULT: "#f9f9f2", // Contenido principal ligeramente más claro que el fondo
              foreground: "#333333"
            },
            content2: {
              DEFAULT: "#f5f5e8", // Contenido secundario
              foreground: "#333333"
            },
            content3: {
              DEFAULT: "#f0f0e0", // Contenido terciario
              foreground: "#333333"
            },
            content4: {
              DEFAULT: "#e8e8d0", // Contenido cuaternario
              foreground: "#333333"
            },
            divider: {
              DEFAULT: "rgba(51, 51, 51, 0.15)" // Divisor sutil
            },
            focus: {
              DEFAULT: "#f01826" // Color de enfoque (rojo)
            },
            foreground: {
              DEFAULT: "#333333", // Texto principal
              50: "#fafafa",
              100: "#f4f4f5",
              200: "#e4e4e7",
              300: "#d4d4d8",
              400: "#a1a1aa",
              500: "#71717a",
              600: "#52525b",
              700: "#3f3f46",
              800: "#27272a",
              900: "#18181b"
            },
            overlay: {
              DEFAULT: "#000000"
            },
            primary: {
              DEFAULT: "#f4ec27", // Amarillo principal
              foreground: "#333333", // Texto sobre amarillo
              50: "#fefde7",
              100: "#fdfbcf",
              200: "#fbf89f",
              300: "#f9f56f",
              400: "#f7f23f",
              500: "#f4ec27", // Color principal
              600: "#e6de0f",
              700: "#c2bb0c",
              800: "#9e9809",
              900: "#7a7507"
            },
            secondary: {
              DEFAULT: "#f01826", // Rojo secundario
              foreground: "#ffffff", // Texto sobre rojo
              50: "#fee7e9",
              100: "#fdd0d3",
              200: "#faa0a7",
              300: "#f8717b",
              400: "#f5414f",
              500: "#f01826", // Color secundario
              600: "#d1111e",
              700: "#ae0e19",
              800: "#8b0b14",
              900: "#68080f"
            },
            success: {
              DEFAULT: "#17c964",
              foreground: "#ffffff",
              50: "#e8faf0",
              100: "#d1f4e0",
              200: "#a2e9c1",
              300: "#74dfa2",
              400: "#45d483",
              500: "#17c964",
              600: "#12a150",
              700: "#0e793c",
              800: "#095028",
              900: "#052814"
            },
            warning: {
              DEFAULT: "#f5a524",
              foreground: "#ffffff",
              50: "#fefce8",
              100: "#fdedd3",
              200: "#fbdba7",
              300: "#f9c97c",
              400: "#f7b750",
              500: "#f5a524",
              600: "#c4841d",
              700: "#936316",
              800: "#62420e",
              900: "#312107"
            },
            danger: {
              DEFAULT: "#f31260",
              foreground: "#ffffff",
              50: "#fee7ef",
              100: "#fdd0df",
              200: "#faa0bf",
              300: "#f871a0",
              400: "#f54180",
              500: "#f31260",
              600: "#c20e4d",
              700: "#920b3a",
              800: "#610726",
              900: "#310413"
            },
            default: {
              DEFAULT: "#e8e8d0",
              foreground: "#333333",
              50: "#fafafa",
              100: "#f5f5f5",
              200: "#e5e5e5",
              300: "#d4d4d4",
              400: "#a3a3a3",
              500: "#737373",
              600: "#525252",
              700: "#404040",
              800: "#262626",
              900: "#171717"
            }
          }
        }
      }
    })
  ]
}
