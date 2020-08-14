import { CdsConfigModel } from 'reduxState/models';
const remote = window.require('electron').remote;
const app = remote.app;

const getDefaultCdsConfig = () => {
    let today = new Date();
    let currentDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    return {
            "projects": {
                "nextNotSavedProjectName": "test",
                "projectsHistory": []
            },
            "settings": {},
    } as CdsConfigModel
};

export default getDefaultCdsConfig;
