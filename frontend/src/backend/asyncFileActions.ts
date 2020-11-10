import { parse } from "path";

const fs = window.require('fs');
const path = window.require('path');
const util = window.require('util');
const os = window.require('os');

export const fileExist = (filePath: string) =>
    new Promise((resolve, reject) => {
        fs.access(filePath, fs.constants.F_OK, (err: any) => {
            if (err) {
                return resolve(false);
            }
            resolve(true);
        });
    });

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
            console.log({
                R: filePath,
                data: data,
                err: err,
                dataStr: data.toString(),
            });

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
