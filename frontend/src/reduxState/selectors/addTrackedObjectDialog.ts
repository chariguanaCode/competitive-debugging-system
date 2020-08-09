import { useSelector } from 'react-redux';
import { RootState } from '../';

export const useAddTrackedObjectDialog = () => {
    return useSelector((state: RootState) => state.addTrackedObjectDialog);
};
