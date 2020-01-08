const fs = require('fs');
const dirTree = require("directory-tree");
const path = require('path');
const webserver = require('./webserver');
const  os 	= require('os-utils');

parsePath = (directory) => {
    if(directory[directory.length-1]!='/' && directory[directory.length-1]!='\\') directory += '/'
    if(!path.isAbsolute(directory)){
        /* if((homePath[homePath.length-1]!=="/" || homePath[homePath.length-1]!=="\") && (directory[0]!=='/' || directory[0]!=='\\'))directory = '/' + directory;
            directory = homePath + directory;
            TODO: default home path (in settings), now it's backend directory
        */
        directory = path.resolve(directory);
    } 
    directory = directory.split('\\').join('/');
    return directory;
}

exports.loadDirectory = (directory = "C:/") => {
    let files_to_send = [];
    directory = parsePath(directory)
    fs.readdir(directory, (err, files) => {
        if(err){
            webserver.sendDirectory(directory, null, {message: err.message, code: err.code, number: err.errno});
        } else {
            if(files){
                files.forEach((file) =>{
                    if(!path.extname(directory + file)) files_to_send.push(file);
                })
            }
            webserver.sendDirectory(directory, files_to_send);
        }   
    });    
} 

exports.loadFilesOnDirectory = ({filetypes,directory}) => {
    let files_to_send = [];
    
    directory = parsePath(directory)
    fs.readdir(directory, (err, files) => {
        if(err){
            webserver.sendDirectory(directory, null, {message: err.message, code: err.code, number: err.errno});
        } else {
            types = new Set();
            if(filetypes) types.add(filetypes);
            let loadDirectories = false;
            if(filetypes && types.has("DIRECTORY")){
                loadDirectories = true;
            }
            if(files){
                files.forEach((file) =>{
                    if(!filetypes || (filetypes && types.has(path.extname(directory + file)) || (isDir(directory + file) && loadDirectories))) files_to_send.push({
                        name: file,
                        type: isDir(directory + file) ? "DIRECTORY" : path.extname(directory + file),
                        path: directory + file
                    });
                })
            }
            webserver.sendDirectory(directory, files_to_send);
            console.log(files_to_send)

        }   
    });    
} 


isDir = (directory) => {
    try {
        return fs.lstatSync(directory).isDirectory();
    } catch (e) {
        return false;
    }
}     

let files_to_send_g = [];
let running = 0;
let started = 0;
let cancelTestLoading = 0;
let totalFilesScanned = 0;

exports.loadTestsCANCEL = () => {cancelTestLoading = 1;}

showDirectory = (directory, regex) => {
    fs.readdir(directory, (err, files) => {
        if(err){
            //zesralo sie
        } else {
            if(files){
                for(let j = 0; j<files.length; j += 500){
                    if(cancelTestLoading) return;
                    let i = j, lim = Math.min(j + 500, files.length);
                    ++running;
                    const f = setInterval(()=>{
                        started = 1;
                        if(i===lim || cancelTestLoading){
                            --running;
                            clearInterval(f);
                            return;
                        }
                        //console.log(directory+files[i]);
                        if(isDir(directory+files[i]))showDirectory(directory+files[i]+'/', regex);
                        else{
                            ++totalFilesScanned;
                            if((directory+files[i]).match(regex)){
                                files_to_send_g.push(directory+files[i]);
                            }
                        } 
                        ++i;
                    },1);
                }
               
            }
        }   
    });    
}

exports.loadTests = ({directory, regex},addTestFiles) => {
    if(started) exports.loadTestsCANCEL();
    const mainInterval = setInterval(()=>{
        if(!started){
            clearInterval(mainInterval);
            files_to_send_g = [];
            started = 0;
            running = 0;
            cancelTestLoading = 0;
            totalFilesScanned = 0;
            let timeStarted = Date.now();
            if(!fs.existsSync(directory)){
                webserver.sendTests(null, {message: "Path doesn't exist", code: 2000})
                return 0;
            }
            let regexExp = "";
            try {
                regexExp = new RegExp(regex)
            } catch(err) {
                webserver.sendTests(null, {message: "Regex is invalid", code: 1000})
                return 0;
            } 
            directory = parsePath(directory);
            /*os.cpuUsage(function(v){
                console.log( 'CPU Usage (%): ' + v );
            });*/
            console.log("as");
            setImmediate(async () => {
                let it = 0;
                console.log(directory);
                console.log(regexExp)
                showDirectory(directory,regexExp);
                const fileFinderListener = setInterval(()=>{
                    console.log(running,files_to_send_g.length);
                    webserver.sendTests(null,null,{filesLoaded: `Loaded ${files_to_send_g.length} files`, filesScanned: `Scanned ${totalFilesScanned} files`});
                    if(running <= 0 && started){
                        started = 0;
                        let timeEnded = Date.now();
                        //console.log("fin", timeEnded-timeStarted);
                        if(!cancelTestLoading){
                            webserver.sendTests(null,null,{filesLoaded: `Loaded ${files_to_send_g.length} files in ${timeEnded-timeStarted-200}ms`,filesScanned: `Scanned ${totalFilesScanned} files in ${timeEnded-timeStarted-200}ms`});
                            webserver.sendTests(["/"]);
                            addTestFiles(files_to_send_g);
                        }else{
                            webserver.sendTests(null,null,{filesLoaded: '',filesScanned: ''});
                        }
                        clearInterval(fileFinderListener);
                    }
                },200)
                /*dirTree(directory, {extensions: regexExp} , (item) => {
                    ++it;
                    if(it % 10000 === 0) {
                        webserver.sendTests(null,null,{message: `Scanned ${it} files`});
                        console.log(it);
                    }
                    tests_to_send.push(item.path);
                    //console.log(item.path)
                });
                webserver.sendTests(tests_to_send);*/
            })
            /*let asyncF = new Promise(function(resolve, reject) {
                console.log("xaaaa");
                
                resolve();
            }).then(()=>{console.log("Xd")}); */
            console.log("h");
            console.log("b")
        } 
    },200)   
}