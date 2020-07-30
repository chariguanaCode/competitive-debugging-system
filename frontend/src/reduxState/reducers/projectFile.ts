import { handleActions } from 'redux-actions';
import { ProjectFileActions } from '../actions';
import { ProjectFileModel } from '../models';

export const projectFileReducer = handleActions<ProjectFileModel>(
    {
        [ProjectFileActions.SET_PROJECT_FILE]: (state, action) => action.payload,
    },
    null
);

export default projectFileReducer;
