import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Menu, MenuItem, ListItemText, ListItemIcon } from '@material-ui/core';
import { Apps, Settings, PlayArrow, Refresh, ViewQuilt, BugReport, Assessment, ViewList, Add } from '@material-ui/icons';
import { ReactComponent as Logo } from 'assets/cds_logo.svg';
import { useRunTasks } from 'backend/main';
import { useLoadProject } from 'backend/projectManagement';
import { useConfig, useProjectFile, useExecutionState, useLayoutSelection } from 'reduxState/selectors';
import { ExecutionState } from 'reduxState/models';
import useStyles from './HeaderBar.css';
import { MainMenu } from 'modules/Menu/screens';
import { useConfigActions } from 'reduxState/actions';

export const HeaderBar: React.FunctionComponent = () => {
    const classes = useStyles();
    const [menuOpen, setMenuOpen] = useState(false);
    const config = useConfig();
    const runTasks = useRunTasks();
    const loadProject = useLoadProject();
    const projectFile = useProjectFile();
    //const reloadProject = useReloadProject()
    const executionState = useExecutionState();

    const [menuAnchor, setMenuAnchor] = useState<(EventTarget & HTMLButtonElement) | null>(null);
    const { selectLayout } = useConfigActions();
    const layoutSelection = useLayoutSelection();

    const addNewTab = () => {
        document.dispatchEvent(new Event('addNewTab'));
    };

    return (
        <>
            <AppBar position="relative" className={classes.appBar}>
                <Toolbar variant="dense">
                    <IconButton onClick={() => setMenuOpen((previousState) => !previousState)} color="inherit">
                        <Apps color="inherit" />
                    </IconButton>
                    <Logo className={classes.logo} width={66} height={50} />
                    <Button
                        variant="text"
                        color="secondary"
                        className={classes.margin}
                        startIcon={<ViewQuilt color="inherit" />}
                        onClick={(event) => {
                            setMenuAnchor(event.currentTarget);
                        }}
                    >
                        View
                    </Button>
                    <Typography className={classes.margin} color="inherit">
                        {projectFile && config.projectInfo.name}
                        {projectFile && !projectFile.isSaved && ' *'}
                    </Typography>
                    <Typography className={classes.margin} color="inherit">
                        {ExecutionState[executionState.state]}
                    </Typography>

                    <div style={{ flexGrow: 1 }} />

                    <IconButton color="inherit" onClick={addNewTab}>
                        <Add color="inherit" />
                    </IconButton>
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
            <MainMenu open={menuOpen} isAnyProjectOpen={!!projectFile} handleClose={() => setMenuOpen(false)} />
            <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={() => setMenuAnchor(null)}>
                {[
                    { icon: <BugReport color="inherit" />, label: 'Debugging', layout: 'debugging' as 'debugging' },
                    { icon: <Assessment color="inherit" />, label: 'Outputs', layout: 'outputs' as 'outputs' },
                    { icon: <ViewList color="inherit" />, label: 'Tests', layout: 'tests' as 'tests' },
                ].map((element) => (
                    <MenuItem
                        key={`SelectView-MenuItem-${element.label}`}
                        selected={element.layout === layoutSelection}
                        onClick={() => {
                            setMenuAnchor(null);
                            selectLayout(element.layout);
                        }}
                    >
                        <ListItemIcon>{element.icon}</ListItemIcon>
                        <ListItemText primary={element.label} />
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default HeaderBar;
