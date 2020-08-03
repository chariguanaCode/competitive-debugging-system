import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { createAction } from 'redux-actions';
import { WatchesActionsHistoryModel } from '../models';

export enum WatchesActionsHistoryActions {
    SET_WATCHES_ACTIONS_HISTORY = 'SET_WATCHES_ACTIONS_HISTORY',
}

const actions = {
    setWatchesActionsHistory: createAction<WatchesActionsHistoryModel>(WatchesActionsHistoryActions.SET_WATCHES_ACTIONS_HISTORY),
};

export const useWatchesActionsHistory = () => {
    const dispatch = useDispatch();

    return useMemo(() => bindActionCreators(actions as any, dispatch), [dispatch]) as typeof actions;
};
