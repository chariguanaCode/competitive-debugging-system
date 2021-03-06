import React, { ReactElement, useEffect, useRef, useState } from 'react';
import {
    useAllTasksState,
    useCurrentTaskState,
    useConfig,
    useTrackedObjects,
    useWatchHistoryLocation,
    useWatchActionsHistory,
    useCdsConfig,
    useProjectFile,
} from 'reduxState/selectors';
import {
    TaskState,
    WatchActionModel,
    OneDimensionArrayActionType,
    TrackedObjectsModel,
    TwoDimensionArrayActionType,
} from 'reduxState/models';
import { useTaskStatesActions, useTrackedObjectsActions } from 'reduxState/actions';
import { readFileStream } from 'backend/outputFileTracking';
import { useParseWatchblocks } from 'backend/watchParse';
import { useSaveCdsConfigToFile } from 'backend/appManangement';
import {
    useSaveTemporaryProjectFile,
    useSaveProject,
    useResetGivenGroupsTestsStates,
    useDeleteGivenTestsStates,
} from 'backend/projectManagement';
import { getFileBasename } from 'backend/asyncFileActions';
import { usePreviousEffect } from 'utils';

const remote = window.require('electron').remote;

export default function Daemons(): ReactElement {
    // const saveProject = useSaveProject();
    // const projectFile = useProjectFile();
    const resetGivenGroupsTestsStates = useResetGivenGroupsTestsStates();
    const deleteGivenTestsStates = useDeleteGivenTestsStates();
    const config = useConfig();
    const cdsConfig = useCdsConfig();
    const saveCdsConfigToFile = useSaveCdsConfigToFile(); /* TEMPORARY MOVED TO HEADER */

    /* useHotkeys(
        'ctrl+s',
        () => {
            saveProject().catch((err) => {
                switch (err.code) {
                    case 0:
                        break;
                }
            });
        },
        {},
        [projectFile, config]
    ); */

    useEffect(() => {
        if (Object.keys(cdsConfig).length) saveCdsConfigToFile();
    }, [cdsConfig]);

    usePreviousEffect(
        ([pvGroupsIndicators]: [typeof config.tests.groups]) => {
            let groupsToResetIds: Array<string> = [];
            let deletedTests: Array<string> = [];
            for (const groupId in config.tests.groups) {
                const isGroupIdInPvGroupsIndicators = groupId in pvGroupsIndicators;
                if (!isGroupIdInPvGroupsIndicators || config.tests.groups[groupId] !== pvGroupsIndicators[groupId]) {
                    if (isGroupIdInPvGroupsIndicators) {
                        deletedTests.push(
                            ...Object.keys(pvGroupsIndicators[groupId].tests).filter(
                                (testId) => !(testId in config.tests.groups[groupId].tests)
                            )
                        );
                    }
                }
            }
            groupsToResetIds.length && resetGivenGroupsTestsStates(groupsToResetIds);
            deletedTests.length && deleteGivenTestsStates(deletedTests);
        },
        [config.tests.groups]
    );
    const saveTemporaryProjectFile = useSaveTemporaryProjectFile();
    useEffect(() => {
        if (Object.keys(config).length) {
            saveTemporaryProjectFile();
        }
    }, [config.projectInfo, config.settings, config.tests, config.trackedObjects, config.watchesIdsActions]);

    // output parsing
    const taskStates = useAllTasksState();
    const currentTask = useCurrentTaskState();
    const { parseWatchblocks, readWatchblocks, clearWatchblocks } = useParseWatchblocks();
    const currentTaskProgress = taskStates.current[currentTask.id]?.state;
    const {
        setCurrentTaskStdout,
        setCurrentTaskStdoutSize,
        setCurrentTaskWatchblocks,
        setCurrentTaskWatchblocksSize,
    } = useTaskStatesActions();

    const defaultTestsOutputDirectory = remote.getGlobal('paths').testsOutputs;
    const projectTestsOutputDirectory = defaultTestsOutputDirectory + '/' + config.projectInfo.uuid + '/';

    // trackedObjects
    const watchHistoryLocation = useWatchHistoryLocation();
    const { setAllTrackedObjects } = useTrackedObjectsActions();
    const trackedObjects = useTrackedObjects();
    const actionsHistory = useWatchActionsHistory();
    const previousHistoryLocation = useRef('-1');

    // forcing reloading of trackedObjects on watch changes
    const [shouldTrackedObjectsReload, setForceTrackedObjectsCounter] = useState(0);

    const forceTrackedObjectsReload = () => {
        previousHistoryLocation.current = '-1';
        setForceTrackedObjectsCounter((val) => val + 1);
    };

    // output parsing
    // and forcing reloading of trackedObjects on watchesIdsActions changes
    useEffect(() => {
        if (![TaskState.Pending, TaskState.Running, undefined].includes(currentTaskProgress)) {
            readFileStream(
                projectTestsOutputDirectory + currentTask.id + '.out',
                false,
                (data: string) => setCurrentTaskStdout(data),
                setCurrentTaskStdoutSize,
                () => {},
                () => {}
            );
            readFileStream(
                projectTestsOutputDirectory + currentTask.id + '.err',
                true,
                (data: string) => parseWatchblocks(data),
                setCurrentTaskWatchblocksSize,
                () => clearWatchblocks(),
                () => {
                    setCurrentTaskWatchblocks(readWatchblocks());
                    forceTrackedObjectsReload();
                }
            );
        }
    }, [
        currentTask.id,
        currentTaskProgress,
        setCurrentTaskStdout,
        setCurrentTaskStdoutSize,
        setCurrentTaskWatchblocks,
        setCurrentTaskWatchblocksSize,
        config.watchesIdsActions,
    ]);

    // trackedObjects
    useEffect(() => {
        if (previousHistoryLocation.current === watchHistoryLocation) return;

        // seeking to the nearest point in history that changed anything
        let startLocationNumber = parseInt(previousHistoryLocation.current);
        let endLocationNumber = parseInt(watchHistoryLocation);
        if (startLocationNumber < endLocationNumber) {
            if (startLocationNumber !== -1)
                while (startLocationNumber < endLocationNumber && !actionsHistory[startLocationNumber.toString()])
                    startLocationNumber++;
            while (startLocationNumber < endLocationNumber && !actionsHistory[endLocationNumber.toString()])
                endLocationNumber--;
        } else {
            startLocationNumber = -1;
            while (startLocationNumber < endLocationNumber && !actionsHistory[endLocationNumber.toString()])
                endLocationNumber--;
        }

        if (startLocationNumber === endLocationNumber) return;

        const startLocation = startLocationNumber.toString();
        const endLocation = endLocationNumber.toString();

        let seekingState = {} as {
            [key: string]: {
                finished: {
                    value: boolean;
                    color: boolean;
                };
                actionStack: Array<WatchActionModel>;
            };
        };
        let notFinished = 0;
        let loc = endLocation;

        // initializing the object to hold changes for each tracked object
        for (const key in trackedObjects) {
            if (Object.prototype.hasOwnProperty.call(trackedObjects, key)) {
                seekingState[key] = {
                    finished: {
                        value: false,
                        color: false,
                    },
                    actionStack: [],
                };
                notFinished += 2;
            }
        }

        // going back in history from the destination point until all values are set
        while (notFinished > 0 && loc !== startLocation) {
            for (let i = actionsHistory[loc].actions.length - 1; i >= 0 && notFinished > 0; i--) {
                const currAction = actionsHistory[loc].actions[i];
                /* // buggy optimization
                let shouldSkip = false as boolean;
                switch (currAction.action) {
                    case OneDimensionArrayActionType.set_cell:
                    case TwoDimensionArrayActionType.set_row:
                    case TwoDimensionArrayActionType.set_cell:
                        shouldSkip = seekingState[currAction.targetObject].finished.value;
                        break;
                    case OneDimensionArrayActionType.set_cell_color:
                    case TwoDimensionArrayActionType.set_row_color:
                    case TwoDimensionArrayActionType.set_cell_color:
                        shouldSkip = seekingState[currAction.targetObject].finished.color;
                        break;
                }
                if (shouldSkip) continue;
                */

                seekingState[currAction.targetObject].actionStack.push(currAction);
                /* // buggy optimization
                switch (currAction.action) {
                    case OneDimensionArrayActionType.set_whole:
                    case TwoDimensionArrayActionType.set_whole:
                        seekingState[currAction.targetObject].finished.value = true;
                        notFinished--;
                        break;
                    case OneDimensionArrayActionType.set_whole_color:
                    case TwoDimensionArrayActionType.set_whole_color:
                        seekingState[currAction.targetObject].finished.color = true;
                        notFinished--;
                        break;
                }
                */
            }

            loc = actionsHistory[loc].previousKey;
        }

        let newTrackedObjects = {} as TrackedObjectsModel;
        for (const key in trackedObjects) {
            if (Object.prototype.hasOwnProperty.call(trackedObjects, key)) {
                // creating appropriate base values, to which the actions will be applied
                if (startLocationNumber === -1) {
                    switch (trackedObjects[key].type) {
                        case 'array_1d':
                            newTrackedObjects[key] = { type: 'array_1d', value: [], color: [] };
                            break;
                        case 'array_2d':
                            newTrackedObjects[key] = { type: 'array_2d', value: [[]], color: [[]] };
                            break;
                    }
                } else {
                    const element = trackedObjects[key];
                    switch (element.type) {
                        case 'array_1d':
                            newTrackedObjects[key] = {
                                type: 'array_1d',
                                value: [...element.value],
                                color: [...element.color],
                            };
                            break;
                        case 'array_2d':
                            newTrackedObjects[key] = {
                                type: 'array_2d',
                                value: [],
                                color: [],
                            };
                            for (const i in element.value) newTrackedObjects[key].value[i] = [...element.value[i]];
                            for (const i in element.color) newTrackedObjects[key].color[i] = [...element.color[i]];
                    }
                }

                // applying all actions from action stacks for the tracked objects
                switch (newTrackedObjects[key].type) {
                    case 'array_1d':
                        while (seekingState[key].actionStack.length > 0) {
                            const currAction = seekingState[key].actionStack.pop() ?? {
                                action: 'none',
                                payload: '',
                                targetObject: '',
                            };
                            switch (currAction.action) {
                                case OneDimensionArrayActionType.set_whole:
                                    newTrackedObjects[key].value = [...currAction.payload[0]];
                                    break;
                                case OneDimensionArrayActionType.set_whole_color:
                                    newTrackedObjects[key].color = [...currAction.payload[0]];
                                    break;
                                case OneDimensionArrayActionType.set_cell:
                                    newTrackedObjects[key].value[currAction.payload[0]] = currAction.payload[1];
                                    break;
                                case OneDimensionArrayActionType.set_cell_color:
                                    newTrackedObjects[key].color[currAction.payload[0]] = currAction.payload[1];
                                    break;
                                case OneDimensionArrayActionType.clear_whole:
                                    newTrackedObjects[key].value = [];
                                    break;
                                case OneDimensionArrayActionType.clear_whole_color:
                                    newTrackedObjects[key].color = [];
                                    break;
                            }
                        }
                        break;
                    case 'array_2d':
                        while (seekingState[key].actionStack.length > 0) {
                            const currAction = seekingState[key].actionStack.pop() ?? {
                                action: 'none',
                                payload: '',
                                targetObject: '',
                            };
                            switch (currAction.action) {
                                case TwoDimensionArrayActionType.set_whole:
                                    for (const i in currAction.payload[0] as Array<string>)
                                        newTrackedObjects[key].value[i] = [...currAction.payload[0][i]];
                                    break;
                                case TwoDimensionArrayActionType.set_whole_color:
                                    for (const i in currAction.payload[0] as Array<string>)
                                        newTrackedObjects[key].color[i] = [...currAction.payload[0][i]];
                                    break;
                                case TwoDimensionArrayActionType.set_row:
                                    newTrackedObjects[key].value[currAction.payload[0]] = [...currAction.payload[1]];
                                    break;
                                case TwoDimensionArrayActionType.set_row_color:
                                    newTrackedObjects[key].color[currAction.payload[0]] = [...currAction.payload[1]];
                                    break;
                                case TwoDimensionArrayActionType.set_cell:
                                    newTrackedObjects[key].value[currAction.payload[0]] =
                                        newTrackedObjects[key].value[currAction.payload[0]] || [];

                                    (newTrackedObjects[key].value[currAction.payload[0]] as Array<string>)[
                                        currAction.payload[1]
                                    ] = currAction.payload[2];
                                    break;
                                case TwoDimensionArrayActionType.set_cell_color:
                                    newTrackedObjects[key].color[currAction.payload[0]] =
                                        newTrackedObjects[key].color[currAction.payload[0]] || [];

                                    (newTrackedObjects[key].color[currAction.payload[0]] as Array<string>)[
                                        currAction.payload[1]
                                    ] = currAction.payload[2];
                                    break;
                                case TwoDimensionArrayActionType.clear_whole:
                                    newTrackedObjects[key].value = [];
                                    break;
                                case TwoDimensionArrayActionType.clear_whole_color:
                                    newTrackedObjects[key].color = [];
                                    break;
                            }
                        }
                        break;
                }
            }
        }

        setAllTrackedObjects(newTrackedObjects);

        previousHistoryLocation.current = watchHistoryLocation;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchHistoryLocation, shouldTrackedObjectsReload]);

    return <></>;
}
