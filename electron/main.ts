import { app, BrowserWindow, ipcMain, shell } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import dotenv from "dotenv";
import { existsSync } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Tambahkan debugging untuk melihat paths

dotenv.config();
// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

// Logging path penting

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      devTools: true,
      nodeIntegration: false,
      contextIsolation: true,
    },
    frame: true,
    autoHideMenuBar: true,
    titleBarStyle: "default",
    resizable: true,
  });

  // Maksimalkan window setelah dibuat
  win.maximize();

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Tambahkan event listener untuk mendeteksi kegagalan loading
  win.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
    console.error(
      "Failed to load window content:",
      errorCode,
      errorDescription
    );
  });

  // Tambahkan debugging untuk path yang dimuat
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    const indexHtmlPath = path.join(RENDERER_DIST, "index.html");
    const absoluteIndexHtmlPath = path.resolve(indexHtmlPath);

    // Cek apakah file index.html ada
    if (!existsSync(absoluteIndexHtmlPath)) {
      console.error("index.html does NOT exist at path!");
      // Coba cari file index.html di lokasi lain
      // console.log("Current directory files:", readdirSync(process.cwd())); // Keeping this commented out in case it's needed for future debugging
    }

    win.loadFile(absoluteIndexHtmlPath);
  }
}

app.whenReady().then(() => {
  createWindow();

  // Tambahkan listener untuk membuka URL eksternal
  ipcMain.on("open-external-url", (event, url) => {
    shell.openExternal(url);
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// app.whenReady().then(createWindow); // Pindahkan ini ke bagian manipulasi menu
