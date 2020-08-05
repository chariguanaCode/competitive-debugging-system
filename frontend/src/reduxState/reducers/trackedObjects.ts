import { handleActions } from 'redux-actions';
import { TrackedObjectsActions, TrackedObjectsActionPayload } from '../actions';
import { TrackedObjectsModel } from '../models';

export const trackedObjectsReducer = handleActions<TrackedObjectsModel, TrackedObjectsActionPayload>(
    {
        [TrackedObjectsActions.SET_SINGLE_TRACKED_OBJECT]: (state, action) => ({
            ...state,
            [action.payload.id]: action.payload.value,
        }),
    },
    {
        aaa: {
            type: 'array_1d',
            value: {
                value: [...Array(1000).keys()].map(() => Math.random()),
                color: [...Array(1000).keys()].map(() => ['none', 'red', 'blue'][Math.floor(Math.random() * 3)]),
            },
        },
        bbb: {
            type: 'array_2d',
            value: {
                value: Array.from(Array(1000)).map(() =>
                    Array.from(Array(Math.floor(Math.random() * 1000))).map(() => Math.floor(Math.random() * 100000))
                ),
                color: Array.from(Array(1000)).map(() =>
                    Array.from(Array(1000)).map(() => ['none', 'red', 'green'][Math.floor(Math.random() * 3)])
                ),
            },
        },
    }
);

export default trackedObjectsReducer;
