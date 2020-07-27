import { useSelector } from 'react-redux';
import { RootState } from '../';

export const useCdsConfig = () => {
    return useSelector((state: RootState) => state.cdsConfig);
};
