import { handleActions } from 'redux-actions';
import { ExecutionStateActions } from '../actions';
import { ExecutionStateModel, ExecutionState } from '../models';

export const executionStateReducer = handleActions<ExecutionStateModel>(
    {
        [ExecutionStateActions.SET_EXECUTION_STATE]: (state, action) => action.payload,
    },
    { state: ExecutionState.NoProject, details: '' }
);

export default executionStateReducer;
