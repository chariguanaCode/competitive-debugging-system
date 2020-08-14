const fs = window.require('fs');
const path = window.require('path');
const util = window.require('util');

export const fileExist = (filePath: string) => {
    return new Promise((resolve, reject) => {
        fs.access(filePath, fs.constants.F_OK, (err: any) => {
            if (err) {
                return resolve(false);
            }
            resolve(true);
        });
    });
};
/*
TODO: very strange error, empty file is created, sometimes it works
https://stackoverflow.com/questions/31572484/node-fs-writefile-creates-a-blank-file (when using not sync)
*/
export const saveFile = (filePath: string, content: any) => fs.writeFileSync(filePath, content);

export const readFile = (filePath: string) => {
    return new Promise((resolve, reject) => {
        console.log('xd')
        fs.readFile(filePath, 'utf8', (err: any, data: string) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

export const isDirectory = async (directory: string) => {
    try {
        let stat = await util.promisify(fs.lstat(directory));
        return stat.isDirectory();
    } catch (e) {
        return false;
    }
};

export const parsePath = (directory: string) => {
    if (!path.isAbsolute(directory)) directory = path.resolve(directory);

    if (directory[directory.length - 1] != '/' && directory[directory.length - 1] != '\\') directory += '/';

    directory = directory.split('\\').join('/');
    return directory;
};
