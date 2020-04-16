const fs = window.require('fs')
const path = window.require('path')

export const fileExist = (filePath: string) => {
    return new Promise((resolve, reject) => {
        fs.access(filePath, fs.constants.F_OK, (err: any) => {
            if (err) {
                return resolve(false)
            }
            resolve(true)
        })
    })
}

export const saveFile = (filePath: string, content: any) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, content, (err: any) => {
            if (err) reject(err)
            resolve()
        })
    })
}

export const readFile = (filePath: string) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err: any, data: string) => {
            if (err) reject(err)
            resolve(data)
        })
    })
}

export const isDirectory = async (directory: string) => {
    try {
        let stat = fs.lstatSync(path);
        return stat.isDirectory();
    } catch (e) {
        return false;
    }
}

export const parsePath = (directory: string) => {
    if (
        directory[directory.length - 1] != '/' &&
        directory[directory.length - 1] != '\\'
    )
        directory += '/'
    if (!path.isAbsolute(directory))
        directory = path.resolve(directory)
    directory = directory.split('\\').join('/')
    return directory
}
