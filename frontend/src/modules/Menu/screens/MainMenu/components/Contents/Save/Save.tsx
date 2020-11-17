import React, { memo, useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { useSaveProject } from 'backend/projectManagement';
import useStyles from './Save.css';
import { useProjectFile } from 'reduxState/selectors';

export const Save = memo(() => {
    const classes = useStyles();
    const saveProject = useSaveProject();
    const projectFile = useProjectFile();
    const [isSaved, setSaveState] = useState(false);
    useEffect(() => {
        console.log('Saving...')
        saveProject();
    }, []);

    useEffect(() => {
        if (projectFile?.isSaved) setSaveState(true);
    }, [projectFile?.isSaved]);

    return <>{isSaved ? 'Saved' : 'Saving...'}</>;
});

export default Save;
