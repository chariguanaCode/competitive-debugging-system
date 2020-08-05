import { handleActions } from 'redux-actions';
import { ConfigActions } from '../actions';
import { ConfigModel } from '../models';
import getDefaultConfig from 'data/getDefaultConfig';

export const configReducer = handleActions<ConfigModel>(
    {
        [ConfigActions.SET_CONFIG]: (state, action) => action.payload,
        [ConfigActions.SET_PROJECT_INFO]: (state, action) => ({ ...state, ...action.payload } as ConfigModel),
    },
    getDefaultConfig()
);

export default configReducer;
