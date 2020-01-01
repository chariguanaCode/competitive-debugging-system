const fs = require('fs')

exports.fileExist = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.access(filePath, fs.F_OK, (err) => {
            if (err) {
                return resolve(false);
            }
            resolve(true);
        })
    })
}

exports.saveFile = (filePath, content) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, content, (err) => {
            if (err) reject(err)
            resolve()
        })
    })
}

exports.readFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) reject(err)
            resolve(data)
        })
    })
}