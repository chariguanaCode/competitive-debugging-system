import React, { ReactElement, useEffect } from 'react'
import { Typography, makeStyles, AppBar, Tabs, Tab } from '@material-ui/core'
import { useState } from 'react'
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import JSONTree from './JSONTree'

const useStyle = makeStyles((theme) => ({
    root: {
        marginLeft: theme.spacing(6) + 24,
        marginRight: 24,
        height: "calc(100vh - 64px)"
    },
    appBar: {
        backgroundColor: theme.palette.background.default
    },
    splitter: {
        position: "unset"
    },
    splitContent: {
        padding: theme.spacing(2), 
        height: "100%", 
        overflowY: "auto" 
    }
}))

interface Props {
    socket: WebSocket,
}

enum Views {
    Outputs,
    Debugging,
}

export default function Content({ socket }: Props): ReactElement {
    const classes = useStyle();
    const [ view, setView ] = useState<Views>(Views.Debugging);
    const [ watchblocks, setWatchblocks ] = useState<any>({ });
    const currentId = "./cpp/tests/test1.in"

    const processMessage = (msg: any) => {
        const message = JSON.parse(msg.data)
        const { type, data } = message

        if (type === "detailedTestUpdate") {
            console.log("Watchblocks:", data.watchblocks)
            setWatchblocks(data.watchblocks)
        }
    }

    useEffect(() => {
        if (socket) {
            socket.addEventListener("message", processMessage)
        }
        return () => {
            if (socket) {
                socket.removeEventListener("message", processMessage)
            }
        }
    }, [socket])


    return (
        <div className={classes.root}>
            <AppBar 
                position="static"
                className={classes.appBar}
            >
                <Tabs 
                    value={view} 
                    onChange={(evt, newVal) => setView(newVal)} 
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab label="Outputs" />
                    <Tab label="Debugging" />
                </Tabs>
            </AppBar>
            <div style={{ height: "calc(100% - 48px)" }}>
            {(view === Views.Debugging) &&
                <SplitterLayout percentage customClassName={classes.splitter}>
                    <div className={classes.splitContent}>
                        <Typography variant="h4">
                            Watchblocks
                        </Typography>
                        <JSONTree
                            data={watchblocks.children || { }}
                        />
                    </div>
                    <div className={classes.splitContent}>
                        <Typography variant="h4">
                            Watches
                        </Typography>
                    </div>
                </SplitterLayout>
            }
            </div>
        </div>
    )
}
