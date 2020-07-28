import React, { ReactElement, useState, useRef } from 'react';
import { AppBar, Tabs, Tab, IconButton, Zoom } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import useStyles from './Content.css';
import { Layout, Model, TabNode } from 'flexlayout-react';
import { Tasks, Watches } from 'modules';
import { FileManager } from 'modules/FileManager/fileManager';
import 'flexlayout-react/style/dark.css';
import DebuggingAddTab from './DebuggingAddTab';
export enum Views {
    Tasks,
    Outputs,
    Debugging,
}
const defaultLayout = {
    global: {
        tabSetHeaderHeight: 30,
        tabSetTabStripHeight: 30,
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
                        name: 'Test',
                        component: 'test',
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
};

function Content(): ReactElement {
    const classes = useStyles();
    const [addTabOpen, setAddTabOpen] = useState(false);

    const [model, setModel] = useState(Model.fromJson(defaultLayout));
    const layout = useRef<Layout>(null);

    const factory = (node: TabNode) => {
        const type = node.getComponent();

        switch (type) {
            case 'test':
                return <Tasks />;
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
        <div className={classes.root}>
            <div style={{ position: 'relative', height: '100%' }}>
                {/*<Layout model={model} factory={factory} onModelChange={setModel} ref={layout} />*/}
                <DebuggingAddTab open={addTabOpen} onClose={addTab} />
            </div>
        </div>
    );
}

export default Content;
