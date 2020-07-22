import { handleActions } from 'redux-actions';
import { ConfigActions } from '../actions';
import { ConfigModel } from '../models';

export const configReducer = handleActions<ConfigModel>(
    {
        [ConfigActions.SET_CONFIG]: (state, action) => action.payload,
    },
    {
        projectInfo: {
            files: ['/home/charodziej/Documents/competitive-debugging-system/cpp/test.cpp'],
        },
    } as ConfigModel
);

export default configReducer;
