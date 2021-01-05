import { handleActions } from 'redux-actions';
import { ConfigActions, ConfigActionPayload } from '../actions';
import {
    ConfigModel,
    TestModel,
    ProjectInfoModel,
    LayoutModel,
    TrackedObject,
    TestGroupsModel,
    WatchIdActionsModel,
} from '../models';
import getDefaultConfig from 'data/getDefaultConfig';

export const configReducer = handleActions<ConfigModel, ConfigActionPayload>(
    {
        [ConfigActions.SET_CONFIG]: (state, action) => Object.assign({}, state, action.payload) as ConfigModel,
        [ConfigActions.SET_PROJECT_INFO]: (state, action) => ({ ...state, projectInfo: action.payload } as ConfigModel),
        [ConfigActions.INCREASE_NEXT_GROUP_ID]: (state, action) => ({
            ...state,
            tests: {
                ...state.tests,
                nextGroupId: (Number(state.tests.nextGroupId) + (action.payload as number)).toString(),
            },
        }),
        [ConfigActions.INCREASE_NEXT_TEST_ID]: (state, action) => ({
            ...state,
            tests: { ...state.tests, nextTestId: (Number(state.tests.nextTestId) + (action.payload as number)).toString() },
        }),
        [ConfigActions.REMOVE_TESTS]: (state, action) => {
            // TODO: do it in a better way
            const payload: { [key: string]: Array<string> } = action.payload as { [key: string]: Array<string> };
            let newGroups: TestGroupsModel['groups'] = {};

            Object.entries(payload).forEach(([groupId, testsIds]) => {
                newGroups[groupId] = Object.assign({}, state.tests.groups[groupId]);
                newGroups[groupId].tests = Object.assign({}, state.tests.groups[groupId].tests);
                for (let testId of testsIds) {
                    delete newGroups[groupId].tests[testId];
                }
            });
            return {
                ...state,
                tests: {
                    ...state.tests,
                    groups: {
                        ...state.tests.groups,
                        ...newGroups,
                    },
                },
            };
        },
        [ConfigActions.EDIT_TESTS]: (state, action) => {
            // TODO: do it in a better way
            const payload: {
                [key: string]: { [key: string]: { [key: string]: any } };
            } = action.payload as {
                [key: string]: { [key: string]: { [key: string]: any } };
            };
            let newGroups: TestGroupsModel['groups'] = {};

            Object.entries(payload).forEach(([groupId, tests]) => {
                if (!(groupId in newGroups)) {
                    newGroups[groupId] = Object.assign({}, state.tests.groups[groupId]);
                    newGroups[groupId].tests = Object.assign({}, state.tests.groups[groupId].tests);
                }
                Object.entries(tests).forEach(([testId, testValue]) => {
                    let newTestValue = Object.assign({}, state.tests.groups[groupId].tests[testId]);
                    for (let property of ['name', 'inputPath', 'outputPath'] as Array<keyof TestModel>) {
                        if (property in testValue) newTestValue[property] = testValue[property];
                    }
                    if ('groupId' in testValue) {
                        if (!(testValue['groupId'] in newGroups)) {
                            newGroups[testValue['groupId']] = Object.assign({}, state.tests.groups[testValue['groupId']]);
                            newGroups[testValue['groupId']].tests = Object.assign(
                                {},
                                state.tests.groups[testValue['groupId']].tests
                            );
                        }
                        delete newGroups[groupId].tests[testId];
                        newGroups[testValue['groupId']].tests[testId] = newTestValue;
                    } else newGroups[groupId].tests[testId] = newTestValue;
                });
            });
            return {
                ...state,
                tests: {
                    ...state.tests,
                    groups: {
                        ...state.tests.groups,
                        ...newGroups,
                    },
                },
            };
        },
        [ConfigActions.REMOVE_TESTS_GROUPS]: (state, action) => {
            // TODO: do it in a better way
            const payload: Array<string> = action.payload as Array<string>;
            let newGroups: TestGroupsModel['groups'] = Object.assign({}, state.tests.groups);
            for (let groupId of payload) {
                delete newGroups[groupId];
            }
            return {
                ...state,
                tests: {
                    ...state.tests,
                    groups: {
                        ...newGroups,
                    },
                },
            };
        },
        [ConfigActions.MOVE_TESTS]: (state, action) => {
            // TODO: do it in a better way
            const {
                testsToMove,
                destinationGroupId,
            }: {
                testsToMove: { [key: string]: Array<string> };
                destinationGroupId: string;
            } = action.payload as {
                testsToMove: { [key: string]: Array<string> };
                destinationGroupId: string;
            };
            let newGroups: TestGroupsModel['groups'] = {};
            let testsToAdd: { [key: string]: TestModel } = {};
            for (let groupId in testsToMove) {
                if (groupId in state.tests.groups) {
                    newGroups[groupId] = Object.assign({}, state.tests.groups[groupId]);
                    newGroups[groupId].tests = Object.assign({}, state.tests.groups[groupId].tests);
                    for (let testId of testsToMove[groupId]) {
                        testsToAdd[testId] = Object.assign({}, newGroups[groupId].tests[testId]);
                        delete newGroups[groupId].tests[testId];
                    }
                }
            }
            newGroups[destinationGroupId] = state.tests.groups[destinationGroupId];
            newGroups[destinationGroupId].tests = Object.assign({}, state.tests.groups[destinationGroupId].tests, testsToAdd);
            return {
                ...state,
                tests: {
                    ...state.tests,
                    groups: {
                        ...state.tests.groups,
                        ...newGroups,
                    },
                },
            };
        },
        [ConfigActions.ADD_TESTS]: (state, action) => {
            // TODO: do it in a better way
            const payload: TestGroupsModel['groups'] = action.payload as TestGroupsModel['groups'];
            let newGroups: TestGroupsModel['groups'] = {};
            for (let groupId in payload) {
                if (groupId in state.tests.groups) {
                    newGroups[groupId] = { tests: {}, name: '', timeLimit: '', maximumRunningTime: '' };
                    newGroups[groupId].tests =
                        Object.keys(newGroups[groupId]).length > 0
                            ? Object.assign({}, state.tests.groups[groupId].tests, payload[groupId].tests)
                            : state.tests.groups[groupId].tests;
                    for (const property of ['name', 'timeLimit', 'maximumRunningTime'] as [
                        'name',
                        'timeLimit',
                        'maximumRunningTime'
                    ])
                        if (property in payload[groupId]) {
                            newGroups[groupId][property] = payload[groupId][property];
                        } else {
                            newGroups[groupId][property] = state.tests.groups[groupId][property];
                        }
                } else {
                    newGroups[groupId] = payload[groupId];
                }
            }
            return {
                ...state,
                tests: {
                    ...state.tests,
                    groups: {
                        ...state.tests.groups,
                        ...newGroups,
                    },
                },
            };
        },
        [ConfigActions.SET_LAYOUT]: (state, action) => {
            const payload = action.payload as { key: keyof ConfigModel['layouts']; value: LayoutModel };
            return {
                ...state,
                layouts: {
                    ...state.layouts,
                    [payload.key]: payload.value,
                },
            };
        },
        [ConfigActions.SELECT_LAYOUT]: (state, action) => ({
            ...state,
            layoutSelection: action.payload as keyof ConfigModel['layouts'],
        }),
        [ConfigActions.ADD_TRACKED_OBJECT]: (state, action) => ({
            ...state,
            trackedObjects: [...state.trackedObjects, action.payload as { name: string; type: TrackedObject['type'] }],
        }),
        [ConfigActions.SET_WATCH_ID_ACTIONS]: (state, action) => {
            const payload = action.payload as { cds_id: string; value: WatchIdActionsModel[string] };
            return {
                ...state,
                watchesIdsActions: {
                    ...state.watchesIdsActions,
                    [payload.cds_id]: payload.value,
                },
            };
        },
    },
    getDefaultConfig()
);

export default configReducer;
