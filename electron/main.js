const { app, BrowserWindow, session, dialog } = require('electron');
const path = require('path');
const url = require('url');
const { autoUpdater } = require('electron-updater');
const ProgressBar = require('electron-progressbar');
const electronLogger = require('electron-log');
autoUpdater.logger = electronLogger;
autoUpdater.logger.transports.file.level = 'info';

let mainWindow;
let updateProgressBar;

autoUpdater.autoDownload = false;

const createWindow = async () => {
    if (process.env.ELECTRON_START_URL) {
        const extensions = [
            'C:\\Users\\LegwanXDL\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\fmkadmapgofadopljbjfkapdkoienihi\\4.10.0_0',
            'C:\\Users\\LegwanXDL\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\baocaagndhipibgklemoalmkljaimfdj\\2.0.5_0',
            //  'C:\\Users\\LegwanXDL\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\lmhkpmbekcpmknklioeibfkpmmfibljd\\2.17.0_0',
            '/home/charodziej/snap/chromium/common/chromium/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0/',
            '/home/charodziej/snap/chromium/common/chromium/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.10.1_0/',
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
        mainWindow.maximize();
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
    testsOutputs: `${app.getPath('userData')}/CDSData/TestsOutputs`,
};

autoUpdater.on('update-available', async (info) => {
    const { response } = await dialog.showMessageBox({
        type: 'question',
        message: `An update is available. Would you like to download version ${info.version} from ${info.releaseDate}?`,
        buttons: ['Yes', 'No'],
        cancelId: 1,
    });

    if (response === 0) {
        updateProgressBar = new ProgressBar({
            indeterminate: false,
            text: 'Downloading update...',
            title: 'Downloading update...',
            closeOnComplete: true,
        });

        updateProgressBar.on('completed', () => {
            updateProgressBar.detail = 'Download finished.';
        });
        autoUpdater.downloadUpdate();
    }
});

autoUpdater.on('download-progress', (info) => {
    updateProgressBar.value = info.percent;
    updateProgressBar.detail = `Downloaded ${info.percent.toFixed(2)}% (${info.transferred} / ${info.total}). Download speed: ${
        info.bytesPerSecond / 1000
    } kB/s`;
});

autoUpdater.on('update-downloaded', async (info) => {
    // workaround for https://github.com/electron-userland/electron-builder/issues/4046
    updateProgressBar.setCompleted();
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

// workaround for 'download-progress' event not triggering https://gist.github.com/the3moon/0e9325228f6334dabac6dadd7a3fc0b9
// issue https://github.com/electron-userland/electron-builder/issues/2521
let diffDown = {
    percent: 0,
    bytesPerSecond: 0,
    total: 0,
    transferred: 0,
};
let diffDownHelper = {
    startTime: 0,
    lastTime: 0,
    lastSize: 0,
};
electronLogger.hooks.push((msg, transport) => {
    if (transport !== electronLogger.transports.console) {
        return msg;
    }

    let match = /Full: ([\d\,\.]+) ([GMKB]+), To download: ([\d\,\.]+) ([GMKB]+)/.exec(msg.data[0]);
    if (match) {
        let multiplier = 1;
        if (match[4] == 'KB') multiplier *= 1024;
        if (match[4] == 'MB') multiplier *= 1024 * 1024;
        if (match[4] == 'GB') multiplier *= 1024 * 1024 * 1024;

        diffDown = {
            percent: 0,
            bytesPerSecond: 0,
            total: Number(match[3].split(',').join('')) * multiplier,
            transferred: 0,
        };
        diffDownHelper = {
            startTime: Date.now(),
            lastTime: Date.now(),
            lastSize: 0,
        };
        return msg;
    }

    match = /download range: bytes=(\d+)-(\d+)/.exec(msg.data[0]);
    if (match) {
        const currentSize = Number(match[2]) - Number(match[1]);
        const currentTime = Date.now();
        const deltaTime = currentTime - diffDownHelper.startTime;

        diffDown.transferred += diffDownHelper.lastSize;
        diffDown.bytesPerSecond = Math.floor((diffDown.transferred * 1000) / deltaTime);
        diffDown.percent = (diffDown.transferred * 100) / diffDown.total;

        diffDownHelper.lastSize = currentSize;
        diffDownHelper.lastTime = currentTime;

        updateProgressBar.value = diffDown.percent;
        updateProgressBar.detail = `Downloaded ${diffDown.percent.toFixed(2)}% (${Math.floor(
            diffDown.transferred / 1000
        )} / ${Math.floor(diffDown.total / 1000)} kB). Download speed: ${Math.floor(diffDown.bytesPerSecond / 1000)} kB/s`;

        return msg;
    }
    return msg;
});
