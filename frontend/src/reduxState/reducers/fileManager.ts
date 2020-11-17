import { handleActions } from 'redux-actions';
import { FileManagerActions } from '../actions';
import { FileManagerModel } from '../models';

export const FileManagerReducer = handleActions<FileManagerModel>(
    {
        [FileManagerActions.SET_FILE_MANAGER]: (state, action) => ({
            lastDirectory: state.lastDirectory,
            ...action.payload
        })
    },
    {
        open: false,
    }
);

export default FileManagerReducer;
