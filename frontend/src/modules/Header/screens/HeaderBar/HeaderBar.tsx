import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import { Apps, Settings, PlayArrow, Refresh } from '@material-ui/icons';
import { styled } from '@material-ui/core/styles';

import { ReactComponent as Logo } from 'assets/cds_logo.svg';
import { useRunTasks } from 'backend/main';
import { useLoadProject } from 'backend/projectManagement';
import { useConfig, useExecutionState } from 'reduxState/selectors';
import { ExecutionState } from 'reduxState/models';
import useStyles from './HeaderBar.css';

export const MarginTypography = styled(Typography)(({ theme }) => ({
    marginLeft: theme.spacing(2),
}));

export const HeaderBar: React.FunctionComponent = () => {
    const classes = useStyles();
    const [menuOpen, setMenuOpen] = useState(false);
    const config = useConfig();
    const runTasks = useRunTasks();
    const loadProject = useLoadProject();
    //const reloadProject = useReloadProject()
    const executionState = useExecutionState();

    return (
        <>
            <AppBar position="relative" className={classes.appBar}>
                <Toolbar>
                    <IconButton onClick={() => setMenuOpen((previousState) => !previousState)} color="inherit">
                        <Apps color="inherit" />
                    </IconButton>
                    <MarginTypography color="inherit"></MarginTypography>
                    <Logo className={classes.logo} width={50} height={50} />
                    <MarginTypography color="inherit">{config.projectInfo.name}</MarginTypography>
                    <MarginTypography color="inherit">
                        {config.projectInfo.path && config.projectInfo.path + config.projectInfo.saveName}
                    </MarginTypography>
                    <MarginTypography color="inherit">{ExecutionState[executionState.state]}</MarginTypography>
                    <div style={{ flexGrow: 1 }} />

                    <IconButton color="inherit" onClick={runTasks}>
                        <PlayArrow color="inherit" />
                    </IconButton>
                    <IconButton
                        color="inherit"
                        onClick={() => loadProject('./cpp/testConfig.cdsp')} /*onClick={/*reloadProject}*/
                    >
                        <Refresh color="inherit" />
                    </IconButton>
                    <IconButton color="inherit">
                        <Settings color="inherit" />
                    </IconButton>
                </Toolbar>
            </AppBar>
            {/*<MainMenu open={menuOpen} isAnyProjectOpen={true} handleClose={() => setMenuOpen(false)} />*/}
        </>
    );
};

export default HeaderBar;
