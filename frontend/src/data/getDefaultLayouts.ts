const getDefaultLayouts = () => {
    const global = {
        tabSetHeaderHeight: 30,
        tabSetTabStripHeight: 30,
        borderBarSize: 30,
    };
    /*
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
    */

    return {
        debugging: {
            global,
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
                                name: 'Watches',
                                component: 'watch',
                            },
                        ],
                    },
                ],
            },
            borders: [],
        },
        outputs: {
            global,
            layout: {
                type: 'row',
                weight: 100,
                children: [],
            },
            borders: [],
        },
        tests: {
            global,
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
                                name: 'Tests',
                                component: 'tasks',
                            },
                        ],
                    },
                ],
            },
            borders: [],
        },
        empty: {
            global,
            layout: {},
            borders: [],
        },
    };
};

export default getDefaultLayouts;
