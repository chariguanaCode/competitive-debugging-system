import React, { ReactElement, useEffect, useRef } from 'react';
import {
    useAllTasksState,
    useCurrentTaskState,
    useConfig,
    useTrackedObjects,
    useWatchHistoryLocation,
    useWatchActionsHistory,
    useCdsConfig,
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
import { useSaveTemporaryProjectFile } from 'backend/projectManagement';

export default function Daemons(): ReactElement {
    const cdsConfig = useCdsConfig();
    const saveCdsConfigToFile = useSaveCdsConfigToFile();
    useEffect(() => {
        if(Object.keys(cdsConfig).length) saveCdsConfigToFile();
    }, [cdsConfig]);
    const config = useConfig();
    const saveTemporaryProjectFile = useSaveTemporaryProjectFile()
    useEffect(() => {
        if(Object.keys(config).length) saveTemporaryProjectFile();
    }, [config]);

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

    useEffect(() => {
        if (![TaskState.Pending, TaskState.Running, undefined].includes(currentTaskProgress)) {
            readFileStream(
                config.tests[currentTask.id].inputPath + '.out',
                false,
                (data: Uint8Array) => setCurrentTaskStdout(new TextDecoder('utf-8').decode(data)),
                setCurrentTaskStdoutSize,
                () => {},
                () => {}
            );
            readFileStream(
                config.tests[currentTask.id].inputPath + '.err',
                true,
                (data: Uint8Array) => parseWatchblocks(data),
                setCurrentTaskWatchblocksSize,
                () => clearWatchblocks(),
                () => {
                    setCurrentTaskWatchblocks(readWatchblocks());
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
    ]);

    const watchHistoryLocation = useWatchHistoryLocation();
    const { setAllTrackedObjects } = useTrackedObjectsActions();
    const trackedObjects = useTrackedObjects();
    const actionsHistory = useWatchActionsHistory();
    const previousHistoryLocation = useRef('-1');

    useEffect(() => {
        if (previousHistoryLocation.current === watchHistoryLocation) return;

        // seeking to the nearest point in history that changed anything
        let startLocationNumber = parseInt(previousHistoryLocation.current);
        let endLocationNumber = parseInt(watchHistoryLocation);
        if (startLocationNumber < endLocationNumber) {
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
            for (let i = 0; i < actionsHistory[loc].actions.length && notFinished > 0; i++) {
                const currAction = actionsHistory[loc].actions[i];
                let shouldSkip = false as boolean;
                switch (currAction.type) {
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

                seekingState[currAction.targetObject].actionStack.push(currAction);
                switch (currAction.type) {
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
                            const currAction = seekingState[key].actionStack.pop() ?? { type: 'none' };
                            switch (currAction.type) {
                                case OneDimensionArrayActionType.set_whole:
                                    newTrackedObjects[key].value = [...currAction.value];
                                    break;
                                case OneDimensionArrayActionType.set_whole_color:
                                    newTrackedObjects[key].color = [...currAction.value];
                                    break;
                                case OneDimensionArrayActionType.set_cell:
                                    newTrackedObjects[key].value[currAction.index] = currAction.value;
                                    break;
                                case OneDimensionArrayActionType.set_cell_color:
                                    newTrackedObjects[key].color[currAction.index] = currAction.value;
                                    break;
                            }
                        }
                        break;
                    case 'array_2d':
                        while (seekingState[key].actionStack.length > 0) {
                            const currAction = seekingState[key].actionStack.pop() ?? { type: 'none' };
                            switch (currAction.type) {
                                case TwoDimensionArrayActionType.set_whole:
                                    for (const i in currAction.value)
                                        newTrackedObjects[key].value[i] = [...currAction.value[i]];
                                    break;
                                case TwoDimensionArrayActionType.set_whole_color:
                                    for (const i in currAction.value)
                                        newTrackedObjects[key].color[i] = [...currAction.value[i]];
                                    break;
                                case TwoDimensionArrayActionType.set_row:
                                    newTrackedObjects[key].value[currAction.index] = [...currAction.value];
                                    break;
                                case TwoDimensionArrayActionType.set_row_color:
                                    newTrackedObjects[key].color[currAction.index] = [...currAction.value];
                                    break;
                                case TwoDimensionArrayActionType.set_cell:
                                    newTrackedObjects[key].value[currAction.firstIndex] =
                                        newTrackedObjects[key].value[currAction.firstIndex] || [];

                                    (newTrackedObjects[key].value[currAction.firstIndex] as Array<string>)[
                                        currAction.secondIndex
                                    ] = currAction.value;
                                    break;
                                case TwoDimensionArrayActionType.set_cell_color:
                                    newTrackedObjects[key].color[currAction.firstIndex] =
                                        newTrackedObjects[key].color[currAction.firstIndex] || [];

                                    (newTrackedObjects[key].color[currAction.firstIndex] as Array<string>)[
                                        currAction.secondIndex
                                    ] = currAction.value;
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
    }, [watchHistoryLocation]);

    return <></>;
}
