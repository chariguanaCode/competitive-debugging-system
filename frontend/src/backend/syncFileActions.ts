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
        let data: string = fs.readFileSync(
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
