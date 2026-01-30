

window.addEventListener('DOMContentLoaded', () => {
  console.log("Preload script loaded");
});

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("geo", {
  fallback: () => ipcRenderer.invoke("fallback-geolocate")
});

