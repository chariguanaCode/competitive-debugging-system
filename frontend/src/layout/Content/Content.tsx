import React, { ReactElement, useState, useRef } from 'react';
import { AppBar, Tabs, Tab, IconButton, Zoom, Button, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import useStyles from './Content.css';
import { Layout, Model, TabNode } from 'flexlayout-react';
import { Tasks, Watches } from 'modules';
import 'flexlayout-react/style/dark.css';
import AddTab from './AddTabDialog';
import TasksProgressBar from 'modules/TasksProgressBar';
import { useFileManagerActions } from 'reduxState/actions';

const defaultLayout = {
    global: {
        tabSetHeaderHeight: 30,
        tabSetTabStripHeight: 30,
        borderBarSize: 30,
    },
    layout: {
        type: 'row',
        weight: 100,
        children: [
            {
                type: 'tabset',
                weight: 50,
                selected: 0,
                children: [
                    {
                        type: 'tab',
                        name: 'Tasks',
                        component: 'tasks',
                    },
                ],
            },
            {
                type: 'tabset',
                weight: 50,
                selected: 0,
                children: [
                    {
                        type: 'tab',
                        name: 'Watches',
                        component: 'watch',
                    },
                ],
            },
            {
                type: 'tabset',
                weight: 50,
                selected: 0,
                children: [
                    {
                        type: 'tab',
                        name: 'Watches2',
                        component: 'watch',
                    },
                ],
            },
        ],
    },
    borders: [
        {
            type: 'border',
            location: 'bottom',
            children: [
                {
                    type: 'tab',
                    enableClose: false,
                    name: 'Tasks',
                    component: 'tasks',
                },
            ],
        },
    ],
};

function Content(): ReactElement {
    const classes = useStyles();
    const [addTabOpen, setAddTabOpen] = useState(false);
    const { setFileManager } = useFileManagerActions();

    const [model, setModel] = useState(Model.fromJson(defaultLayout));
    const layout = useRef<Layout>(null);

    const factory = (node: TabNode) => {
        const type = node.getComponent();

        switch (type) {
            case 'tasks':
                return <Tasks node={node} />;
            case 'watch':
                return <Watches />;
            default:
                return <>Invalid tab</>;
        }
    };
    const addTab = (result: any) => {
        if (layout.current !== null && result !== null) {
            layout.current.addTabWithDragAndDrop('Add panel<br>(Drag to location)', result, () => null);
        }
        setAddTabOpen(false);
    };

    return (
        <>
            <div className={classes.root}>
                <div className={classes.layoutWrapper}>
                    <Layout model={model} factory={factory} onModelChange={setModel} ref={layout} />
                    <AddTab open={addTabOpen} onClose={addTab} />
                    <Fab
                        variant="extended"
                        color="primary"
                        size="medium"
                        style={{
                            position: 'absolute',
                            bottom: 16,
                            right: 16,
                        }}
                        onClick={() => setAddTabOpen(true)}
                    >
                        <AddIcon style={{ marginRight: 8 }} />
                        Add new tab
                    </Fab>
                </div>
                <TasksProgressBar />
            </div>
        </>
    );
}

export default Content;
