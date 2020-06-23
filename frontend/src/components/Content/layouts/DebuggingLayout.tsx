import React, { ReactElement, useState, useRef } from 'react';
import { Layout, Model, TabNode } from 'flexlayout-react';
import 'flexlayout-react/style/dark.css';

import WatchWindow from '../windows/WatchWindow';
import TestWindow from '../windows/TestWindow';

import DebuggingAddTab from './DebuggingAddTab';

interface Props {
    addTabOpen: boolean;
    setAddTabOpen: (newState: boolean) => void;
}

const defaultLayout = {
    global: {},
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

export default function DebuggingLayout({ addTabOpen, setAddTabOpen }: Props): ReactElement {
    const [model, setModel] = useState(Model.fromJson(defaultLayout));
    const layout = useRef<Layout>(null);

    const factory = (node: TabNode) => {
        const type = node.getComponent();

        switch (type) {
            case 'test':
                return <TestWindow />;
            case 'watch':
                return <WatchWindow />;
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
            <Layout model={model} factory={factory} onModelChange={setModel} ref={layout} />
            <DebuggingAddTab open={addTabOpen} onClose={addTab} />
        </>
    );
}
