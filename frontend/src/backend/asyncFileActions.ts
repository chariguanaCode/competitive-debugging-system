import { parse } from "path";

const fs = window.require('fs');
const path = window.require('path');
const util = window.require('util');
const os = window.require('os');
const Diff = require('diff');

export const compareFiles = async (filePath1: string, filePath2: string, returnBoolean = false) => {
    const fileString1 = (await readFile(filePath1)).toString();
    const fileString2 = (await readFile(filePath2)).toString();

    const diff = await Diff.diffTrimmedLines(fileString1, fileString2);

    if(returnBoolean)
        return diff.length <= 1;

    return 0;
}

export const fileExist = (filePath: string) =>
    new Promise((resolve, reject) => {
        fs.access(filePath, fs.constants.F_OK, (err: any) => {
            if (err) {
                return resolve(false);
            }
            resolve(true);
        });
    });

    // TO DO: CHANGE TO PROMISE
export const getFileBasename = (filePath: string) => {
    const parsedPath = parsePath(filePath);
    return path.basename(parsedPath);
}

export const saveFile = (filePath: string, content: any) =>
    new Promise((resolve, reject) => {
        fs.writeFile(filePath, content, (err: any) => {
            //console.log('W', filePath, content, err);
            if (err) {
                return reject(err);
            }
            resolve(true);
        });
    });

export const readFile = (filePath: string) => {
    return new Promise((resolve: (data: string) => void, reject) => {
        fs.readFile(filePath, 'utf-8', (err: any, data: string) => {
            /*console.log({
                R: filePath,
                data: data,
                err: err,
                dataStr: data.toString(),
            });*/

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
export const createDirectory = (directoryPath: string) =>
    new Promise((resolve, reject) => {
        let path = parsePath(directoryPath);
        fileExist(path).then((result) =>
            result
                ? reject('Directory already exists')
                : fs.mkdir(path, (err: any) => {
                      if (err) reject(err);
                      resolve('Success');
                  })
        );
    });

export const removeDirectory = (directoryPath: string) =>
    new Promise((resolve, reject) => {
        let path = parsePath(directoryPath);
        fileExist(path).then((result) =>
            result
                ? fs.rmdir(path, { recursive: true }, (err: any) => {
                    if (err) reject(err);
                    resolve('Success');
                })
                : reject("Directory doesn't exist")
        );
    });

export const getSystemRootPath = () => {
    if (os.platform() == 'win32') {
        const road = path.relative('C:/', '/');
        if (!road.length) return 'C:/';
        return road;
    } else return '/';
};

export const parsePath = (directory: string, followingSeparator?: boolean) => {
    let parsedPath = path.normalize(directory + '/');
    if (!path.isAbsolute(parsedPath)) parsedPath = path.resolve(parsedPath);
    parsedPath = parsedPath.split('\\').join('/');
    if (parsedPath[0] === '/' && os.platform() == 'win32') parsedPath = getSystemRootPath() + parsedPath.slice(1);
    parsedPath = parsedPath.split('\\').join('/');
    if (followingSeparator && parsedPath[parsedPath.length - 1] !== '/') parsedPath += '/';
    else if(!followingSeparator && parsedPath[parsedPath.length - 1] === '/') parsedPath = parsedPath.slice(0,-1)
    return parsedPath
};
