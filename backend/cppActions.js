
const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const spawn = require('child_process').spawn

exports.compileCpp = async (filename) => {
    try {
        await execFile('g++', ['-std=c++17', '-O3', '-static', '-o./cpp/test.bin', `${filename}`]);
        return "./cpp/test.bin"
    } catch (err) {
        throw err.stderr
    }
}

exports.executeTest = (binaryName, input, pushStdout) => {
    const child = spawn(binaryName, [ ], {
        //shell: true
    })
    let stdout = ''
    let stderr = ''

    let stdoutUpdateInterval = setInterval(() => {
        if (stdout) {
            pushStdout(stdout)
            stdout = ''
        }
    }, 100);

    child.stdin.write(input)
    child.stdin.end()

    child.stdout.on('data', data => {
        stdout += data
    })

    child.stderr.on('data', data => {
        stderr += data
    })

    let promise = new Promise((resolve, reject) => {
        child.on('error', reject)

        child.on('close', code => {
            clearInterval(stdoutUpdateInterval)
            if (code === 0) {
                pushStdout(stdout)
                resolve()
            } else {
                const err = new Error(`child exited with code ${code}`)
                err.stderr = stderr
                pushStdout(stdout)
                reject(err)
            }
        })
    })

    promise.child = child

    return promise
}