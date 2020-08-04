import { handleActions } from 'redux-actions';
import { ConfigActions } from '../actions';
import { ConfigModel, TestModel } from '../models';
import getDefaultConfig from 'data/getDefaultConfig';
import { Action } from 'flexlayout-react';
import { mergeArrays } from 'utils/tools';

export const configReducer = handleActions<ConfigModel>(
    {
        [ConfigActions.SET_CONFIG]: (state, action) => action.payload,
        [ConfigActions.SET_PROJECT_INFO]: (state, action) => ({ ...state, ...action.payload } as ConfigModel),
        [ConfigActions.ADD_TESTS]: (state, action) => ({
            ...state,
            //@ts-ignore TODO: fix ts
            tasks: ([] as TaskModel[]).concat(state.tasks, action.payload),
        }),
    },
    getDefaultConfig()
);

export default configReducer;
