import React, { memo } from 'react';
import useStyles from './RecentProjects.css';
import { ContentProps } from '../Types';
import { useCdsConfig } from 'reduxState/selectors';
import { useLoadProject } from 'backend/projectManagement';
import { Button } from '@material-ui/core';
export const RecentProjects: React.FunctionComponent<ContentProps> = memo(({ closeMainMenu }) => {
    const classes = useStyles();
    const cdsConfig = useCdsConfig();
    const loadProject = useLoadProject();
    // TODO: handle css
    return (
        <>
            <div className={classes.RecentProjects}>
                {cdsConfig.projects.projectsHistory.map((projectPath) => (
                    <Button
                        key={`RecentProjects-ProjectButton-${projectPath}`}
                        onClick={() => {
                            loadProject(projectPath);
                            closeMainMenu();
                        }}
                    >
                        {projectPath}
                    </Button>
                ))}
            </div>
        </>
    );
});

export default RecentProjects;
