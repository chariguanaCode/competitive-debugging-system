import React, { useState, useEffect, useRef } from 'react'
import Button from '@material-ui/core/Button'
import Paper from './Paper'
import Fade from '@material-ui/core/Fade'
import ProgramTestComponent from './ProgramTest'
import { TestManager }  from './TestManager'
import CircularProgress from '@material-ui/core/CircularProgress';
import { CssBaseline, Table, TableContainer, TableRow, TableCell, TableBody } from '@material-ui/core'
import Header from './Header'
import Content from './Content'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'
import { grey, red, yellow, lightGreen, lightBlue, purple } from '@material-ui/core/colors';

interface ProgramTestData {
    [testName: string]: {
        state: string,
        stdout: string,
        stdin: string,
        error: any,
        executionTime: string,
    }
}

enum ExecutionState {
    NoProject,
    Compiling,
    CompilationError,
    Running,
    Finished,
}

interface ConnectionErrorProps {

}

export const ConnectionError: React.FunctionComponent<ConnectionErrorProps> = () => {
   /* let connectionTimeout = Math.min(4000, 2 * connectionTimeout.current) 

    console.log(
        `Socket is closed. Reconnect will be attempted in ${connectionTimeout.current / 1000} second.`,
        e.reason
    )*/

    return <Fade in = {true} style={{
                transitionDelay: '500ms',
        }}><div style = {{width: "100%", height: "100%", zIndex: 10000, position: "absolute",backgroundColor: "rgba(22, 22, 22, 0.5)"}}>
                <div style = {{zIndex: 10001 ,position: "absolute", left: "calc(50% - 60px)", top: "calc(50% - 30px)", width: "140px", height: "60px", backgroundColor: "rgba(255, 77, 77, 0.5)"}}><span style = {{position: "absolute", top: "calc(50% - 26px)", margin: "10px"}}>Loading</span><CircularProgress style = {{position: "absolute", left: "70px", margin: "10px"}} /></div>
            </div></Fade>
}

const App: React.FC = () => {
    const [ tests, setTests ] = useState<ProgramTestData>({ })
    const [ filename, setFilename ] = useState("")
    const [ executionState, setExecutionState ] = useState<ExecutionState>(ExecutionState.NoProject)
    const [ socket, setSocket ] = useState()
    const connectionTimeout = useRef(250)
    const lastServerPing = useRef(0);
    const isServerConnected = useRef(false)

    const check = () => {
        if (!socket || socket.readyState === WebSocket.CLOSED) connect() 
    }

    const connect = () => {
        var ws = new WebSocket("ws://localhost:8000")
        var connectInterval: number ///inaczej nie działa

        

        ws.onopen = () => {
            console.log("connected websocket main component")
            isServerConnected.current = true;
            setSocket(ws)
            connectionTimeout.current = 250 
            clearTimeout(connectInterval) 
        }
        /*setInterval(()=>{
            if(isServerConnected.current && Date.now() - lastServerPing.current > 2000){
                console.error("xd");
                //@ts-ignore
                if(isServerConnected.current) ws.onclose({reason: "idk"});
                isServerConnected.current = false;
            }
        },2000)*/
        ws.onclose = e => {
            // isServerConnected.current = false;
            setSocket(null);
            connectionTimeout.current = Math.min(4000, 2 * connectionTimeout.current) 

            console.log(
                `Socket is closed. Reconnect will be attempted in ${connectionTimeout.current / 1000} second.`,
                e.reason
            )

            connectInterval = setTimeout(check, connectionTimeout.current) 
        }

        ws.onerror = err => {
            console.error(
                "Socket encountered an error. Closing the socket."
            )

            ws.close()
        }
        
        ws.onmessage = (msg) => {
            //console.log(msg)
            const message = JSON.parse(msg.data)
            const type = message.type
            const data = message.data
            if(type === "serverPING"){
                lastServerPing.current = Date.now();
            } else if (type === "newConfig") {
                setFilename(data.filename)
                setTests(data.tests)
            } else if (type === "testUpdate") {
                const newTest: ProgramTestData = {
                    [data.id]: {
                        state: data.state,
                        stdin: data.stdin,
                        stdout: data.stdout,
                        executionTime: data.executionTime,
                        error: data.error
                    }
                }
                setTests((prevTests) => ({ ...prevTests, ...newTest }))
            } else if (type === "compilationBegin") {
                setExecutionState(ExecutionState.Compiling)
            } else if (type === "compilationSuccess") {
                setExecutionState(ExecutionState.Running)
            } else if (type === "compilationError") {
                setExecutionState(ExecutionState.CompilationError)
            }
            
        }
    }

    useEffect(() => {
        connect()
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ ])

    const loadProject = () => {
        socket.send(JSON.stringify({
            type: "loadProject",
            filename: "./cpp/test.cpp"
        }))
    }

    const runTests = () => {
        socket.send(JSON.stringify({
            type: "runTasks"
        }))
    }

    const killTest = (testName: string) => {
        socket.send(JSON.stringify({
            type: "killTest",
            
        }))
    }

    

    return (
        <>
        {socket ? null : <ConnectionError/>}
        <div style={socket ? {
            width: "50%"
        } : {pointerEvents: "none"}}>
            <CssBaseline />
            <Header />
            <LeftSidebar>
                <Table>
                    <TableBody>
                    {[ ...Array(100)].map((val) => Math.floor(Math.random() * 6)).map((val, index) => (
                        <TableRow key={index}>
                            <TableCell style={{ backgroundColor: [ red, yellow, lightGreen, purple, lightBlue, grey ][2][400] }}></TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </LeftSidebar>
            <Content />
            <RightSidebar>
                <div style={{ margin: 8 }}>
                    {[ ...Array(100)].map(() => <p>Testing</p>)}
                </div>
            </RightSidebar>
        </div>
        </>
    )
    /*return (
        <div 
        
           
        >
            <TestManager socket = {socket}/>
            
            {/*<Paper>
                
                <Button onClick={loadProject}>
                    Load project
                </Button>
                <Button onClick={runTests}>
                    Run Tests
                </Button>
                {filename}
            </Paper>
            {(executionState === ExecutionState.Running || 
              executionState === ExecutionState.Finished) && <Paper>
                {Object.entries(tests).map(([ index, val ]) => (
                    <ProgramTestComponent
                        testName={index}
                        state={val.state}
                        stdin={val.stdin}
                        stdout={val.stdout}
                        executionTime={val.executionTime}
                        error={val.error}
                        killTest={killTest}
                        key={index} 
                    />
                ))}
            </Paper>}
                {(executionState === ExecutionState.Compiling) && <Paper>Compiling...</Paper>}*/
}

export default App