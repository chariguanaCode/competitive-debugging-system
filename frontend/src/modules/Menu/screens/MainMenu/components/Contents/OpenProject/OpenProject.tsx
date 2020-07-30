import React, { memo, useState } from 'react';
import { Button } from '@material-ui/core';
import { useLoadProject } from 'backend/projectManagement';
import { ContentProps } from '../Types';
import useStyles from './OpenProject.css';

export const OpenProject: React.FunctionComponent<ContentProps> = memo(({ setFileManagerConfig, closeMainMenu }) => {
    const classes = useStyles();
    const [isLoading, setLoadingStatus] = useState<boolean>(false);
    const loadProject = useLoadProject();

    const loadNewConfig = (files: Array<string> | null) => {
        if (!files) return;
        setLoadingStatus(true);
        loadProject(files[0]);
        closeMainMenu();
    };

    const openProject = () => {
        return setFileManagerConfig({
            maxNumberOfSelectedFiles: 1,
            selectFiles: loadNewConfig,
            open: true,
            acceptableFilesExtensions: ['.cdsp'],
            visibleFilesExtensions: ['DIRECTORY', '.cdsp'],
        });
    };
    return (
        <div>
            <Button disabled={isLoading} onClick={() => openProject()}>
                Open project
            </Button>
        </div>
    );
});

export default OpenProject;
