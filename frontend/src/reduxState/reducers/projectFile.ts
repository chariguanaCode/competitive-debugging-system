import { handleActions } from 'redux-actions';
import { ProjectFileActions } from '../actions';
import { ProjectFileModel } from '../models';

export const projectFileReducer = handleActions<ProjectFileModel>(
    {
        [ProjectFileActions.SET_PROJECT_FILE]: (state, action) => action.payload,
        [ProjectFileActions.SET_PROJECT_FILE_SAVE_STATE]: (state, action) =>
            ({
                ...state,
                // @ts-ignore
                isSaved: action.payload as boolean,
            } as ProjectFileModel),
        [ProjectFileActions.UPDATE_PROJECT_FILE]: (state, action) =>
            ({
                ...state,
                ...action.payload,
            } as ProjectFileModel),
    },
    null
);

export default projectFileReducer;
