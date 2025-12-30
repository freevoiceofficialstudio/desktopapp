
const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 750,
    minWidth: 900,
    minHeight: 650,
    frame: false, // Custom window controls use karega
    transparent: false,
    backgroundColor: '#020617',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets/logo.png') // Aapka logo yahan icon banega
  });

  // Production mein build folder load hoga, dev mein localhost
  mainWindow.loadURL('https://freevoice-3.web.app'); 

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// System Tray Setup (Background mein chalne ke liye)
app.whenReady().then(() => {
  createWindow();

  tray = new Tray(path.join(__dirname, 'assets/logo.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open Free Voice', click: () => mainWindow.show() },
    { label: 'Mute Engine', type: 'checkbox', checked: false },
    { type: 'separator' },
    { label: 'Quit App', click: () => app.quit() }
  ]);
  tray.setToolTip('Free Voice Engine');
  tray.setContextMenu(contextMenu);
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
