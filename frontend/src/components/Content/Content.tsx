import React, { ReactElement, useState } from 'react';
import { AppBar, Tabs, Tab, IconButton, Zoom } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import useStyles from './Content.css';

import DebuggingLayout from './layouts/DebuggingLayout';
import TasksLayout from './layouts/TasksLayout';

import GlobalStateContext, { Views } from '../../utils/GlobalStateContext';
import { useContextSelector } from 'use-context-selector';

export default function Content(): ReactElement {
    const classes = useStyles();

    const view = useContextSelector(GlobalStateContext, (v) => v.view);
    const setView = useContextSelector(GlobalStateContext, (v) => v.setView);

    const [addTabOpen, setAddTabOpen] = useState(false);

    const addButton = [Views.Debugging].includes(view);

    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.appBar}>
                <Tabs
                    value={view}
                    onChange={(evt, newVal) => setView(newVal)}
                    indicatorColor="primary"
                    textColor="primary"
                    style={{ flexGrow: 1 }}
                >
                    <Tab label="Tasks" />
                    <Tab label="Outputs" />
                    <Tab label="Debugging" />
                </Tabs>
                <Zoom in={addButton}>
                    <IconButton onClick={() => setAddTabOpen(true)}>
                        <AddIcon />
                    </IconButton>
                </Zoom>
            </AppBar>
            <div style={{ height: 'calc(100% - 48px)', padding: 8 }}>
                {view === Views.Tasks && <TasksLayout />}
                {view === Views.Debugging && <DebuggingLayout {...{ addTabOpen, setAddTabOpen }} />}
            </div>
        </div>
    );
}
