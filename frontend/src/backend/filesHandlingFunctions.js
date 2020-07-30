import * as asyncFileActions from './asyncFileActions';
import * as syncFileActions from './syncFileActions';
const fs = window.require('fs');
//const dirTree = require("directory-tree");
const path = window.require('path');
const exec = window.require('child_process').exec;
const util = window.require('util');

export const getPartitionsNames = async () => {
    const execPromisified = util.promisify(exec);
    return (await execPromisified('wmic logicaldisk get name')).stdout;
    /*.then((error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log('stdout ', stdout);
        console.log('stderr ', stderr);
    });*/
};
//
const loadAllFilesOnDirectory = async (directory = 'C:/') => {
    let filesToSend = [];
    directory = syncFileActions.parsePath(directory);
    fs.readdir(directory, (err, files) => {
        if (err) {
            //break;
        } else {
            if (files) {
                files.forEach((file) => {
                    if (!path.extname(directory + file)) filesToSend.push(file);
                });
            }
            return filesToSend;
        }
    });
};

const selectFileType = (fileType) => {
    if (fileType === 'DIRECTORY') return 'DIRECTORY';
    else if (['.img', '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.PNG'].includes(fileType)) return 'IMAGE';
    else if (['.avi', '.wmv', '.mp4', '.mov', '.ogg', '.flv', '.wav', '.m4a'].includes(fileType)) return 'MOVIE';
    else if (['.txt', '.doc', '.docx', '.odt', '.pdf', '.wpd', '.tex', '.wps'].includes(fileType)) return 'DOCUMENT';
    else if (['.exe', '.bat', '.bin', '.apk', '.jar', '.py', '.wsf', '.com'].includes(fileType)) return 'EXECUTABLE';
    else return 'UNDEFINED';
};

export const loadFilesOnDirectory = async ({ filesExtensions, directory, regex }) => {
    let regexExp;
    if (regex) {
        try {
            regexExp = new RegExp(regex);
        } catch (err) {
            return 'Regex error';
        }
    }

    let loadedFiles = [];
    directory = syncFileActions.parsePath(directory);

    if (!(await syncFileActions.fileExist(directory))) {
        //webserver.sendError("The file you provided doesn't exist", '')
        return [[], directory];
    }
    let files = fs.readdirSync(directory);
    //if (err) return "Reading directory error"

    if (!filesExtensions.length) filesExtensions = null;
    let extensions = new Set();
    if (filesExtensions) filesExtensions.forEach(extensions.add, extensions);

    if (files) {
        files.forEach(async (file) => {
            const isFileDirectory = await syncFileActions.isDirectory(directory + file);
            const fileExtension = isFileDirectory ? 'DIRECTORY' : path.extname(directory + file);
            if ((!regex || file.match(regexExp)) && (!filesExtensions || extensions.has(fileExtension)))
                loadedFiles.push({
                    name: file,
                    type: fileExtension,
                    path: directory + file,
                    typeGroup: selectFileType(fileExtension),
                });
        });
    }
    return [loadedFiles, directory];
};

/*
let files_to_send_g = []
let running = 0
let started = 0
let cancelTestLoading = 0
let totalFilesScanned = 0

exports.loadTestsCANCEL = () => {
    cancelTestLoading = 1
}

showDirectory = (directory, regex) => {
    fs.readdir(directory, (err, files) => {
        if (err) {
            //zesralo sie
        } else {
            if (files) {
                for (let j = 0; j < files.length; j += 500) {
                    if (cancelTestLoading) return
                    let i = j,
                        lim = Math.min(j + 500, files.length)
                    ++running
                    const f = setInterval(() => {
                        started = 1
                        if (i === lim || cancelTestLoading) {
                            --running
                            clearInterval(f)
                            return
                        }
                        //console.log(directory+files[i]);
                        if (isDir(directory + files[i]))
                            showDirectory(directory + files[i] + '/', regex)
                        else {
                            ++totalFilesScanned
                            if ((directory + files[i]).match(regex)) {
                                files_to_send_g.push(directory + files[i])
                            }
                        }
                        ++i
                    }, 1)
                }
            }
        }
    })
}

exports.loadTests = ({ directory, regex }, addTestFiles) => {
    if (started) exports.loadTestsCANCEL()
    const mainInterval = setInterval(() => {
        if (!started) {
            clearInterval(mainInterval)
            files_to_send_g = []
            started = 0
            running = 0
            cancelTestLoading = 0
            totalFilesScanned = 0
            let timeStarted = Date.now()
            if (!fs.existsSync(directory)) {
                webserver.sendTests(null, {
                    message: "Path doesn't exist",
                    code: 2000,
                })
                return 0
            }
            let regexExp = ''
            try {
                regexExp = new RegExp(regex)
            } catch (err) {
                webserver.sendTests(null, {
                    message: 'Regex is invalid',
                    code: 1000,
                })
                return 0
            }
            directory = parsePath(directory)
            /*os.cpuUsage(function(v){
                console.log( 'CPU Usage (%): ' + v );
            });(*)/
            setImmediate(async () => {
                let it = 0
                //console.log(directory);
                //console.log(regexExp)
                showDirectory(directory, regexExp)
                const fileFinderListener = setInterval(() => {
                    console.log(running, files_to_send_g.length)
                    webserver.sendTests(null, null, {
                        filesLoaded: `Loaded ${files_to_send_g.length} files`,
                        filesScanned: `Scanned ${totalFilesScanned} files`,
                    })
                    if (running <= 0 && started) {
                        started = 0
                        let timeEnded = Date.now()
                        //console.log("fin", timeEnded-timeStarted);
                        if (!cancelTestLoading) {
                            webserver.sendTests(null, null, {
                                filesLoaded: `Loaded ${
                                    files_to_send_g.length
                                } files in ${timeEnded - timeStarted - 200}ms`,
                                filesScanned: `Scanned ${totalFilesScanned} files in ${timeEnded -
                                    timeStarted -
                                    200}ms`,
                            })
                            webserver.sendTests(['/'])
                            addTestFiles(files_to_send_g)
                        } else {
                            webserver.sendTests(null, null, {
                                filesLoaded: '',
                                filesScanned: '',
                            })
                        }
                        clearInterval(fileFinderListener)
                    }
                }, 200)
                /(*)dirTree(directory, {extensions: regexExp} , (item) => {
                    ++it;
                    if(it % 10000 === 0) {
                        webserver.sendTests(null,null,{message: `Scanned ${it} files`});
                        console.log(it);
                    }
                    tests_to_send.push(item.path);
                    //console.log(item.path)
                });
                webserver.sendTests(tests_to_send);(*)/
            })
            /(*)let asyncF = new Promise(function(resolve, reject) {
                console.log("xaaaa");
                
                resolve();
            }).then(()=>{console.log("Xd")}); (*)/
            //console.log("h");
            //console.log("b")
        }
    }, 200)
}*/
