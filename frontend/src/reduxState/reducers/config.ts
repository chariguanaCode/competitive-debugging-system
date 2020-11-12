import { handleActions } from 'redux-actions';
import { ConfigActions, ConfigActionPayload } from '../actions';
import { ConfigModel, TestModel, ProjectInfoModel, LayoutModel, TrackedObject, TestGroupsModel } from '../models';
import getDefaultConfig from 'data/getDefaultConfig';
import { group } from 'console';

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
            console.log(payload);
            Object.entries(payload).forEach(([groupId, testsIds]) => {
                console.log(groupId, testsIds);
                newGroups[groupId] = Object.assign({}, state.tests.groups[groupId]);
                console.log(state.tests.groups, groupId, newGroups[groupId]);
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
        [ConfigActions.ADD_TESTS]: (state, action) => {
            // TODO: do it in a better way
            const payload: TestGroupsModel['groups'] = action.payload as TestGroupsModel['groups'];
            let newGroups: TestGroupsModel['groups'] = {};
            for (let groupId in payload) {
                if (groupId in state.tests.groups) {
                    newGroups[groupId] = { tests: {}, name: '' };
                    newGroups[groupId].tests = Object.assign({}, state.tests.groups[groupId].tests, payload[groupId].tests);
                    if ('name' in payload[groupId]) {
                        newGroups[groupId].name = payload[groupId].name;
                    } else {
                        newGroups[groupId].name = state.tests.groups[groupId].name;
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
            const payload = (action.payload as unknown) as { key: keyof ConfigModel['layouts']; value: LayoutModel };
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
            layoutSelection: (action.payload as unknown) as keyof ConfigModel['layouts'],
        }),
        [ConfigActions.ADD_TRACKED_OBJECT]: (state, action) => ({
            ...state,
            trackedObjects: [
                ...state.trackedObjects,
                (action.payload as unknown) as { name: string; type: TrackedObject['type'] },
            ],
        }),
    },
    getDefaultConfig()
);

export default configReducer;
