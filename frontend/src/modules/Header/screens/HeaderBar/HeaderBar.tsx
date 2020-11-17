import React, { useState, memo } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Menu, MenuItem, ListItemText, ListItemIcon } from '@material-ui/core';
import { Apps, Settings, PlayArrow, Refresh, ViewQuilt, BugReport, Assessment, ViewList } from '@material-ui/icons';
import { ReactComponent as Logo } from 'assets/cds_logo.svg';
import { ReactComponent as LoadingIcon } from 'assets/icons/loading.svg';
import { useRunTasks } from 'backend/main';
import { useLoadProject, useSaveProject } from 'backend/projectManagement';
import { useConfig, useProjectFile, useExecutionState, useLayoutSelection } from 'reduxState/selectors';
import { ExecutionState } from 'reduxState/models';
import useStyles from './HeaderBar.css';
import { MainMenu } from 'modules/Menu/screens';
import { useConfigActions } from 'reduxState/actions';
import { useHotkeys } from 'react-hotkeys-hook';
import { useCommonState } from 'utils';

export const HeaderBar: React.FunctionComponent = memo(() => {
    const classes = useStyles();
    const [menuState, setMenuState, __setMenuState, _setMenuState] = useCommonState<{
        open: boolean;
        defaultSelectedSector?: string;
    }>({ open: false });
    const config = useConfig();
    const runTasks = useRunTasks();
    const loadProject = useLoadProject();
    const projectFile = useProjectFile();
    const saveProject = useSaveProject();
    //const reloadProject = useReloadProject()
    const executionState = useExecutionState();

    useHotkeys(
        //temporary here until i will figure out how to nicely send that information to that component
        'ctrl+s',
        () => {
            saveProject().catch((err) => {
                switch (err.code) {
                    case 0:
                        _setMenuState({
                            open: true,
                            defaultSelectedSector: 'SaveAs',
                        });
                        break;
                }
            });
        },
        {},
        [projectFile, config]
    );

    const [menuAnchor, setMenuAnchor] = useState<(EventTarget & HTMLButtonElement) | null>(null);
    const { selectLayout } = useConfigActions();
    const layoutSelection = useLayoutSelection();

    return (
        <>
            <AppBar position="relative" className={classes.appBar}>
                <Toolbar variant="dense">
                    <IconButton
                        onClick={() => _setMenuState((previousState) => ({ open: !previousState.open, defaultSelectedSector: undefined }))}
                        color="inherit"
                    >
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
                    <Typography className={classes.ExecutionStateContainer} color="inherit">
                        {ExecutionState[executionState.state]}
                        {ExecutionState[executionState.state] === 'Compiling' ? (
                            <LoadingIcon height={'18px'} width={'18px'} style={{ marginLeft: '8px' }} />
                        ) : null}
                    </Typography>

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
            <MainMenu
                deafultSelectedSector={menuState.defaultSelectedSector}
                open={menuState.open}
                isAnyProjectOpen={!!projectFile}
                handleClose={() => setMenuState('open', false)}
            />
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
});

export default HeaderBar;
