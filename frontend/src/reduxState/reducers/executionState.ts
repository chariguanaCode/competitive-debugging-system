import { handleActions } from 'redux-actions';
import { ExecutionStateActions, ExecutionStateActionsPayload } from '../actions';
import { ExecutionStateModel, ExecutionState } from '../models';

export const executionStateReducer = handleActions<ExecutionStateModel, ExecutionStateActionsPayload>(
    {
        [ExecutionStateActions.SET_EXECUTION_STATE]: (state, action) => ({
            ...state,
            ...(action.payload as { state: ExecutionState; details: string; sourceHash?: string }),
        }),
        [ExecutionStateActions.BEGIN_COMPILATION]: (state, action) => ({
            state: ExecutionState.Compiling,
            details: '',
            sourceHash: action.payload as string,
        }),
    },
    { state: ExecutionState.NoProject, details: '', sourceHash: '' }
);

export default executionStateReducer;
