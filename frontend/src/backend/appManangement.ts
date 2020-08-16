import * as asyncFileActions from './asyncFileActions';
import getDefaultCdsConfig from 'data/getDefaultCdsConfig';
import { useCdsConfig } from 'reduxState/selectors';
import { useCdsConfigActions } from 'reduxState/actions';
import { CdsConfigModel } from 'reduxState/models';
import { useLoadProject } from './projectManagement';
const remote = window.require('electron').remote;

export const getAppConfig = async (): Promise<CdsConfigModel> => {
    const paths = remote.getGlobal('paths');
    const appDataDirectory = paths.cdsData;
    const notSavedProjectsDirectory = paths.notSavedProjects;
    const configFilePath = paths.configFile;
    await asyncFileActions.createDirectory(appDataDirectory).catch((err) => {});
    await asyncFileActions.createDirectory(notSavedProjectsDirectory).catch((err) => {});
    if (!(await asyncFileActions.fileExist(configFilePath).catch())) {
        await asyncFileActions.saveFile(configFilePath, JSON.stringify(getDefaultCdsConfig()));
    }
    let readConfig: string = '';
    while (readConfig === '')
        readConfig = (await asyncFileActions.readFile(configFilePath).catch((err) => console.log(err))) as string;
    //TEMPORARY BYPASS
    console.log(readConfig); // TODO: CRITICAL ERROR, SOMETIMES "" DONT NOW WHY
    return JSON.parse(readConfig) as CdsConfigModel;
}; //TODO: add update of CDS file

export const useAppSetup = () => {
    const { setCdsConfig } = useCdsConfigActions();
    const loadProject = useLoadProject();
    return async () => {
        const cdsConfig = await getAppConfig();
        setCdsConfig(cdsConfig);
        const projectsHistory = cdsConfig.projects.projectsHistory;
        if (projectsHistory.length) loadProject(projectsHistory[projectsHistory.length - 1]);
    };
};

export const useSaveCdsConfigToFile = () => {
    const cdsConfig = useCdsConfig();
    return async () => {
        await asyncFileActions.saveFile(remote.getGlobal('paths').configFile, JSON.stringify(cdsConfig));
    };
};
