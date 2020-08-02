import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { createAction } from 'redux-actions';
import { FileManagerModel } from '../models';

export enum FileManagerActions {
    SET_FILE_MANAGER = 'SET_FILE_MANAGER',
}

export const useFileManagerActions = () => {
    const dispatch = useDispatch();
    const actions = {
        setFileManager: createAction<FileManagerModel>(FileManagerActions.SET_FILE_MANAGER),
    };

    return useMemo(() => bindActionCreators(actions as any, dispatch), [dispatch]) as typeof actions;
};
