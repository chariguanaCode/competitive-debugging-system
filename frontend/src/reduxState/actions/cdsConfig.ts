import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { createAction } from 'redux-actions';
import { CdsConfigModel } from '../models';

export enum CdsConfigActions {
    SET_CDS_CONFIG = 'SET_CDS_CONFIG',
    PUSH_PROJECT_TO_PROJECTS_HISTORY = 'PUSH_PROJECT_TO_PROJECTS_HISTORY',
}

export const useCdsConfigActions = () => {
    const dispatch = useDispatch();
    const actions = {
        setCdsConfig: createAction<CdsConfigModel>(CdsConfigActions.SET_CDS_CONFIG),
        pushProjectToProjectsHistory: createAction<string>(CdsConfigActions.PUSH_PROJECT_TO_PROJECTS_HISTORY),
    };

    return useMemo(() => bindActionCreators(actions as any, dispatch), [dispatch]) as typeof actions;
};
