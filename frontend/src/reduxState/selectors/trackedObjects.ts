import { useSelector } from 'react-redux';
import { RootState } from '../';

export const useTrackedObjects = () => {
    return useSelector((state: RootState) => state.trackedObjects);
};

export const useTrackedObject = (id: string) => {
    return useSelector((state: RootState) => state.trackedObjects[id]);
};

export const useTrackedObjectKeys = () => {
    return Object.keys(useSelector((state: RootState) => state.trackedObjects));
};
