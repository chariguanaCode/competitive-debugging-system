import { useSelector } from 'react-redux';
import { RootState } from '..';

export const useWatchActionsHistory = () => {
    return useSelector((state: RootState) => state.watchActionsHistory.history);
};

export const useWatchHistoryLocation = () => {
    return useSelector((state: RootState) => state.watchActionsHistory.location);
};
