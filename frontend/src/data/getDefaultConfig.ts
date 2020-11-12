import { ConfigModel } from 'reduxState/models';
import getDefaultLayouts from './getDefaultLayouts';
import { v4 as uuidv4 } from 'uuid';

const getDefaultConfig = () => {
    let today = new Date();
    let currentDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let projectUuid = uuidv4();
    return {
        projectInfo: {
            files: [],
            name: 'New project',
            author: '',
            createDate: currentDate,
            lastEditDate: currentDate,
            totalTimeSpent: '0h0m0s',
            description: '',
            uuid: projectUuid,
        },
        settings: {
            main: {
                darkMode: true,
            },
            fileManager: {
                basic: {
                    homePath: 'C:\\\\',
                },
                developer: {
                    renderBlockSize: 50,
                },
            },
        },
        tests: {
            groups: {
                '1': {
                    name: 'Tests Group 1',
                    tests: {},
                },
            },
            nextGroupId: '2',
            nextTestId: '1',
        },
        watchesIdsActions: {},
        layouts: getDefaultLayouts(),
        layoutSelection: 'empty',
        trackedObjects: [],
    } as ConfigModel;
};

export default getDefaultConfig;
