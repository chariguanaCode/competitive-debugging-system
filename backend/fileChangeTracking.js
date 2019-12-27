const fs  = require('fs')
const md5 = require('md5')

exports.track = (filename, callback, error) => {
    let md5Previous = null
    let fsWait = false
    //callback()
    try {
        return fs.watch(filename, (event, file) => {
            if (file) {
                if (fsWait) return

                const content = fs.readFileSync(filename)
                const md5Current = md5(content);
                if (md5Current === md5Previous || md5Current === "d41d8cd98f00b204e9800998ecf8427e") {
                    return;
                }
                md5Previous = md5Current;

                console.log(`${filename} changed!`);
                callback()

                fsWait = setTimeout(() => {
                    fsWait = false
                }, 100)
            }
        })
    } catch (err) {
        if (err.errno === -2)
            error(`File ${err.filename} not found!`)
        else
            throw(err)
    }
}