import { ConfigModel } from 'reduxState/models';

const getDefaultConfig = () => {
    let today = new Date();
    let currentDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    return {
        projectInfo: {
            files: [],
            name: 'New project',
            author: '',
            createDate: currentDate,
            lastEditDate: currentDate,
            totalTimeSpent: '0h0m0s',
            description: '',
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
        tests: [],
    } as ConfigModel;
};

export default getDefaultConfig;
