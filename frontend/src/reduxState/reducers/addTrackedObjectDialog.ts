import { handleActions } from 'redux-actions';
import { AddTrackedObjectDialogActions } from '../actions';
import { AddTrackedObjectDialogModel } from '../models';

export const executionStateReducer = handleActions<AddTrackedObjectDialogModel>(
    {
        [AddTrackedObjectDialogActions.OPEN_ADD_TRACKED_OBJECT_DIALOG]: (state, action) => true,
        [AddTrackedObjectDialogActions.CLOSE_ADD_TRACKED_OBJECT_DIALOG]: (state, action) => false,
    },
    false
);

export default executionStateReducer;
