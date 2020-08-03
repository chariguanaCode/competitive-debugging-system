import { handleActions } from 'redux-actions';
import { WatchesActionsHistoryActions } from '../actions';
import { WatchesActionsHistoryModel } from '../models';

export const watchesActionsHistoryReducer = handleActions<WatchesActionsHistoryModel>(
    {
        [WatchesActionsHistoryActions.SET_WATCHES_ACTIONS_HISTORY]: (state, action) => action.payload,
    },
    []
);

export default watchesActionsHistoryReducer;
