import React, { memo, useEffect, useRef, useState } from 'react';
import { Button } from '@material-ui/core';
import { useSaveNotSavedProjectFile, useLoadProject } from 'backend/projectManagement';
import { getDefaultConfig } from 'data';
import { FileType } from 'modules/FileManager/Types';
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
            maxNumberOfFiles: 1,
            onSelectFiles: setNewConfig,
            isOpen: true,
            acceptableFileTypes: ['.cpp'],
            availableFilesTypes: ['DIRECTORY', '.cpp'],
        });
    };
    const newProjectFromManyCppFiles = () => {
        return setFileManagerConfig({
            maxNumberOfFiles: Infinity,
            onSelectFiles: newProjectFromManyCppFiles,
            isOpen: true,
            acceptableFileTypes: ['.cpp'],
            availableFilesTypes: ['DIRECTORY', '.cpp'],
        });
    };
    const newEmptyProject = () => setNewConfig(null);

    return (
        <div>
            <Button disabled={isLoading} onClick={() => newProjectFromOneCppFile()}>
                New project from one .cpp file
            </Button>
            <Button disabled={isLoading} onClick={() => newEmptyProject()}>
                New empty project
            </Button>
            <Button disabled={isLoading} onClick={() => newProjectFromManyCppFiles()}>
                New project from many .cpp files
            </Button>
        </div>
    );
});

export default CreateProject;
