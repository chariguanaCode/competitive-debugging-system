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
        data = JSON.parse(message)
        type = data.type
        if (type === "runTasks") {
            executeTask.runTasks()
        }

        if (type === "loadProject") {
            executeTask.loadProject(data.filename)
        }

        if (type === "killTest") {
            console.log("killed", data.testName)
            executeTask.killTest(data.testName)()
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
}, 10000)

server.listen(process.env.PORT || 8000, () => {
    console.log(`Server started on port ${server.address().port} :)`)
})