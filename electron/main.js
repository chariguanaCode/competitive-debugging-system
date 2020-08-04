const { app, BrowserWindow, session } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

const createWindow = async () => {
    const startUrl =
        process.env.ELECTRON_START_URL ||
        url.format({
            pathname: path.join(__dirname, '../frontend/build/index.html'),
            protocol: 'file:',
            slashes: true,
        });

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            nativeWindowOpen: true,
            enableRemoteModule: true
        },
        show: false,
        frame: false,
    });

    mainWindow.loadURL(startUrl);

    //mainWindow.webContents.openDevTools()

    //mainWindow.setMenu(null)
    /*
    await session.defaultSession.loadExtension(
        '/home/charodziej/.config/chromium/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.8.1_0/'
    );

    await session.defaultSession.loadExtension(
        '/home/charodziej/.config/chromium/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0/'
    );
    */

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
};

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
