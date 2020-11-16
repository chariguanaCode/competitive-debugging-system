import { CdsConfigModel } from 'reduxState/models';
import { updateFunctionDeclaration } from 'typescript';
import { v4 as uuidv4 } from 'uuid';
const remote = window.require('electron').remote;
const app = remote.app;

const getDefaultCdsConfig = () => {
    let today = new Date();
    let currentDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let appUuid = uuidv4();
    return {
        projects: {
            nextNotSavedProjectName: 'test',
            projectsHistory: [],
        },
        settings: {},
        app: {
            uuid: appUuid,
        },
    } as CdsConfigModel;
};

export default getDefaultCdsConfig;
