import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { createAction } from 'redux-actions';
import { ExecutionStateModel } from '../models';

export enum ExecutionStateActions {
    SET_EXECUTION_STATE = 'SET_EXECUTION_STATE',
}

export const useExecutionStateActions = () => {
    const dispatch = useDispatch();
    const actions = {
        setExecutionState: createAction<ExecutionStateModel>(ExecutionStateActions.SET_EXECUTION_STATE),
    };

    return useMemo(() => bindActionCreators(actions as any, dispatch), [dispatch]) as typeof actions;
};
