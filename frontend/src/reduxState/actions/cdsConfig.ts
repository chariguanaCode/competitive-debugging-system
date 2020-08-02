import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { createAction } from 'redux-actions';
import { CdsConfigModel } from '../models';

export enum CdsConfigActions {
    SET_CDS_CONFIG = 'SET_CDS_CONFIG',
}

export const useCdsConfigActions = () => {
    const dispatch = useDispatch();
    const actions = {
        setConfig: createAction<CdsConfigModel>(CdsConfigActions.SET_CDS_CONFIG),
    };

    return useMemo(() => bindActionCreators(actions as any, dispatch), [dispatch]) as typeof actions;
};
