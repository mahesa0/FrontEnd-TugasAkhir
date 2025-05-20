import { defineConfig } from "vite";
import path from "node:path";
import electron from "vite-plugin-electron/simple";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dotenv from "dotenv";

dotenv.config(); // Load .env file

// Baca URL backend
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    electron({
      main: {
        // Shortcut of `build.lib.entry`.
        entry: "electron/main.ts",
        onstart(options) {
          options.startup();
        },
        vite: {
          build: {
            outDir: "dist-electron",
            minify: false, // Better for debugging
            sourcemap: "inline",
            // Make sure we can import node modules
            rollupOptions: {
              external: [
                "electron",
                "electron-devtools-installer",
                "fs",
                "path",
                "os",
                "url",
                "dotenv",
              ],
            },
          },
        },
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`.
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: path.join(__dirname, "electron/preload.ts"),
        vite: {
          build: {
            outDir: "dist-electron",
            minify: false,
            sourcemap: "inline",
          },
        },
      },
      // Polyfill the Electron and Node.js API for Renderer process.
      // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
      // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
      renderer: {}, // Always enable renderer
    }),
    tailwindcss(),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    // Pastikan asset dimuat dengan benar
    assetsDir: "assets",
    // Tambahkan ini untuk memastikan HTML diproses dengan benar
    // dan mempertahankan semua aset
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: "[name].[hash].js",
        chunkFileNames: "[name].[hash].js",
        assetFileNames: "[name].[hash].[ext]",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Definisikan env variables dengan benar
  define: {
    "process.env": {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      VITE_API_BASE_URL: JSON.stringify(process.env.VITE_API_BASE_URL),
    },
  },
  // Pastikan base URL tepat untuk produksi
  base: "./",
  server: {
    proxy: {
      // Mengarahkan permintaan ke /users/* dari dev server ke backend Vercel
      "/users": {
        target: process.env.VITE_API_BASE_URL,
        changeOrigin: true,
        secure: false,
        // Jika backend Anda tidak mengharapkan path prefix /users, gunakan rewrite:
        // rewrite: (path) => path.replace(/^\/users/, ''),
      },
    },
  },
});
