import { handleActions } from 'redux-actions';
import { ProjectFileAction } from '../actions';
import { ProjectFileModel } from '../models';

export const projectFileReducer = handleActions<ProjectFileModel>(
    {
        [ProjectFileAction.SET_PROJECT_FILE]: (state, action) => action.payload,
    },
    null
);

export default projectFileReducer;
