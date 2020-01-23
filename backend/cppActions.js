
const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const spawn = require('child_process').spawn

exports.compileCpp = async (filename) => {
    try {
        //await execFile('g++', ['-std=c++17', '-O3', '-static', '-o./cpp/test.bin', `${filename}`]);
        await execFile('g++', ['-std=c++17', '-static', '-o./cpp/test.bin', `${filename}`]);
        return "./cpp/test.bin"
    } catch (err) {
        throw err.stderr
    }
}

exports.executeTest = (binaryName, input, pushStdout) => {
    const child = spawn(binaryName, [ ], {
        //shell: true
        encoding: "buffer"
    })
    let stdout = Buffer.from("")
    let stderr = ''

    let stdoutUpdateInterval = setInterval(() => {
        if (stdout.length) {
            pushStdout(stdout)
            stdout = Buffer.from("")
        }
    }, 100);

    child.stdin.write(input)
    child.stdin.end()

    child.stdout.on('data', data => {
        stdout = Buffer.concat([ stdout, data ])
    })

    child.stderr.on('data', data => {
        stderr += data
    })

    let promise = new Promise((resolve, reject) => {
        child.on('error', reject)

        child.on('close', (code, signal) => {
            clearInterval(stdoutUpdateInterval)
            if (code === 0) {
                pushStdout(stdout)
                resolve()
            } else {
                const err = new Error(`child exited with code ${code} and signal ${signal}`)
                err.stderr = stderr
                err.code = code
                err.signal = signal
                pushStdout(stdout)
                reject(err)
            }
        })
    })

    promise.childProcess = child

    return promise
}