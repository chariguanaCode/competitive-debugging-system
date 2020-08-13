const { app, BrowserWindow, session, dialog } = require('electron');
const path = require('path');
const url = require('url');
const { autoUpdater } = require('electron-updater');

let mainWindow;

const createWindow = async () => {
    const startUrl =
        process.env.ELECTRON_START_URL ||
        url.format({
            pathname: path.join(__dirname, '..', 'frontend', 'build', 'index.html'),
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
            enableRemoteModule: true,
        },
        show: false,
        frame: false,
        icon: path.join(__dirname, 'buildResources', 'icon.png'),
    });

    mainWindow.loadURL(startUrl);

    //mainWindow.webContents.openDevTools()

    //mainWindow.setMenu(null)
    /*
    await session.defaultSession.loadExtension(
        '/home/charodziej/snap/chromium/common/chromium/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.8.2_0/'
    );

    await session.defaultSession.loadExtension(
        '/home/charodziej/snap/chromium/common/chromium/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0/'
    );
    */

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
};

autoUpdater.on('update-available', async (info) => {
    const { response } = await dialog.showMessageBox({
        type: 'question',
        message: `An update is available. Would you like to download version ${info.version} from ${info.releaseDate}?`,
        buttons: ['Yes', 'No'],
        cancelId: 1,
    });

    if (response === 0) {
        autoUpdater.downloadUpdate();
    }
});

autoUpdater.on('update-downloaded', async (info) => {
    const { response } = await dialog.showMessageBox({
        type: 'question',
        message: `Update downloaded. It will be installed after you quit the app. Quit now?`,
        buttons: ['Yes', 'No'],
        cancelId: 1,
    });

    if (response === 0) {
        autoUpdater.quitAndInstall();
    }
});

autoUpdater.on('error', (error) => {
    console.log(error);
});

app.on('ready', () => {
    autoUpdater.checkForUpdates().catch(() => {});
    createWindow();
});

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
