import React, { useState, useRef } from 'react';
import { Fab } from '@material-ui/core';
import { Add, AddBox } from '@material-ui/icons';
import { Layout, Model, TabNode } from 'flexlayout-react';
import 'flexlayout-react/style/dark.css';
import useStyles from './Content.css';
import { Tasks, Watches, TasksManagement, AddTabDialog, TrackedObject, TasksProgressBar } from 'modules';
import { useAddTrackedObjectDialogActions } from 'reduxState/actions';
import { ContextMenu } from 'components';

import defaultLayout from './defaultLayout';

const Content: React.FunctionComponent = () => {
    const classes = useStyles();
    const { openAddTrackedObjectDialog } = useAddTrackedObjectDialogActions();
    const [addTabOpen, setAddTabOpen] = useState(false);

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
            case 'tasks management':
                return <TasksManagement />;
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
                <AddTabDialog open={addTabOpen} onClose={addTab} />
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
};

export default Content;
