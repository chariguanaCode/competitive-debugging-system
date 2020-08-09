import { handleActions } from 'redux-actions';
import { ConfigActions, ConfigActionPayload } from '../actions';
import { ConfigModel, TestModel } from '../models';
import getDefaultConfig from 'data/getDefaultConfig';

export const configReducer = handleActions<ConfigModel, ConfigActionPayload>(
    {
        [ConfigActions.SET_CONFIG]: (state, action) => (action.payload as unknown) as ConfigModel,
        [ConfigActions.SET_PROJECT_INFO]: (state, action) => ({ ...state, ...action.payload } as ConfigModel),
        [ConfigActions.ADD_TESTS]: (state, action) => ({
            ...state,
            tests: ([] as TestModel[]).concat(state.tests, (action.payload as unknown) as TestModel[]),
        }),
    },
    getDefaultConfig()
);

export default configReducer;
