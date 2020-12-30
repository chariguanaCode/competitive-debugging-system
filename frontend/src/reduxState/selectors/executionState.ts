import { useSelector } from 'react-redux';
import { RootState } from '../';

export const useExecutionState = () => {
    return useSelector((state: RootState) => state.executionState);
};

export const useSourceHash = () => {
    return useSelector((state: RootState) => state.executionState.sourceHash);
};
