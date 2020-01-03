import React, { ReactElement } from 'react'
import { Typography, makeStyles, AppBar, Tabs, Tab } from '@material-ui/core'
import { useState } from 'react'

const useStyle = makeStyles((theme) => ({
    root: {
        marginLeft: theme.spacing(6) + 24,
    },
    appBar: {
        backgroundColor: theme.palette.background.default
    }
}))

interface Props {
    
}

enum Views {
    Outputs,
    Debugging,
}

export default function Content({ }: Props): ReactElement {
    const classes = useStyle();
    const [view, setView] = useState<Views>(Views.Debugging);
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
            <Typography variant="h1" style={{ padding: 20 }}>
                The content
            </Typography>
        </div>
    )
}
