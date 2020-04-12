const fs = require('fs');
const path = require('path');
const webserver = require('./webserver');

const projectTemplate = {
	"projectInfo": {
		"files": [],
		"path": "/",
		"name": "My new project",
		"author": "",
		"createDate": "01-01-1981",
		"lastEditDate": "01-01-2019",
		"totalTimeSpend": 0,
		"description": "" //ex. nlogn solve
	},
	"settings": {
		"main": {
			"darkMode": false
		},
		"fileManager": {
			"basic": {
				"homePath": "C:\\\\"
			},
			"developer": {
				"renderBlockSize": 50
			}
		}
	},
	"tests": {
		
	},
	"results": {
	
	}
}

isDir = (directory) => {
    try {
        return fs.lstatSync(directory).isDirectory();
    } catch (e) {
        return false;
    }
}     

doesFileExists = (path) => {
    try {
        if (fs.existsSync(path))
            return true;
      } catch(err) {
            return false;
      }
}

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

exports.createNewProject = (data) => {
    let path = parsePath(data.path);
    //path already exists
    if(!data.overwrite && doesFileExists(path + data.name + '.cdsp')) {
            webserver.createNewProjectResponse("error", { message: `File ${path} already exists`, code: 409 });
            return;
    }
    let newProject = projectTemplate;
    newProject.projectInfo.name = data.name;
    newProject.projectInfo.path = path;
    newProject.projectInfo.createDate = new Date();
    newProject.projectInfo.lastEditDate = newProject.projectInfo.createDate;
    if(data.author) newProject.projectInfo.author = data.author;
    if(data.files)  newProject.projectInfo.files = data.files;
    if(data.description) newProject.projectInfo.description = data.description;
    fs.writeFile(path + data.name + '.cdsp', JSON.stringify(newProject), (err) => {
        if(err) webserver.createNewProjectResponse("error", { message: err });
        else    webserver.createNewProjectResponse("success");
    } )

}