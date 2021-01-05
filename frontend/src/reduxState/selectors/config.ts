import { useSelector } from 'react-redux';
import { RootState } from '../';

export const useConfig = () => {
    return useSelector((state: RootState) => state.config);
};

export const useLayouts = () => {
    return useSelector((state: RootState) => state.config.layouts);
};

export const useLayoutSelection = () => {
    return useSelector((state: RootState) => state.config.layoutSelection);
};

export const useWatchIdActions = () => {
    return useSelector((state: RootState) => state.config.watchesIdsActions);
};

export const useTrackedObjectConfig = () => {
    return useSelector((state: RootState) => state.config.trackedObjects);
};
