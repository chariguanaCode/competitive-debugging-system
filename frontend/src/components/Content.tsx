import React, { ReactElement } from 'react';
import GlobalStateContext, { Watchblock, Watch } from '../utils/GlobalStateContext';
import { useContextSelector } from 'use-context-selector';
import { Typography, makeStyles, AppBar, Tabs, Tab, LinearProgress } from '@material-ui/core';
import { useState } from 'react';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import JSONTree from './JSONTree';

const useStyle = makeStyles((theme) => ({
    root: {
        marginLeft: theme.spacing(6) + 24,
        marginRight: 24,
        height: 'calc(100vh - 64px - 24px)',
    },
    appBar: {
        backgroundColor: theme.palette.background.default,
    },
    splitter: {
        position: 'unset',
    },
    splitContent: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: theme.spacing(2),
        paddingBottm: theme.spacing(2),
        paddingLeft: theme.spacing(2),
    },
}));

enum Views {
    Outputs,
    Debugging,
}

export default function Content(): ReactElement {
    const classes = useStyle();
    const [view, setView] = useState<Views>(Views.Debugging);
    const currentTask = useContextSelector(GlobalStateContext, (v) => v.currentTask);
    const shouldStdoutReload = useContextSelector(GlobalStateContext, (v) => v.shouldStdoutReload);
    const shouldWatchblocksReload = useContextSelector(GlobalStateContext, (v) => v.shouldWatchblocksReload);
    const updateWatchblockCount = useContextSelector(GlobalStateContext, (v) => v.updateWatchblockCount);

    const updateWatchblocks = (newWatchblocks: Array<Watchblock | Watch>) => {
        console.log({ newWatchblocks });
        currentTask.watchblocks.current.children = newWatchblocks;
        updateWatchblockCount();
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.appBar}>
                <Tabs value={view} onChange={(evt, newVal) => setView(newVal)} indicatorColor="primary" textColor="primary">
                    <Tab label="Outputs" />
                    <Tab label="Debugging" />
                </Tabs>
            </AppBar>
            <div style={{ height: 'calc(100% - 48px)' }}>
                {view === Views.Debugging && (
                    <SplitterLayout percentage customClassName={classes.splitter}>
                        <div className={classes.splitContent}>
                            <Typography>{currentTask.id}</Typography>
                            <JSONTree data={currentTask.watchblocks.current.children || []} updateData={updateWatchblocks} />
                        </div>
                        <div className={classes.splitContent}>
                            <Typography variant="h4">Watches</Typography>
                            <LinearProgress
                                variant="determinate"
                                value={(100 * currentTask.stdout.current.length) / currentTask.stdoutFileSize}
                            />
                            {(100 * currentTask.stdout.current.length) / currentTask.stdoutFileSize}%
                            <Typography variant="h5">{currentTask.stdout.current.length.toExponential(5)}</Typography>
                            {currentTask.stdout.current.substring(0, 10000)}
                        </div>
                    </SplitterLayout>
                )}
            </div>
        </div>
    );
}
