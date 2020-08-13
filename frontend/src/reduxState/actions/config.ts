import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { createAction, Action } from 'redux-actions';
import { ConfigModel, ProjectInfoModel, TestModel, LayoutModel } from '../models';

export enum ConfigActions {
    SET_CONFIG = 'SET_CONFIG',
    SET_PROJECT_INFO = 'SET_PROJECT_INFO',
    ADD_TESTS = 'ADD_TESTS',
    SET_LAYOUT = 'SET_LAYOUT',
    SELECT_LAYOUT = 'SELECT_LAYOUT',
}

const actions = {
    setConfig: createAction<ConfigModel>(ConfigActions.SET_CONFIG),
    setProjectInfo: createAction<ProjectInfoModel>(ConfigActions.SET_PROJECT_INFO),
    addTests: createAction<Array<TestModel>>(ConfigActions.ADD_TESTS),
    setLayout: createAction<{ key: keyof ConfigModel['layouts']; value: LayoutModel }>(ConfigActions.SET_LAYOUT),
    selectLayout: createAction<keyof ConfigModel['layouts']>(ConfigActions.SELECT_LAYOUT),
};

export type ConfigActionPayload = typeof actions[keyof typeof actions] extends (...args: any[]) => Action<infer R> ? R : never;

export const useConfigActions = () => {
    const dispatch = useDispatch();

    return useMemo(() => bindActionCreators(actions as any, dispatch), [dispatch]) as typeof actions;
};
