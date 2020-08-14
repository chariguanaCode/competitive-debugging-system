import { handleActions } from 'redux-actions';
import { ConfigActions, ConfigActionPayload } from '../actions';
import { ConfigModel, TestModel, ProjectInfoModel, LayoutModel } from '../models';
import getDefaultConfig from 'data/getDefaultConfig';

export const configReducer = handleActions<ConfigModel, ConfigActionPayload>(
    {
        [ConfigActions.SET_CONFIG]: (state, action) => Object.assign({}, state, action.payload) as ConfigModel,
        [ConfigActions.SET_PROJECT_INFO]: (state, action) => ({ ...state, projectInfo: action.payload } as ConfigModel),
        [ConfigActions.ADD_TESTS]: (state, action) => ({
            ...state,
            tests: ([] as TestModel[]).concat(state.tests, (action.payload as unknown) as TestModel[]),
        }),
        [ConfigActions.SET_LAYOUT]: (state, action) => {
            const payload = (action.payload as unknown) as { key: keyof ConfigModel['layouts']; value: LayoutModel };
            return {
                ...state,
                layouts: {
                    ...state.layouts,
                    [payload.key]: payload.value,
                },
            };
        },
        [ConfigActions.SELECT_LAYOUT]: (state, action) => ({
            ...state,
            layoutSelection: (action.payload as unknown) as keyof ConfigModel['layouts'],
        }),
    },
    getDefaultConfig()
);

export default configReducer;
