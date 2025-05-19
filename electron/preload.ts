import { ipcRenderer, contextBridge } from "electron";

// Debugging preload
console.log("Preload script is running");

// Log environment variables untuk debugging
console.log("NODE_ENV:", process.env.NODE_ENV);

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args)
    );
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },

  env: {
    API_BASE_URL: process.env.VITE_API_BASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    // Tambahkan variabel lingkungan lain yang dibutuhkan
  },
  login: (payload: { username: string; password: string }) =>
    ipcRenderer.invoke("login", payload),
});

// Tambahkan listener untuk DOM content loaded
window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM content loaded");
});
