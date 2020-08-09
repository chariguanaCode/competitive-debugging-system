import { OneDimensionArrayAction } from './oneDimensionalArrayActions';
import { TwoDimensionArrayAction } from './twoDimensionalArrayActions';

export * from './oneDimensionalArrayActions';
export * from './twoDimensionalArrayActions';

export type WatchActionModel = (OneDimensionArrayAction | TwoDimensionArrayAction) & { targetObject: string };

export type WatchActionsHistoryModel = {
    history: {
        [key: string]: {
            previousKey: string;
            nextKey: string;
            actions: Array<WatchActionModel>;
        };
    };
    location: string;
};
