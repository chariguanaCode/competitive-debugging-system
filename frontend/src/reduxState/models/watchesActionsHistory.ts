type WatchActionModel = null

export type WatchesActionsHistoryModel = {
    [key: number]: {
        previousKey: number;
        nextKey: number;
        actions: {
            [key: string]: WatchActionModel;
        };
    };
};
