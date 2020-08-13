import { handleActions } from 'redux-actions';
import { ConfigActions, ConfigActionPayload } from '../actions';
import { ConfigModel, TestModel, ProjectInfoModel, LayoutModel } from '../models';
import getDefaultConfig from 'data/getDefaultConfig';

export const configReducer = handleActions<ConfigModel, ConfigActionPayload>(
    {
        [ConfigActions.SET_CONFIG]: (state, action) => (action.payload as unknown) as ConfigModel,
        [ConfigActions.SET_PROJECT_INFO]: (state, action) =>
            ({ ...state, ...((action.payload as unknown) as ProjectInfoModel) } as ConfigModel),
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
