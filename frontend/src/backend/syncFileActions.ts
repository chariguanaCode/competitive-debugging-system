const fs = window.require('fs');
const path = window.require('path');
const util = window.require('util');

export const fileExist = (filePath: string) => fs.existsSync(filePath);
/*
TODO: very strange error, empty file is created, sometimes it works
https://stackoverflow.com/questions/31572484/node-fs-writefile-creates-a-blank-file (when using not sync)
*/
export const saveFile = (filePath: string, content: any) => fs.writeFileSync(filePath, content);

export const readFile = (filePath: string) => {
    return new Promise((resolve, reject) => {
        let data = fs.readFileSync(
            filePath,
            'utf8'
        ); /*, (err: any, data: string) => {
            if (err) reject(err);
            resolve(data);
        });*/
        resolve(data);
    });
};

export const isDirectory = async (path: string) => {
    let stats;
    try {
        stats = fs.statSync(path);
    } catch {
        return false;
    } finally {
        if (!stats) return false;
        return stats.isDirectory();
    }
};

export const parsePath = (directory: string) => {
    if (directory[directory.length - 1] != '/' && directory[directory.length - 1] != '\\') directory += '/';

    if (!path.isAbsolute(directory)) directory = path.resolve(directory);
    /* if((homePath[homePath.length-1]!=="/" || homePath[homePath.length-1]!=="\") && (directory[0]!=='/' || directory[0]!=='\\'))directory = '/' + directory;
            directory = homePath + directory;
            TODO: default home path (in settings), now it's backend directory
        */

    directory = directory.split('\\').join('/');
    return directory;
};
