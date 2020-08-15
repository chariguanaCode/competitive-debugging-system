import React, { memo } from 'react';
import useStyles from './Information.css';
import { ContentProps } from '../Types';
import { useProjectFile, useConfig } from 'reduxState/selectors';

export const Information: React.FunctionComponent<ContentProps> = memo(({ setFileManagerConfig, closeMainMenu }) => {
    const classes = useStyles();
    const config = useConfig();
    const projectFile = useProjectFile();
    // TODO: handle css
    return (
        <>
            <div className={classes.Information}>
                <div>Project name: {config.projectInfo.name}</div>
                <div>Project description: {config.projectInfo.description}</div>
                <div>Project author: {config.projectInfo.author}</div>
                <div>Creation date: {config.projectInfo.createDate}</div>
                <div>Total time spent: {config.projectInfo.totalTimeSpent}</div>
            </div>
        </>
    );
});

export default Information;
