import React, { ReactElement, useState, useRef } from 'react';
import { AppBar, Tabs, Tab, IconButton, Zoom, Button, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import useStyles from './Content.css';
import { Layout, Model, TabNode } from 'flexlayout-react';
import { Tasks, Watches, TasksManagement } from 'modules';
import 'flexlayout-react/style/dark.css';
import AddTab from './AddTabDialog';
import TasksProgressBar from 'modules/TasksProgressBar';
import defaultLayout from './defaultLayout';

const Content: React.FunctionComponent = () => {
    const classes = useStyles();
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
};

export default Content;
