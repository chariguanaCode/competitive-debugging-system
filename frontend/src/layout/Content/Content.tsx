import React, { ReactElement, useState, useRef } from 'react';
import { Fab } from '@material-ui/core';
import useStyles from './Content.css';
import { Layout, Model, TabNode } from 'flexlayout-react';
import { Tasks, Watches } from 'modules';
import 'flexlayout-react/style/dark.css';
import AddTab from 'modules/AddTabDialog';
import TasksProgressBar from 'modules/TasksProgressBar';
import { useFileManagerActions, useAddTrackedObjectDialogActions } from 'reduxState/actions';
import { ContextMenu } from 'components';
import { Add, AddBox } from '@material-ui/icons';
import TrackedObject from 'modules/TrackedObject';

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
                        name: '2D array',
                        component: 'trackedObject',
                        config: {
                            object: 'bbb',
                        },
                    },
                    {
                        type: 'tab',
                        name: '1D array',
                        component: 'trackedObject',
                        config: {
                            object: 'aaa',
                        },
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
    const { openAddTrackedObjectDialog } = useAddTrackedObjectDialogActions();
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
            case 'trackedObject':
                return <TrackedObject config={node.getConfig()} />;
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
        <ContextMenu
            className={classes.root}
            items={[{ label: 'Add Tracked Object', onClick: () => openAddTrackedObjectDialog(), icon: <AddBox /> }]}
        >
            <div className={classes.layoutWrapper}>
                <Layout model={model} factory={factory} onModelChange={setModel} ref={layout} />
                <AddTab open={addTabOpen} onClose={addTab} />
                <Fab
                    variant="extended"
                    color="primary"
                    size="medium"
                    className={classes.addTabButton}
                    onClick={() => setAddTabOpen(true)}
                >
                    <Add style={{ marginRight: 8 }} />
                    Add new tab
                </Fab>
            </div>
            <TasksProgressBar />
        </ContextMenu>
    );
}

export default Content;
