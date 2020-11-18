import { handleActions } from 'redux-actions';
import { TrackedObjectsActions, TrackedObjectsActionPayload } from '../actions';
import { TrackedObject, TrackedObjectsModel } from '../models';

export const trackedObjectsReducer = handleActions<TrackedObjectsModel, TrackedObjectsActionPayload>(
    {
        [TrackedObjectsActions.SET_ALL_TRACKED_OBJECTS]: (state, action) => {
            const payload = action.payload as TrackedObjectsModel;
            return {
                ...state,
                ...payload,
            };
        },
        [TrackedObjectsActions.SET_SINGLE_TRACKED_OBJECT]: (state, action) => {
            const payload = action.payload as { id: string; value: TrackedObject };
            return {
                ...state,
                [payload.id]: payload.value,
            };
        },
    },
    {}
);

export default trackedObjectsReducer;
