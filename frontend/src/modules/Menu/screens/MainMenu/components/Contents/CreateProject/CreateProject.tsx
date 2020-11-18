import React, { memo, useEffect, useRef, useState } from 'react';
import { Button } from '@material-ui/core';
import { useSaveNotSavedProjectFile, useLoadProject } from 'backend/projectManagement';
import { getDefaultConfig } from 'data';
import { useConfigActions } from 'reduxState/actions';
import { useConfig } from 'reduxState/selectors';
import { ContentProps } from '../Types';
import useStyles from './CreateProject.css';

export const CreateProject: React.FunctionComponent<ContentProps> = memo(({ setFileManagerConfig, closeMainMenu }) => {
    const classes = useStyles();
    const { setConfig } = useConfigActions();
    // TODO: i think there is much better way of doing this
    const isUpdatedConfigSaved = useRef<boolean>(true);
    const [isLoading, setLoadingStatus] = useState<boolean>(false);
    const config = useConfig();
    const saveNotSavedProjectFile = useSaveNotSavedProjectFile();
    const loadProject = useLoadProject();

    useEffect(() => {
        /** when config is set, save .nsp.cdsp file **/
        /** TODO: it should be called only after setNewConfig call, not after mount */
        let saveAndLoadConfig = async () => {
            isUpdatedConfigSaved.current = true;
            const projectPath = await saveNotSavedProjectFile();
            loadProject(projectPath);
            setLoadingStatus(false);
            closeMainMenu();
        };

        if (!isUpdatedConfigSaved.current) saveAndLoadConfig();
    }, [config]);

    const setNewConfig = (files: Array<string> | null) => {
        setLoadingStatus(true);
        const newConfig = getDefaultConfig();
        if (files) newConfig.projectInfo.files = files;
        isUpdatedConfigSaved.current = false;
        setConfig(newConfig);
    };

    const newProjectFromOneCppFile = () => {
        return setFileManagerConfig({
            maxNumberOfSelectedFiles: 1,
            selectFiles: setNewConfig,
            open: true,
            acceptableFilesExtensions: ['.cpp'],
            visibleFilesExtensions: ['DIRECTORY', '.cpp', '.txt'],
        });
    };
    const newProjectFromManyCppFiles = () => {
        return setFileManagerConfig({
            maxNumberOfSelectedFiles: Infinity,
            selectFiles: newProjectFromManyCppFiles,
            open: true,
            acceptableFilesExtensions: ['.cpp'],
            visibleFilesExtensions: ['DIRECTORY', '.cpp'],
        });
    };
    const newEmptyProject = () => setNewConfig(null);

    return (
        <div className={classes.Buttons}>
            <Button disabled={isLoading} onClick={() => newProjectFromOneCppFile()}>
                One .cpp file
            </Button>
            <Button disabled={true || isLoading} onClick={() => newEmptyProject()}>
                Empty
            </Button>
            <Button disabled={true || isLoading} onClick={() => newProjectFromManyCppFiles()}>
                Many .cpp files
            </Button>
        </div>
    );
});

export default CreateProject;
