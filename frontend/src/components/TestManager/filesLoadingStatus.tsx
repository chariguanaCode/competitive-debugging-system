import React, { memo }          from "react";
import { useState, useEffect }  from "react"

import { Fade, CircularProgress } from '@material-ui/core';

interface LoadingStatusProps{
    socket: any,
    isLoadingTestsRunning: boolean,
    tests: Array<string>
}

const arePropsEqual = (prevProps: any, nextProps: any) => {
    //console.log(prevProps.renderForce, nextProps.renderForce)
    return prevProps.renderForce === nextProps.renderForce;
}

export const FilesLoadingStatus: React.FunctionComponent<LoadingStatusProps> = memo(({ tests, socket, isLoadingTestsRunning }) => {
    const [testsLoadingStatus, updateTestsLoadingStatus] = useState<any>({
        filesScanned: "",
        filesLoaded: "",
    })
    useEffect(() => {
        if (socket) {
            socket.addEventListener("message", (msg: any) => {
                const message = JSON.parse(msg.data)
                const type = message.type
                const data = message.data
                if (type === "loadTestsSTATUS") {
                    updateTestsLoadingStatus(data.status);
                }
            })
        }
    }, [socket]);
    return(<>
    <span style = {{marginRight: "20px"}}>{testsLoadingStatus.filesScanned}</span>
    <Fade
        in = {isLoadingTestsRunning}
        style={{
        position: "fixed",
        transitionDelay: '200ms',
        }}
        unmountOnExit
    >    
    <CircularProgress />
    </Fade>
    <br/>
    {testsLoadingStatus.filesLoaded} 
    <br/>
    {/*tests.slice(0,10000).map((val)=>(<p>{val}</p>))*/}
    </>)
},arePropsEqual)
