import React, { memo, ReactNode } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Fab, CircularProgress, useTheme, Tooltip } from '@material-ui/core';
import { ToggleButtonGroup } from '@material-ui/lab';
import {
    Apps as AppsIcon,
    Settings as SettingsIcon,
    PlayArrow as PlayArrowIcon,
    Refresh as RefreshIcon,
    BugReport as BugReportIcon,
    Assessment as AssessmentIcon,
    ViewList as ViewListIcon,
    Add as AddIcon,
    FastForward as FastForwardIcon,
    Done as DoneIcon,
    Error as ErrorIcon,
    Build as BuildIcon,
    Help as HelpIcon,
    DoneAll as DoneAllIcon,
} from '@material-ui/icons';
import { ReactComponent as Logo } from 'assets/cds_logo.svg';
import { useRunTests } from 'backend/main';
import { useLoadProject, useSaveProject } from 'backend/projectManagement';
import { useConfig, useProjectFile, useExecutionState, useLayoutSelection, useCurrentTaskState } from 'reduxState/selectors';
import { ExecutionState } from 'reduxState/models';
import { useConfigActions } from 'reduxState/actions';
import useStyles from './HeaderBar.css';
import { MainMenu } from 'modules/Menu/screens';
import { useHotkeys } from 'react-hotkeys-hook';
import { useCommonState } from 'utils';
import { IconButtonWithTooltip, ToggleButtonWithTooltip } from 'components';

export const HeaderBar: React.FunctionComponent = memo(() => {
    const classes = useStyles();
    const theme = useTheme();
    const [menuState, setMenuState, __setMenuState, _setMenuState] = useCommonState<{
        open: boolean;
        defaultSelectedSector?: string;
    }>({ open: false });
    const config = useConfig();
    const runTests = useRunTests();
    const loadProject = useLoadProject();
    const projectFile = useProjectFile();
    const saveProject = useSaveProject();
    //const reloadProject = useReloadProject()
    const executionState = useExecutionState();
    const currentTaskState = useCurrentTaskState();

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

    const { selectLayout } = useConfigActions();
    const layoutSelection = useLayoutSelection();

    const addNewTab = () => {
        document.dispatchEvent(new Event('addNewTab'));
    };

    const viewOptions = [
        {
            icon: BugReportIcon,
            label: 'Debugging',
            layout: 'debugging',
            disabled: currentTaskState.id === '-1',
        },
        { icon: AssessmentIcon, label: 'Outputs', layout: 'outputs', disabled: currentTaskState.id === '-1' },
        { icon: ViewListIcon, label: 'Tests', layout: 'tests', disabled: false },
    ];

    const executionStateIcons = [
        <HelpIcon color="inherit" fontSize="small" />,
        <DoneIcon color="inherit" fontSize="small" />,
        <BuildIcon color="inherit" fontSize="small" />,
        <ErrorIcon color="inherit" fontSize="small" />,
        <SettingsIcon color="inherit" fontSize="small" />,
        <DoneAllIcon color="inherit" fontSize="small" />,
    ] as {
        [key in ExecutionState]: ReactNode;
    };
    const executionStateLabels = [
        'No project loaded',
        'Project loaded successfully',
        'Compiling...',
        'Compilation error',
        'Running...',
        'All tests finished',
    ] as {
        [key in ExecutionState]: string;
    };

    const executionStateWorking = [ExecutionState.Compiling, ExecutionState.Running].includes(executionState.state);

    return (
        <>
            <AppBar position="relative" className={classes.appBar}>
                <Toolbar variant="dense">
                    <IconButton
                        onClick={() =>
                            _setMenuState((previousState) => ({ open: !previousState.open, defaultSelectedSector: undefined }))
                        }
                        color="inherit"
                    >
                        <AppsIcon color="inherit" />
                    </IconButton>
                    <Logo className={classes.logo} width={66} height={50} />

                    <ToggleButtonGroup
                        size="small"
                        exclusive
                        value={layoutSelection}
                        onChange={(evt, val) => val && selectLayout(val)}
                    >
                        {viewOptions.map(({ label, layout, disabled, icon }) => (
                            <ToggleButtonWithTooltip
                                key={label}
                                value={layout}
                                tooltipText={label + (disabled ? ' - no current test' : '')}
                                disabled={disabled}
                                arrow
                            >
                                {React.createElement(icon, { color: 'inherit', fontSize: 'small' })}
                            </ToggleButtonWithTooltip>
                        ))}
                    </ToggleButtonGroup>

                    <Tooltip title={executionStateLabels[executionState.state]} arrow>
                        <div className={classes.executionStateContainer}>
                            <Fab
                                className={classes.executionStateIcon}
                                style={{
                                    color: theme.palette.getContrastText(theme.palette.executionState[executionState.state]),
                                    backgroundColor: theme.palette.executionState[executionState.state],
                                }}
                            >
                                <>{executionStateIcons[executionState.state]}</>
                            </Fab>
                            {executionStateWorking && (
                                <CircularProgress
                                    size={36}
                                    className={classes.executionStateSpinner}
                                    style={{ color: theme.palette.executionState[executionState.state] }}
                                />
                            )}
                        </div>
                    </Tooltip>
                    <Typography className={classes.margin} color="inherit">
                        {projectFile && config.projectInfo.name}
                        {projectFile && !projectFile.isSaved && ' *'}
                    </Typography>

                    <div style={{ flexGrow: 1 }} />

                    <IconButtonWithTooltip color="inherit" tooltipText="Add new tab" onClick={addNewTab}>
                        <AddIcon color="inherit" />
                    </IconButtonWithTooltip>
                    <IconButtonWithTooltip
                        color="inherit"
                        tooltipText="Rerun current test"
                        disabled={currentTaskState.id === '-1' || executionStateWorking}
                        onClick={() => runTests({ [currentTaskState.groupId]: [currentTaskState.id] })}
                    >
                        <PlayArrowIcon color="inherit" />
                    </IconButtonWithTooltip>
                    <IconButtonWithTooltip
                        color="inherit"
                        tooltipText="Run all tests"
                        disabled={executionStateWorking}
                        onClick={() => runTests()}
                    >
                        <FastForwardIcon color="inherit" />
                    </IconButtonWithTooltip>
                    <IconButtonWithTooltip
                        color="inherit"
                        tooltipText="Reload - WIP"
                        disabled={true}
                        onClick={() => loadProject('./cpp/testConfig.cdsp')} /*onClick={/*reloadProject}*/
                    >
                        <RefreshIcon color="inherit" />
                    </IconButtonWithTooltip>
                    <IconButtonWithTooltip color="inherit" tooltipText="Settings - WIP" disabled={true}>
                        <SettingsIcon color="inherit" />
                    </IconButtonWithTooltip>
                </Toolbar>
            </AppBar>
            <MainMenu
                deafultSelectedSector={menuState.defaultSelectedSector}
                open={menuState.open}
                isAnyProjectOpen={!!projectFile}
                handleClose={() => setMenuState('open', false)}
            />
        </>
    );
});

export default HeaderBar;
