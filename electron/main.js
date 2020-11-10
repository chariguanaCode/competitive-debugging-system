const { app, BrowserWindow, session, dialog } = require('electron');
const path = require('path');
const url = require('url');
const { autoUpdater } = require('electron-updater');

let mainWindow;

const createWindow = async () => {
    if (process.env.ELECTRON_START_URL) {
        const extensions = [
            'C:\\Users\\LegwanXDL\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\fmkadmapgofadopljbjfkapdkoienihi\\4.8.2_0',
            '/home/charodziej/snap/chromium/common/chromium/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0/',
            '/home/charodziej/snap/chromium/common/chromium/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.8.2_0/',
        ];
        for (const extension of extensions) {
            try {
                console.log(await session.defaultSession.loadExtension(extension));
            } catch (err) {
                console.log(err);
            }
        }
    }

    const startUrl =
        process.env.ELECTRON_START_URL ||
        url.format({
            pathname: path.join(__dirname, '..', 'frontend', 'build', 'index.html'),
            protocol: 'file:',
            slashes: true,
        });

    mainWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        },
        show: false,
        frame: false,
        icon: path.join(__dirname, 'buildResources', 'icon.png'),
    });

    mainWindow.loadURL(startUrl);

    mainWindow.once('ready-to-show', () => {
        mainWindow.maximize()
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};

app.on('ready', createWindow);

app.allowRendererProcessReuse = false; //https://github.com/electron/electron/issues/22119

global.paths = {
    cdsData: `${app.getPath('userData')}/CDSData`,
    configFile: `${app.getPath('userData')}/CDSData/Config.cds`,
    notSavedProjects: `${app.getPath('userData')}/CDSData/NotSavedProjects`,
    cppFiles: process.env.ELECTRON_START_URL
        ? path.join(__dirname, '..', 'cpp')
        : path.join(__dirname, '..', '..', '..', 'cpp'),
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
    // workaround for https://github.com/electron-userland/electron-builder/issues/4046
    if (process.env.DESKTOPINTEGRATION === 'AppImageLauncher') {
        process.env.APPIMAGE = process.env.ARGV0;
    }

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
