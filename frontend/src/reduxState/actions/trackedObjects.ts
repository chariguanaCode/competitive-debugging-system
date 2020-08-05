import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { createAction, Action } from 'redux-actions';
import { TrackedObject } from '../models';

export enum TrackedObjectsActions {
    SET_SINGLE_TRACKED_OBJECT = 'SET_SINGLE_TRACKED_OBJECT',
}

const actions = {
    setSingleTrackedObject: createAction<{ id: string; value: TrackedObject }, string, TrackedObject>(
        TrackedObjectsActions.SET_SINGLE_TRACKED_OBJECT,
        (id, value) => ({ id, value })
    ),
};

export type TrackedObjectsActionPayload = typeof actions[keyof typeof actions] extends (...args: any[]) => Action<infer R>
    ? R
    : never;

export const useTrackedObjectsActions = () => {
    const dispatch = useDispatch();

    return useMemo(() => bindActionCreators(actions as any, dispatch), [dispatch]) as typeof actions;
};
