import * as syncFileActions from './syncFileActions';
const util = window.require('util');
const execFile = util.promisify(window.require('child_process').execFile);
const spawn = window.require('child_process').spawn;
const fs = window.require('fs');

/*export const parseCppFile = async (path: string) => {
    const fileContent: string = await syncFileActions.readFile(path);
    let modifiedFileContent = fileContent;
    for (let index = fileContent.indexOf('watch'); index != -1; index = fileContent.indexOf('watch', index + 1)) {
        
    }
};
parseCppFile('F:/cds/test.cpp');*/
export const compileCpp = async (filename: string) => {
    try {
        //await execFile('g++', ['-std=c++17', '-O3', '-static', '-o./cpp/test.bin', `${filename}`]);
        await execFile('g++', ['-std=c++17', '-static', '-o./cpp/test.bin',`${filename}`]).catch((err: any) =>
            console.log(err)
        );
        return './cpp/test.bin';
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
