import { useSelector } from 'react-redux';
import { RootState } from '../';

export const useWatchesActionsHistory = () => {
    return useSelector((state: RootState) => state.watchesActionsHistory);
};
