import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { createAction } from 'redux-actions';
import { ProjectFileModel } from '../models';

export enum ProjectFileActions {
    SET_PROJECT_FILE = 'SET_PROJECT_FILE',
    SET_PROJECT_FILE_SAVE_STATE = 'SET_PROJECT_FILE_SAVE_STATE',
    SET_PROJECT_FILE_PATH = 'SET_PROJECT_FILE_PATH',
    UPDATE_PROJECT_FILE = 'UPDATE_PROJECT_FILE',
}

const actions = {
    setProjectFile: createAction<ProjectFileModel>(ProjectFileActions.SET_PROJECT_FILE),
    setProjectFileSaveState: createAction<boolean>(ProjectFileActions.SET_PROJECT_FILE_SAVE_STATE),
    setProjectFilePath: createAction<string>(ProjectFileActions.SET_PROJECT_FILE_PATH),
    updateProjectFile: createAction<ProjectFileModel>(ProjectFileActions.UPDATE_PROJECT_FILE),
};

export const useProjectFileActions = () => {
    const dispatch = useDispatch();

    return useMemo(() => bindActionCreators(actions as any, dispatch), [dispatch]) as typeof actions;
};
