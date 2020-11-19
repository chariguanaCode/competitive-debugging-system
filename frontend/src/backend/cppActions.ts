import { readFile, saveFile } from 'backend/asyncFileActions';
const util = window.require('util');
const execFile = util.promisify(window.require('child_process').execFile);
const spawn = window.require('child_process').spawn;
const fs = window.require('fs');
const remote = window.require('electron').remote;

export const modifyCppSource = async (originalSourcePath: string, newSourcePath: string) => {
    const cppFolder = remote.getGlobal('paths').cppFiles;
    let source = await readFile(originalSourcePath);

    source = `#include "${cppFolder}/universal_print_17.h"\n` + `#define DEBUG 1\n` + `#define CDS_DEBUG 1\n` + `\n` + source;

    await saveFile(newSourcePath, source);
};

export const compileCpp = async (sourcePath: string, binaryPath: string) => {
    try {
        //await execFile('g++', ['-std=c++17', '-O3', '-static', '-o./cpp/test.bin', `${filename}`]);
        await execFile('g++', ['-std=c++17', '-static', `-o${binaryPath}`, `${sourcePath}`]);
    } catch (err) {
        throw err.stderr;
    }
};

export const executeTest = (binaryPath: string, stdinPath: string, stdoutPath: string, stderrPath: string) => {
    const stdinStream = fs.createReadStream(stdinPath);
    const stdoutStream = fs.createWriteStream(stdoutPath);
    const stderrStream = fs.createWriteStream(stderrPath);

    const child = spawn(binaryPath, [], {
        //shell: true
        stdio: 'pipe',
        encoding: 'buffer',
    });

    stdinStream.pipe(child.stdin);
    child.stdout.pipe(stdoutStream);
    child.stderr.pipe(stderrStream);

    let promise = new Promise((resolve, reject) => {
        child.on('error', reject);
        stdinStream.on('error', reject);
        stdoutStream.on('error', reject);
        stderrStream.on('error', reject);

        child.on('close', (code: number, signal: string) => {
            console.log('Test finished!');
            if (code === 0) {
                resolve();
            } else {
                reject({
                    code,
                    signal,
                });
            }
        });
    });

    return Object.assign(promise, { childProcess: child });
};
