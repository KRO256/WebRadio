const { app, BrowserWindow, Tray, Menu } = require("electron");
const path = require("path");

let win = null;
let tray = null;
let isQuiting = false;

function createWindow() {
  win = new BrowserWindow({
    width: 960,
    height: 540,
    show: true,
    webPreferences: {
      contextIsolation: true,
      alwaysOnTop: true,
      resizable: false,
      frame: false
    }
  });

  win.loadFile("index.html");

  win.on("close", (e) => {
    if (!isQuiting) {
      e.preventDefault();
      win.hide();
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  tray = new Tray(path.join(__dirname, "trayicon.png"));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "表示",
      click: () => {
        win.show();
      }
    },
    {
      label: "終了",
      click: () => {
        isQuiting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip("Web Radio");
  tray.setContextMenu(contextMenu);

  tray.on("double-click", () => {
    win.show();
  });
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  } else {
    win.show();
  }
});

app.on("before-quit", () => {
  isQuiting = true;
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});