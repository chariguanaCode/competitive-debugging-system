import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { createAction } from 'redux-actions';
import { ConfigModel } from '../models';

export enum ConfigActions {
    SET_CONFIG = 'SET_CONFIG',
}

const actions = {
    setConfig: createAction<ConfigModel>(ConfigActions.SET_CONFIG),
};

export const useConfigActions = () => {
    const dispatch = useDispatch();

    return useMemo(() => bindActionCreators(actions as any, dispatch), [dispatch]) as typeof actions;
};
