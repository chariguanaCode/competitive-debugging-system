const fs = window.require('fs')

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
