import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { createAction } from 'redux-actions';
import { ConfigModel, ProjectInfoModel } from '../models';

export enum ConfigActions {
    SET_CONFIG = 'SET_CONFIG',
    SET_PROJECT_INFO = 'SET_PROJECT_INFO',
}

export const useConfigActions = () => {
    const dispatch = useDispatch();
    const actions = {
        setConfig: createAction<ConfigModel>(ConfigActions.SET_CONFIG),
        setProjectInfo: createAction<ProjectInfoModel>(ConfigActions.SET_PROJECT_INFO),
    };

    return useMemo(() => bindActionCreators(actions as any, dispatch), [dispatch]) as typeof actions;
};
