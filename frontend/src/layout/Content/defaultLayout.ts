export const defaultLayout = {
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
                weight: 20,
                selected: 0,
                children: [
                    {
                        type: 'tab',
                        name: 'Tasks Management',
                        component: 'tasks management',
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

export default defaultLayout;
