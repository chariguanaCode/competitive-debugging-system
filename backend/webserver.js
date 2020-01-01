const express = require('express')
const http = require('http')
const WebSocket = require('ws')
const path = require('path')

const app = express()
app.use(express.static(path.join(__dirname, '../', 'frontend', 'build')));

const server = http.createServer(app)

const wss = new WebSocket.Server({ server })

let executeTask = { }
exports.setExecuteTask = (obj) => {
    executeTask = obj
}

wss.on('connection', (ws) => {
    console.log("Connection established", wss.clients.size)
    ws.isAlive = true

    ws.on('pong', () => {
        ws.isAlive = true
    })

    ws.on('message', (message) => {
        console.log("Xd")
        data = JSON.parse(message)
        type = data.type
        if (type === "runTasks") {
            executeTask.runTasks()
        } else if (type === "loadProject") {
            executeTask.loadProject(data.filename)
        } else if (type === "killTest") {
            console.log("killed", data.testName)
            executeTask.killTest(data.testName)()
        } else if (type === "loadDirectory") {
            executeTask.loadDirectory(data.data.directory)
        } else if (type === "loadTests") {
            executeTask.loadTests(data.data)
        } else if (type === "loadTestsCANCEL") {
            executeTask.loadTestsCANCEL()
        }
    })
    ws.send(JSON.stringify({ state: "success" }))
})

exports.sendError = (title, description) => {
    wss.clients.forEach((ws) => {
        ws.send(JSON.stringify({ 
            type: "error", 
            data: {
                title,
                description
            }
        }))
    })
}

exports.updateExecutionState = (type, details) => {
    wss.clients.forEach((ws) => {
        ws.send(JSON.stringify({ 
            type,
            data: {
                details
            }
        }))
    })
}

exports.sendConfig = (config) => {
    let { fileTracking, ...data } = config
    wss.clients.forEach((ws) => {
        ws.send(JSON.stringify({ 
            type: "newConfig", 
            data
        }))
    })
}

exports.sendTests = (tests_to_send, error = null, status = null) => {
    console.log("g");
    if (status){
        data_to_send = JSON.stringify({ 
            type: "loadTestsSTATUS", 
            data: { status }
        })
    } else if(error) {
        data_to_send = JSON.stringify({ 
            type: "loadTestsERROR", 
            data: { error }
        })
    } else {
        data_to_send = JSON.stringify({ 
            type: "loadTests", 
            data: {
                    tests: tests_to_send
                }
        })
    }
    wss.clients.forEach((ws) => {
        ws.send(data_to_send);
    })
}

exports.sendDirectory = (path, files, error = null) => {
    let data_to_send;
    if(error){
        data_to_send = JSON.stringify({ 
            type: "loadDirectoryERROR", 
            data: {
                    error, 
                    path
                }
        })
    }else{
        data_to_send = JSON.stringify({ 
            type: "loadDirectory", 
            data: {
                path,
                files
            }
        })
    }
    wss.clients.forEach((ws) => {
        ws.send(data_to_send);
    })
   
}

exports.updateTest = (id, test) => {
    let { childProcess, startTime, ...data } = test
    wss.clients.forEach((ws) => {
        ws.send(JSON.stringify({ 
            type: "testUpdate", 
            data: {
                id,
                ...data
            }
        }))
    })
}

setInterval(() => {
    console.log("Connections alive:", wss.clients.size)
    wss.clients.forEach((ws) => {
        if (!ws.isAlive) {
            console.log("Connection closed", wss.clients.size)
            return ws.terminate()
        }
        
        ws.isAlive = false
        ws.ping(null, false, true)
    })
}, 1000)

setInterval(() => {
    wss.clients.forEach((ws) => {
        ws.send(JSON.stringify({ 
            type: "serverPING", 
            data: null
        }))    
    })
}, 1000)

server.listen(process.env.PORT || 8000, () => {
    console.log(`Server started on port ${server.address().port} :)`)
})