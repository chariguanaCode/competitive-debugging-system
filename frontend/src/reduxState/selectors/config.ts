import { useSelector } from 'react-redux';
import { RootState } from '../';

export const useConfig = () => {
    return useSelector((state: RootState) => state.config);
};
