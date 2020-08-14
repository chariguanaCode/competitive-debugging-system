const fs = window.require('fs');
const path = window.require('path');
const util = window.require('util');

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
            if (err) {
                return reject(err);
            }
            resolve(true);
        });
    });

export const readFile = (filePath: string) => {
    return new Promise((resolve, reject) => {
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

export const parsePath = (directory: string) => {
    if (!path.isAbsolute(directory)) directory = path.resolve(directory);

    if (directory[directory.length - 1] != '/' && directory[directory.length - 1] != '\\') directory += '/';

    directory = directory.split('\\').join('/');
    return directory;
};
