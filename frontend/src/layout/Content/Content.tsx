import React, { useState, useRef, useEffect } from 'react';
import { Fab } from '@material-ui/core';
import { Add, AddBox } from '@material-ui/icons';
import { Layout, Model, TabNode } from 'flexlayout-react';
import 'flexlayout-react/style/dark.css';
import useStyles from './Content.css';
import { Tasks, Watches, Outputs, TestsManagement, AddTabDialog, TrackedObject, TasksProgressBar } from 'modules';
import { useAddTrackedObjectDialogActions, useConfigActions } from 'reduxState/actions';
import { ContextMenu } from 'components';

import { useLayoutSelection, useLayouts } from 'reduxState/selectors';

const Content: React.FunctionComponent = () => {
    const classes = useStyles();

    const { openAddTrackedObjectDialog } = useAddTrackedObjectDialogActions();
    const [addTabOpen, setAddTabOpen] = useState(false);
    useEffect(() => {
        const addTab = () => setAddTabOpen(true);
        document.addEventListener('addNewTab', addTab);
        return () => {
            document.removeEventListener('addNewTab', addTab);
        };
    }, []);

    const layoutRef = useRef<Layout>(null);

    const layoutSelection = useLayoutSelection();
    const layout = useLayouts()[layoutSelection];
    const { setLayout } = useConfigActions();
    const model = Model.fromJson(layout);
    const setModel = (newModel: Model) => setLayout({ key: layoutSelection, value: newModel.toJson() });

    const factory = (node: TabNode) => {
        const type = node.getComponent();

        switch (type) {
            case 'tasks':
                return <Tasks />;
            case 'watches':
                return <Watches />;
            case 'trackedObject':
                return <TrackedObject config={node.getConfig()} />;
            case 'outputs':
                return <Outputs />;
            case 'tests management':
                return <TestsManagement />;
            default:
                return <>Invalid tab</>;
        }
    };
    const addTab = (result: any) => {
        if (layoutRef.current !== null && result !== null) {
            layoutRef.current.addTabWithDragAndDrop('Add panel<br>(Drag to location)', result, () => null);
        }
        setAddTabOpen(false);
    };

    return (
        <ContextMenu
            className={classes.root}
            items={[{ label: 'Add Tracked Object', onClick: () => openAddTrackedObjectDialog(), icon: <AddBox /> }]}
        >
            <div className={classes.layoutWrapper}>
                <Layout model={model} factory={factory} onModelChange={setModel} ref={layoutRef} />
                <AddTabDialog open={addTabOpen} onClose={addTab} />
            </div>
            <TasksProgressBar />
        </ContextMenu>
    );
};

export default Content;
