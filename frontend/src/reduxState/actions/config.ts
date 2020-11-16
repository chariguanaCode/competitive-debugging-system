import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { createAction, Action } from 'redux-actions';
import { ConfigModel, ProjectInfoModel, TestModel, LayoutModel, TrackedObject, TestGroupsModel } from '../models';

export enum ConfigActions {
    SET_CONFIG = 'SET_CONFIG',
    SET_PROJECT_INFO = 'SET_PROJECT_INFO',
    ADD_TESTS = 'ADD_TESTS',
    REMOVE_TESTS = 'REMOVE_TESTS',
    MOVE_TESTS = 'MOVE_TESTS',
    EDIT_TESTS = 'EDIT_TESTS',
    REMOVE_TESTS_GROUPS = 'REMOVE_TESTS_GROUPS',
    SET_LAYOUT = 'SET_LAYOUT',
    SELECT_LAYOUT = 'SELECT_LAYOUT',
    ADD_TRACKED_OBJECT = 'ADD_TRACKED_OBJECT',
    INCREASE_NEXT_GROUP_ID = 'INCREASE_NEXT_GROUP_ID',
    INCREASE_NEXT_TEST_ID = 'INCREASE_NEXT_TEST_ID',
    SET_NEXT_GROUP_ID = 'SET_NEXT_GROUP_ID',
    SET_NEXT_TEST_ID = 'SET_NEXT_TEST_ID',
}

const actions = {
    setConfig: createAction<ConfigModel>(ConfigActions.SET_CONFIG),
    setProjectInfo: createAction<ProjectInfoModel>(ConfigActions.SET_PROJECT_INFO),
    addTests: createAction<TestGroupsModel['groups']>(ConfigActions.ADD_TESTS),
    removeTests: createAction<{ [key: string]: Array<string> }>(ConfigActions.REMOVE_TESTS),
    moveTests: createAction<{ testsToMove: { [key: string]: Array<string> }; destinationGroupId: string }>(
        ConfigActions.MOVE_TESTS
    ),
    editTests: createAction<{ [key: string]: { [key: string]: { [key: string]: any } } }>(ConfigActions.EDIT_TESTS),
    removeTestsGroups: createAction<Array<string>>(ConfigActions.REMOVE_TESTS_GROUPS),
    setLayout: createAction<{ key: keyof ConfigModel['layouts']; value: LayoutModel }>(ConfigActions.SET_LAYOUT),
    selectLayout: createAction<keyof ConfigModel['layouts']>(ConfigActions.SELECT_LAYOUT),
    addTrackedObject: createAction<{ name: string; type: TrackedObject['type'] }>(ConfigActions.ADD_TRACKED_OBJECT),
    increaseNextGroupId: createAction<number>(ConfigActions.INCREASE_NEXT_GROUP_ID),
    increaseNextTestId: createAction<number>(ConfigActions.INCREASE_NEXT_TEST_ID),
    setNextGroupId: createAction<TestGroupsModel['nextGroupId']>(ConfigActions.SET_NEXT_GROUP_ID),
    setNextTestId: createAction<TestGroupsModel['nextTestId']>(ConfigActions.SET_NEXT_TEST_ID),
};

export type ConfigActionPayload = typeof actions[keyof typeof actions] extends (...args: any[]) => Action<infer R> ? R : never;

export const useConfigActions = () => {
    const dispatch = useDispatch();

    return useMemo(() => bindActionCreators(actions as any, dispatch), [dispatch]) as typeof actions;
};
