import { useSelector } from 'react-redux';
import { RootState } from '../';

export const useFileManager = () => {
    return useSelector((state: RootState) => state.fileManager);
};
