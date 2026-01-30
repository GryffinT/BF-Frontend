
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fetch = require('node-fetch');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle("fallback-geolocate", async () => {
    try {
      const res = await fetch("https://ipwho.is/");
      const data = await res.json();

      console.log("IPWHO response:", data);

      return {
        lat: data.latitude,
        lng: data.longitude,
        reg: data.region,
        country: data.country,
        city: data.city,
        accuracy: "ip-based"
      };

    } catch (err) {
      console.error("Fallback geolocation error:", err);
      return null;
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

