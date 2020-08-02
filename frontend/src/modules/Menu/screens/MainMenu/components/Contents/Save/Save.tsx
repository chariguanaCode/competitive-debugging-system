import React, { memo } from 'react';
import { Button } from '@material-ui/core';
import { useSaveProject } from 'backend/projectManagement';
import useStyles from './Save.css';

export const Save = memo(() => {
    const classes = useStyles();
    const saveProject = useSaveProject();

    let save = () => saveProject();

    return (
        <>
            <Button onClick={save}>Save</Button>
        </>
    );
});

export default Save;
