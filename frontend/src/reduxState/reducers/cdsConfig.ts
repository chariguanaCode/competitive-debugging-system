import { handleActions } from 'redux-actions';
import { CdsConfigActions } from '../actions';
import { CdsConfigModel } from '../models';
import defaultCdsConfig from 'data/defaultCdsConfig.json';

export const csdConfigReducer = handleActions<CdsConfigModel>(
    {
        [CdsConfigActions.SET_CDS_CONFIG]: (state, action) => action.payload,
    },
    defaultCdsConfig
);

export default csdConfigReducer;
