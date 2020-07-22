import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { createAction } from 'redux-actions';
import { ProjectFileModel } from '../models';

export enum ProjectFileAction {
    SET_PROJECT_FILE = 'SET_PROJECT_FILE',
}

export const useProjectFileActions = () => {
    const dispatch = useDispatch();
    const actions = {
        setProjectFile: createAction<ProjectFileModel>(ProjectFileAction.SET_PROJECT_FILE),
    };

    return useMemo(() => bindActionCreators(actions as any, dispatch), [dispatch]) as typeof actions;
};
