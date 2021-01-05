import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { createAction, Action } from 'redux-actions';
import { ExecutionState } from '../models';

export enum ExecutionStateActions {
    SET_EXECUTION_STATE = 'SET_EXECUTION_STATE',
    BEGIN_COMPILATION = 'BEGIN_COMPILATION',
}

const actions = {
    setExecutionState: createAction<{ state: ExecutionState; details: string; sourceHash?: string }>(
        ExecutionStateActions.SET_EXECUTION_STATE
    ),
    beginCompilation: createAction<string>(ExecutionStateActions.BEGIN_COMPILATION),
};

export type ExecutionStateActionsPayload = typeof actions[keyof typeof actions] extends (...args: any[]) => Action<infer R>
    ? R
    : never;

export const useExecutionStateActions = () => {
    const dispatch = useDispatch();

    return useMemo(() => bindActionCreators(actions as any, dispatch), [dispatch]) as typeof actions;
};
