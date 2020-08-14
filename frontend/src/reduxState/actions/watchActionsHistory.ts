import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { createAction, Action } from 'redux-actions';
import { WatchActionsHistoryModel } from '../models';

export enum WatchActionsHistoryActions {
    SET_WATCH_ACTIONS_HISTORY = 'SET_WATCH_ACTIONS_HISTORY',
    ADD_TO_WATCH_ACTIONS_HISTORY = 'ADD_TO_WATCH_ACTIONS_HISTORY',
    SET_WATCH_HISTORY_LOCATION = 'SET_WATCH_HISTORY_LOCATION',
}

const actions = {
    setWatchActionsHistory: createAction<WatchActionsHistoryModel['history']>(WatchActionsHistoryActions.SET_WATCH_ACTIONS_HISTORY),
    addToWatchActionsHistory: createAction<WatchActionsHistoryModel['history']>(WatchActionsHistoryActions.ADD_TO_WATCH_ACTIONS_HISTORY),
    setWatchHistoryLocation: createAction<string>(WatchActionsHistoryActions.SET_WATCH_HISTORY_LOCATION),
};

export type WatchActionsHistoryActionPayload = typeof actions[keyof typeof actions] extends (...args: any[]) => Action<infer R>
    ? R
    : never;

export const useWatchActionsHistoryActions = () => {
    const dispatch = useDispatch();

    return useMemo(() => bindActionCreators(actions as any, dispatch), [dispatch]) as typeof actions;
};
