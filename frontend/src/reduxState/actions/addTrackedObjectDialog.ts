import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { createAction } from 'redux-actions';

export enum AddTrackedObjectDialogActions {
    OPEN_ADD_TRACKED_OBJECT_DIALOG = 'OPEN_ADD_TRACKED_OBJECT_DIALOG',
    CLOSE_ADD_TRACKED_OBJECT_DIALOG = 'CLOSE_ADD_TRACKED_OBJECT_DIALOG',
}

const actions = {
    openAddTrackedObjectDialog: createAction(AddTrackedObjectDialogActions.OPEN_ADD_TRACKED_OBJECT_DIALOG),
    closeAddTrackedObjectDialog: createAction(AddTrackedObjectDialogActions.CLOSE_ADD_TRACKED_OBJECT_DIALOG),
};

export const useAddTrackedObjectDialogActions = () => {
    const dispatch = useDispatch();

    return useMemo(() => bindActionCreators(actions as any, dispatch), [dispatch]) as typeof actions;
};
