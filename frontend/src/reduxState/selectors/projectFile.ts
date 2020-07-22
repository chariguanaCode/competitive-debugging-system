import { useSelector } from 'react-redux';
import { RootState } from '../';

export const useProjectFile = () => {
    return useSelector((state: RootState) => state.projectFile);
};
